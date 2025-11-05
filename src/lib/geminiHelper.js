import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const fallbackQuestionBank = {
  generic: [
    "Can you explain your most challenging project and how you handled it?",
    "Describe how you approach debugging complex issues.",
    "Explain your experience with team collaboration in technical projects.",
    "What are your strengths and weaknesses as a developer?",
    "How do you handle tight deadlines or high-pressure situations?",
  ],
  javascript: [
    "What is event loop in JavaScript?",
    "Explain async/await and how it works under the hood.",
    "What are closures and why are they important?",
    "How do you handle memory leaks in JS applications?",
    "Explain difference between var, let, and const.",
  ],
  react: [
    "What are React hooks and why were they introduced?",
    "Explain how useEffect works and common pitfalls.",
    "What is reconciliation in React?",
    "How does React handle performance optimization?",
    "Explain React context API and its use cases.",
  ],
};

let askedFallbackQuestions = [];

// Retry helper
async function retry(fn, retries = 2, delay = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

function getAdaptiveFallback(role, previousAnswers) {
  // Fallback to "generic" if role is undefined or empty
  const safeRole = (role || "generic").toLowerCase();

  let domain = "generic";
  if (safeRole.includes("react")) domain = "react";
  else if (safeRole.includes("javascript") || safeRole.includes("frontend"))
    domain = "javascript";

  // Avoid repeating same fallback question
  const pool = fallbackQuestionBank[domain].filter(
    (q) => !askedFallbackQuestions.includes(q)
  );
  const nextQ = pool.length
    ? pool[Math.floor(Math.random() * pool.length)]
    : fallbackQuestionBank.generic[
        Math.floor(Math.random() * fallbackQuestionBank.generic.length)
      ];

  askedFallbackQuestions.push(nextQ);
  return nextQ;
}

export async function getNextQuestion(
  role = "Software Engineer",
  previousAnswers
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are acting as a highly experienced technical interviewer (15+ years) for ${role} positions. 
You have only 10 questions to fully evaluate the candidate's technical and behavioral abilities.

Candidate's previous answers: ${JSON.stringify(previousAnswers)}

**Your task:**
1. Evaluate candidate responses. Ignore irrelevant, short, or meaningless answers like "yhgh", "idk", "nothing", or single random words.
2. Adaptively choose the next best question that will effectively assess their skills if previous answers lacked depth.
3. Ensure your question sequence covers:
   - Core technical knowledge relevant to ${role}
   - Problem-solving approach
   - Practical experience
   - Behavioral attributes (teamwork, challenges, deadlines)
4. Questions must be short, clear, and professional (max 20 words).
5. Do not repeat previously asked questions.
6. If you already asked 10 questions, respond only with: "End Interview"

**Important:** 
Respond with only the next question text, no explanations, no greetings, no extra words.
`;

    const result = await retry(() => model.generateContent(prompt), 2, 1500);

    if (!result.response) throw new Error("No response from Gemini API");

    const text = result.response.text().trim();
    logger.debug("Gemini Next Question:", text);

    return text;
  } catch (error) {
    logger.error("Gemini API Error (fallback triggered):", error);
    return getAdaptiveFallback(role, previousAnswers);
  }
}
