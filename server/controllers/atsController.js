import fs from "fs/promises";
import { analyzeWithGemini } from "../services/ai/gemini.js";
import { extractPdfText } from "../services/pdf/extractTextPdfjs.js";
import { scoreResumeMultiFactor } from "../services/ats/atsScorer.js";
import ResumeScore from "../models/ResumeScore.js";
import logger from '../utils/logger.js';

// ==================== UTILITY FUNCTIONS ====================
const handleErrorResponse = (res, error, context) => {
  logger.error(`Error in ${context}:`, error);
  return res.status(500).json({
    error: `Failed to ${context}`,
    details: error.message,
  });
};

const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch {
    logger.warn("Could not delete temporary file:", filePath);
  }
};

const validateInput = ({ file, body }) =>
  file && body.jobDescription
    ? { valid: true }
    : { valid: false, error: "Resume file and job description required" };

const extractResumeText = async ({ path, mimetype }) => {
  try {
    if (mimetype === "application/pdf") return await extractPdfText(path);
    if (mimetype === "text/plain") return await fs.readFile(path, "utf8");
    throw new Error("Unsupported file format");
  } finally {
    await cleanupFile(path);
  }
};

const prepareScoreBreakdown = (multi) => ({
  keywordMatch: {
    score: multi.factors?.keywords?.score ?? 0,
    details: multi.factors?.keywords || {},
  },
  skillsRelevance: {
    score: multi.factors?.semantic?.score ?? 0,
    details: multi.factors?.semantic || {},
  },
  experienceRelevance: {
    score: multi.factors?.actionImpact?.score ?? 0,
    details: multi.factors?.actionImpact || {},
  },
  educationRelevance: {
    score: multi.factors?.recency?.score ?? 0,
    details: multi.factors?.recency || {},
  },
  formatAndStructure: {
    score: multi.factors?.structure?.score ?? 0,
    details: multi.factors?.structure || {},
  },
});

const getValidOverallScore = (score) => {
  const numericScore = Number(score);
  return !isNaN(numericScore) && isFinite(numericScore) ? numericScore : 0;
};

// ==================== MAIN ANALYSIS FUNCTION ====================
export async function analyzeUpload(req, res) {
  const startTime = Date.now();
  logger.debug("ATS analysis started");

  try {
    // Validate input
    const validation = validateInput(req);
    if (!validation.valid)
      return res.status(400).json({ error: validation.error });

    const { jobDescription, jobTitle, companyName } = req.body;
    const resumeFileName = req.file.originalname;

    // Extract resume text
    let resumeText;
    try {
      resumeText = await extractResumeText(req.file);
    } catch (error) {
      logger.error("File processing error:", error);
      return res.status(500).json({ error: "Failed to process resume file" });
    }

    if (!resumeText.trim()) {
      return res.status(422).json({
        error:
          "No selectable text found. If this is a scanned PDF, upload a text-based PDF or TXT.",
      });
    }

    // Parallel analysis
    const [multi, geminiAnalysis] = await Promise.allSettled([
      scoreResumeMultiFactor(resumeText, jobDescription),
      analyzeWithGemini(resumeText, jobDescription).catch((err) => {
        logger.warn("Gemini analysis failed:", err.message);
        return null;
      }),
    ]);

    if (multi.status === "rejected") {
      logger.error("Multi-factor scoring failed:", multi.reason);
      return res
        .status(500)
        .json({ error: "Failed to analyze resume content" });
    }

    const multiResult = multi.value;
    const geminiResult =
      geminiAnalysis.status === "fulfilled" ? geminiAnalysis.value : null;

    const overallScore = getValidOverallScore(multiResult.overallScore);

    const responseData = {
      message: "Resume analyzed successfully",
      resumeChars: resumeText.length,
      overallScore,
      multiFactor: multiResult,
      skillGap: multiResult.skillGap || {},
      recommendations: multiResult.recommendations || [],
      geminiAnalysis: geminiResult,
      scoreSaved: false,
    };

    // Save score asynchronously if authenticated
    if (req.user?.userId) {
      try {
        const scoreBreakdown = prepareScoreBreakdown(multiResult);
        const scoreData = {
          userId: req.user.userId,
          score: overallScore,
          scoreBreakdown,
          jobTitle: jobTitle || null,
          companyName: companyName || null,
          resumeFileName,
          resumeId: null,
          processingTime: Date.now() - startTime,
          aiAnalysis: {
            feedback: geminiResult?.feedback || "",
            suggestions: geminiResult?.suggestions || [],
            strengths: geminiResult?.strengths || [],
            improvements: geminiResult?.improvements || [],
            skillGap: multiResult.skillGap || {},
            recommendations: multiResult.recommendations || [],
          },
        };

        ResumeScore.create(scoreData)
          .then(() =>
            logger.debug(
              `✅ Score saved for user ${req.user.userId}: ${overallScore}%`
            )
          )
          .catch((err) =>
            logger.error("Failed to save score to database:", err)
          );

        responseData.scoreSaved = true;
      } catch (err) {
        logger.error("Error preparing score data:", err);
      }
    }

    logger.debug(`ATS analysis completed in ${Date.now() - startTime}ms`);
    return res.json(responseData);
  } catch (error) {
    return handleErrorResponse(res, error, "analyze resume");
  }
}
