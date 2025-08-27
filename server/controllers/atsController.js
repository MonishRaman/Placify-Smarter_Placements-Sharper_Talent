// server/controllers/atsController.js
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

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      (multi.keywordMatch * 0.3) +
      (multi.skillsRelevance * 0.25) +
      (multi.experienceRelevance * 0.2) +
      (multi.educationRelevance * 0.15) +
      (multi.formatAndStructure * 0.1)
    );

    // Prepare score breakdown for database
    const scoreBreakdown = {
      keywordMatch: {
        score: multi.keywordMatch,
        details: multi.keywordDetails || {}
      },
      skillsRelevance: {
        score: multi.skillsRelevance,
        details: multi.skillsDetails || {}
      },
      experienceRelevance: {
        score: multi.experienceRelevance,
        details: multi.experienceDetails || {}
      },
      educationRelevance: {
        score: multi.educationRelevance,
        details: multi.educationDetails || {}
      },
      formatAndStructure: {
        score: multi.formatAndStructure,
        details: multi.formatDetails || {}
      }
    };

    // Save score to database if user is authenticated
    if (req.user && req.user.userId) {
      try {
        const scoreData = {
          userId: req.user.userId,
          score: overallScore,
          scoreBreakdown,
          jobTitle: jobTitle || null,
          companyName: companyName || null,
          resumeFileName,
          resumeId: resumeId || null,
          processingTime: Date.now() - startTime,
          aiAnalysis: geminiAnalysis ? {
            feedback: geminiAnalysis.feedback || "",
            suggestions: geminiAnalysis.suggestions || [],
            strengths: geminiAnalysis.strengths || [],
            improvements: geminiAnalysis.improvements || []
          } : null
        };

        const newScoreEntry = new ResumeScore(scoreData);
        await newScoreEntry.save();

        console.log(`✅ Score saved for user ${req.user.userId}: ${overallScore}%`);
      } catch (saveError) {
        console.error("Failed to save score to database:", saveError);
        // Don't fail the request if score saving fails
      }
    }

    return res.json({
      message: "Resume analyzed successfully",
      resumeChars: resumeText.length,
      overallScore,
      multiFactor: multi,
      geminiAnalysis, // may be null or an error; front-end can show a soft warning
      scoreSaved: !!req.user?.userId // Indicate if score was saved
    });
  } catch (err) {
    console.error("ATS Error:", err);
    return res.status(500).json({ error: "Failed to analyze resume" });
  }
}
