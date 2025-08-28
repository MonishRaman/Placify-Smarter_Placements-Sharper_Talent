import { unified } from "unified";
import retextEnglish from "retext-english";
import retextReadability from "retext-readability";
import retextPassive from "retext-passive";
import retextRepeatedWords from "retext-repeated-words";
import retextIndefiniteArticle from "retext-indefinite-article";
import retextStringify from "retext-stringify";
import stringSimilarity from "string-similarity";
import { pipeline } from "@xenova/transformers"; // Example: SBERT via transformers.js (or use OpenAI API)


const tokenize = (s) => (s?.toLowerCase().match(/[a-z0-9+#.\-]+/g) || []);

// Minimal, curated stopwords (extend as needed)
const STOPWORDS = new Set([
  "job","title","description","we","are","looking","join","our","help","ideal",
  "candidate","should","have","both","work","fast-paced","environment",
  "responsibilities","requirements","preferred","excellent","opportunity",
  "role","skills","must","be","with","and","the","a","an","in","of","for","on",
  "to","by","as","is","at","from","that","other","like"
]);

// Normalize tech synonyms to a canonical token
const CANON = new Map(Object.entries({
  "react":"react.js","reactjs":"react.js","react.js":"react.js",
  "node":"node.js","nodejs":"node.js","node.js":"node.js",
  "express":"express.js","expressjs":"express.js","express.js":"express.js",
  "typescript":"typescript","ts":"typescript",
  "javascript":"javascript","js":"javascript",
  "postgres":"postgresql","postgresql":"postgresql","postgre":"postgresql",
  "mongo":"mongodb","mongodb":"mongodb",
  "rest":"rest","restful":"rest",
  "api":"api","apis":"api",
  "docker":"docker","kubernetes":"kubernetes","k8s":"kubernetes",
  "git":"git","github":"git",
  "next":"next.js","nextjs":"next.js","next.js":"next.js",
  "solidity":"solidity","ethereum":"ethereum","web3":"web3",
  "ml":"ml","ai":"ai","ci":"ci","cd":"cd","pipeline":"pipeline","pipelines":"pipeline",
}));

const ACTION_VERBS = new Set([
  "built","developed","designed","implemented","delivered","led","owned","created",
  "refactored","optimized","automated","migrated","launched","deployed","integrated",
  "scaled","improved","reduced","increased","collaborated","mentored","debugged",
  "tested","documented"
]);

const MONTHS = "(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*";
const YEAR = "(20\\d{2}|19\\d{2})";
const DATE_RE = new RegExp(`(${MONTHS}\\s*${YEAR}|${YEAR})`, "ig");

// --- helpers ---
function canonize(tokens) {
  return tokens.map(t => CANON.get(t) || t);
}

function filterStop(tokens) {
  return tokens.filter(t => !STOPWORDS.has(t));
}

function jaccard(a, b) {
  const A = new Set(a), B = new Set(b);
  const inter = [...A].filter(x => B.has(x)).length;
  const union = new Set([...A, ...B]).size || 1;
  return inter / union; // 0..1
}

function pct(x, max=1) { return Math.max(0, Math.min(100, (100 * x) / max)); }

// --- factor 1: keyword match ---
function scoreKeywords(resumeText, jdText) {
  const r = new Set(canonize(filterStop(tokenize(resumeText))));
  const j = [...new Set(canonize(filterStop(tokenize(jdText))))];

  const matched = j.filter(w => r.has(w));
  const missing = j.filter(w => !r.has(w));
  const score = Math.round((matched.length / (j.length || 1)) * 100);

  return { score, matched, missing, total: j.length };
}

// --- factor 2: semantic similarity (fallback: fuzz + jaccard) ---
function scoreSemantic(resumeText, jdText) {
  const r = filterStop(tokenize(resumeText)).join(" ");
  const j = filterStop(tokenize(jdText)).join(" ");
  // cosine-ish from string-similarity (0..1)
  const cosine = stringSimilarity.compareTwoStrings(r, j) || 0;
  // jaccard on canonical tokens
  const jac = jaccard(
    new Set(canonize(filterStop(tokenize(resumeText)))),
    new Set(canonize(filterStop(tokenize(jdText))))
  );
  // blend
  const blended = 0.6 * cosine + 0.4 * jac; // heuristic
  return { score: Math.round(pct(blended)), cosine, jac };
}

// --- factor 3: structure (sections + bullets balance) ---
function scoreStructure(resumeText) {
  const text = resumeText.toLowerCase();

  const has = (h) => new RegExp(`\\b${h}\\b`, "i").test(text);
  const sections = {
    summary: has("summary|objective"),
    skills: has("skills"),
    experience: has("experience|work experience|professional experience"),
    projects: has("projects"),
    education: has("education"),
    certifications: has("certifications|licenses"),
  };

  const required = ["skills","experience","education"];
  const reqHits = required.filter(k => sections[k]).length;

  const lines = resumeText.split(/\r?\n/);
  const bullets = lines.filter(l => /^[\s>•*\-\u2022·]/.test(l)).length;
  const bulletRatio = bullets / (lines.length || 1); // 0..1 ideal ~0.3–0.8

  let score = 0;
  score += (reqHits / required.length) * 60; // up to 60
  score += (["summary","projects","certifications"].filter(k => sections[k]).length / 3) * 20; // up to 20

  // bullet ratio: perfect at 0.5, linear penalty outside 0.3..0.8
  const ideal = 0.5;
  const delta = Math.abs(bulletRatio - ideal);
  const bulletScore = Math.max(0, 20 - (delta / 0.5) * 20); // 0..20
  score += bulletScore;

  return { 
    score: Math.round(score), 
    sections, 
    bulletRatio: Number(bulletRatio.toFixed(2)) 
  };
}

// --- factor 4: grammar & readability (retext) ---
export async function scoreGrammar(resumeText) {
  const processor = unified()
    .use(retextEnglish)
    .use(retextReadability, { age: 22 }) // assume professional audience
    .use(retextPassive)
    .use(retextRepeatedWords)
    .use(retextIndefiniteArticle)
    .use(retextStringify); // ✅ compiler added

  const file = await processor.process(resumeText);
  const messages = file.messages || [];

  const issues = {
    passive: messages.filter(m => m.source === "retext-passive").length,
    repeated: messages.filter(m => m.source === "retext-repeated-words").length,
    articles: messages.filter(m => m.source === "retext-indefinite-article").length,
    hardSentences: messages.filter(m => m.source === "retext-readability").length,
  };

  // Simple scoring: fewer issues per 1k chars => better
  const perK =
    (issues.passive +
      issues.repeated +
      issues.articles +
      issues.hardSentences) /
    ((resumeText.length || 1) / 1000);

  const score = Math.round(
    Math.max(0, 100 - Math.min(100, perK * 15))
  ); // heuristic

  return {
    score,
    issues,
    totalIssues: Object.values(issues).reduce((a, b) => a + b, 0),
  };
}

// --- factor 5: action & impact (verbs + numbers) ---
function scoreActionImpact(resumeText) {
  const lines = resumeText.split(/\r?\n/);
  const bulletLines = lines.filter(l => /^[\s>•*\-\u2022·]/.test(l));
  const bullets = bulletLines.length || 1;

  const startsWithAction = bulletLines.filter(l => {
    const word = (l.replace(/^[\s>•*\-\u2022·]+/,"").match(/^[a-z]+/i) || [""])[0].toLowerCase();
    return ACTION_VERBS.has(word);
  }).length;

  const bulletsWithNumbers = bulletLines.filter(l => /\d+%?|\b\d+\b/.test(l)).length;

  const actionRatio = startsWithAction / bullets;  // ideal 0.7+
  const numberRatio = bulletsWithNumbers / bullets; // ideal 0.4+

  let score = 0;
  score += Math.min(70, actionRatio * 100);  // cap at 70
  score += Math.min(30, numberRatio * 75);   // cap at 30

  return {
    score: Math.round(score),
    actionVerbRatio: Number(actionRatio.toFixed(2)),
    bulletsWithNumbers,
    bulletsTotal: bullets
  };
}

// --- factor 6: recency & chronology ---
function scoreRecency(resumeText) {
  const years = (resumeText.match(DATE_RE) || [])
    .map(x => (x.match(/\d{4}/) || [])[0])
    .filter(Boolean)
    .map(Number)
    .sort((a,b)=>b-a);

  const now = new Date().getFullYear();
  const mostRecent = years[0] || null;
  const yearsAgo = mostRecent ? Math.max(0, now - mostRecent) : 99;

  // Recent within 1 year => 100; 5 years => ~40; >10 => ~0
  const score = Math.round(Math.max(0, 100 - yearsAgo * 15));

  return { score, mostRecentYear: mostRecent, yearsSinceRecent: mostRecent ? yearsAgo : null };
}

// --- parseability (text presence) ---
function scoreParseability(resumeText) {
  const chars = (resumeText || "").trim().length;
  if (chars < 300) return { score: 10, note: "Very little selectable text (possible scanned PDF).", chars };
  if (chars < 800) return { score: 50, note: "Low text volume; consider text-based PDF.", chars };
  return { score: 100, note: "Good amount of selectable text.", chars };
}

export async function scoreResumeMultiFactor(resumeText, jobDescription, opts = {}) {
  // weights (sum to 100). If you enable real LLM semantic scoring later, bump semantic to ~25–35.
  const weights = {
    keywords: 35,
    semantic: 10,         // heuristic + fuzz (no LLM). Set to 0 if you dislike.
    structure: 15,
    grammar: 10,
    actionImpact: 15,
    recency: 10,
    parseability: 5
  };

  const keywords = scoreKeywords(resumeText, jobDescription);
  const semantic = scoreSemantic(resumeText, jobDescription);
  const structure = scoreStructure(resumeText);
  const grammar = await scoreGrammar(resumeText);
  const actionImpact = scoreActionImpact(resumeText);
  const recency = scoreRecency(resumeText);
  const parseability = scoreParseability(resumeText);

  const overall =
      (keywords.score * weights.keywords) +
      (semantic.score * weights.semantic) +
      (structure.score * weights.structure) +
      (grammar.score * weights.grammar) +
      (actionImpact.score * weights.actionImpact) +
      (recency.score * weights.recency) +
      (parseability.score * weights.parseability);

  const totalWeight = Object.values(weights).reduce((a,b)=>a+b,0);
  const overallScore = Math.round(overall / totalWeight);

  return {
    overallScore,
    weights,
    factors: { keywords, semantic, structure, grammar, actionImpact, recency, parseability },
  };
}

// --- factor 2: semantic similarity (NLP-based) ---
async function scoreSemanticNLP(resumeText, jdText) {
  // Use SBERT or similar model for embedding-based similarity
  // This is a placeholder for actual implementation
  // For production, use a backend service or OpenAI API for embeddings
  try {
    const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const [resumeEmb, jdEmb] = await Promise.all([
      embedder(resumeText),
      embedder(jdText)
    ]);
    // Compute cosine similarity between embeddings
    function cosineSimilarity(a, b) {
      const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
      const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
      return dot / (normA * normB);
    }
    const score = Math.round(pct(cosineSimilarity(resumeEmb[0], jdEmb[0])));
    return { score, cosine: score / 100 };
  } catch (e) {
    // Fallback to existing heuristic if NLP fails
    return scoreSemantic(resumeText, jdText);
  }
}

// --- Skill gap analysis ---
function analyzeSkillGap(resumeSkills, jdSkills) {
  const missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));
  const weakSkills = resumeSkills.filter(skill => !jdSkills.includes(skill));
  return { missingSkills, weakSkills };
}

// --- Personalized recommendations ---
function generateRecommendations(missingSkills) {
  return missingSkills.map(skill => `Take a course or assessment in ${skill} to improve your match score.`);
}

// --- Main multi-factor scorer ---
export async function scoreResumeMultiFactor(resumeText, jdText) {
  // Extract skills from resume and JD (simple token extraction, can be improved)
  const resumeTokens = canonize(filterStop(tokenize(resumeText)));
  const jdTokens = canonize(filterStop(tokenize(jdText)));
  const resumeSkills = [...new Set(resumeTokens)];
  const jdSkills = [...new Set(jdTokens)];

  // Keyword match
  const keywords = scoreKeywords(resumeText, jdText);
  // Semantic similarity (NLP)
  const semantic = await scoreSemanticNLP(resumeText, jdText);
  // Structure
  const structure = scoreStructure(resumeText);
  // Grammar
  const grammar = await scoreGrammar(resumeText);
  // Action/impact
  const actionImpact = scoreActionImpact(resumeText);

  // Skill gap analysis
  const skillGap = analyzeSkillGap(resumeSkills, jdSkills);
  // Recommendations
  const recommendations = generateRecommendations(skillGap.missingSkills);

  // Overall score (weighted average)
  const overallScore = Math.round(
    0.25 * keywords.score +
    0.25 * semantic.score +
    0.15 * structure.score +
    0.15 * grammar.score +
    0.2 * actionImpact.score
  );

  return {
    overallScore,
    factors: { keywords, semantic, structure, grammar, actionImpact },
    skillGap,
    recommendations
  };
}