
import fs from "fs/promises";
import { analyzeWithGemini } from "../services/ai/gemini.js"; // optional
import { extractPdfText } from "../services/pdf/extractTextPdfjs.js";
import { scoreResumeMultiFactor } from "../services/ats/atsScorer.js";
import ResumeScore from "../models/ResumeScore.js";
import crypto from "crypto";


export async function analyzeUpload(req, res) {
  console.log("ATS route hit!");
  const startTime = Date.now();

  try {
    const { jobDescription, jobTitle, companyName, resumeId } = req.body;
    if (!req.file || !jobDescription) {
      return res.status(400).json({ error: "Resume file and job description required" });
    }

    const filePath = req.file.path;
    const resumeFileName = req.file.originalname;

    let resumeText = "";

    try {
      if (req.file.mimetype === "application/pdf") {
        // you already read the file inside extractPdfText()—just pass the path
        resumeText = await extractPdfText(filePath);
      } else if (req.file.mimetype === "text/plain") {
        resumeText = await fs.readFile(filePath, "utf8");
      } else {
        return res.status(400).json({ error: "Unsupported file format" });
      }
    } catch (err) {
      console.error("PDF/TXT parse error:", err);
      return res.status(500).json({ error: "Failed to process resume file" });
    } finally {
      // cleanup
      try { await fs.unlink(filePath); } catch { }
    }

    if (!resumeText.trim()) {
      return res.status(422).json({
        error: "No selectable text found. If this is a scanned PDF, upload a text-based PDF or TXT.",
      });
    }

    // === our new multi-factor scoring ===
    const multi = await scoreResumeMultiFactor(resumeText, jobDescription);

    // === optional: LLM feedback (don't block if rate-limited) ===
    let geminiAnalysis = null;
    try {
      geminiAnalysis = await analyzeWithGemini(resumeText, jobDescription);
    } catch (e) {
      console.warn("Gemini unavailable, continuing with heuristic scoring only.");
    }

    // Use the overallScore from the scorer (already calculated)
    const overallScore = multi.overallScore ?? 0;

    // Prepare score breakdown for database using the correct structure
    const scoreBreakdown = {
      keywordMatch: {
        score: multi.factors?.keywords?.score ?? 0,
        details: multi.factors?.keywords || {}
      },
      skillsRelevance: {
        score: multi.factors?.semantic?.score ?? 0, // Using semantic as skills relevance
        details: multi.factors?.semantic || {}
      },
      experienceRelevance: {
        score: multi.factors?.actionImpact?.score ?? 0, // Using actionImpact as experience relevance
        details: multi.factors?.actionImpact || {}
      },
      educationRelevance: {
        score: multi.factors?.recency?.score ?? 0, // Using recency as education relevance
        details: multi.factors?.recency || {}
      },
      formatAndStructure: {
        score: multi.factors?.structure?.score ?? 0,
        details: multi.factors?.structure || {}
      }
    };

    // Validate that overallScore is a valid number before saving
    const validOverallScore = !isNaN(overallScore) && isFinite(overallScore) ? overallScore : 0;

    // Save score to database if user is authenticated
    if (req.user && req.user.userId) {
      try {
        const scoreData = {
          userId: req.user.userId,
          score: validOverallScore,
          scoreBreakdown,
          jobTitle: jobTitle || null,
          companyName: companyName || null,
          resumeFileName,
          resumeId: null, // ATS uploads don't have associated Resume documents
          processingTime: Date.now() - startTime,
          aiAnalysis: {
            feedback: geminiAnalysis?.feedback || "",
            suggestions: geminiAnalysis?.suggestions || [],
            strengths: geminiAnalysis?.strengths || [],
            improvements: geminiAnalysis?.improvements || [],
            skillGap: multi.skillGap || {},
            recommendations: multi.recommendations || []
          }
        };

        const newScoreEntry = new ResumeScore(scoreData);
        await newScoreEntry.save();

        console.log(`✅ Score saved for user ${req.user.userId}: ${validOverallScore}%`);
      } catch (saveError) {
        console.error("Failed to save score to database:", saveError);
        // Don't fail the entire process if score saving fails
      }
    }

    return res.json({
      message: "Resume analyzed successfully",
      resumeChars: resumeText.length,
      overallScore: validOverallScore,
      multiFactor: multi,
      skillGap: multi.skillGap,
      recommendations: multi.recommendations,
      geminiAnalysis, // may be null or an error; front-end can show a soft warning
      scoreSaved: !!req.user?.userId // Indicate if score was saved
    });
  } catch (err) {
    console.error("ATS Error:", err);
    return res.status(500).json({ error: "Failed to analyze resume" });
  }
}