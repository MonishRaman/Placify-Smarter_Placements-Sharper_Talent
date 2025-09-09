import fs from "fs/promises";
import { analyzeWithGemini } from "../services/ai/gemini.js";
import { extractPdfText } from "../services/pdf/extractTextPdfjs.js";
import { scoreResumeMultiFactor } from "../services/ats/atsScorer.js";
import ResumeScore from "../models/ResumeScore.js";

// ==================== UTILITY FUNCTIONS ====================
const handleErrorResponse = (res, error, context) => {
  console.error(`Error in ${context}:`, error);
  return res.status(500).json({
    error: `Failed to ${context}`,
    details: error.message,
  });
};

const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.warn("Could not delete temporary file:", filePath);
  }
};

const validateInput = (req) => {
  if (!req.file || !req.body.jobDescription) {
    return {
      valid: false,
      error: "Resume file and job description required",
    };
  }
  return { valid: true };
};

const extractResumeText = async (file) => {
  const { path: filePath, mimetype } = file;

  try {
    if (mimetype === "application/pdf") {
      return await extractPdfText(filePath);
    } else if (mimetype === "text/plain") {
      return await fs.readFile(filePath, "utf8");
    } else {
      throw new Error("Unsupported file format");
    }
  } finally {
    await cleanupFile(filePath);
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
  console.log("ATS analysis started");

  try {
    // Validate input
    const validation = validateInput(req);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const { jobDescription, jobTitle, companyName } = req.body;
    const resumeFileName = req.file.originalname;

    // Extract resume text
    let resumeText;
    try {
      resumeText = await extractResumeText(req.file);
    } catch (error) {
      console.error("File processing error:", error);
      return res.status(500).json({ error: "Failed to process resume file" });
    }

    // Validate extracted text
    if (!resumeText.trim()) {
      return res.status(422).json({
        error:
          "No selectable text found. If this is a scanned PDF, upload a text-based PDF or TXT.",
      });
    }

    // Execute analysis in parallel where possible
    const [multi, geminiAnalysis] = await Promise.allSettled([
      scoreResumeMultiFactor(resumeText, jobDescription),
      analyzeWithGemini(resumeText, jobDescription).catch((error) => {
        console.warn("Gemini analysis failed:", error.message);
        return null;
      }),
    ]);

    // Handle analysis results
    if (multi.status === "rejected") {
      console.error("Multi-factor scoring failed:", multi.reason);
      return res
        .status(500)
        .json({ error: "Failed to analyze resume content" });
    }

    const multiResult = multi.value;
    const geminiResult =
      geminiAnalysis.status === "fulfilled" ? geminiAnalysis.value : null;

    // Calculate overall score
    const overallScore = getValidOverallScore(multiResult.overallScore);

    // Prepare response data
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

    // Save score to database if user is authenticated (non-blocking)
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

        // Save score asynchronously without blocking response
        ResumeScore.create(scoreData)
          .then(() => {
            console.log(
              `✅ Score saved for user ${req.user.userId}: ${overallScore}%`
            );
          })
          .catch((saveError) => {
            console.error("Failed to save score to database:", saveError);
          });

        responseData.scoreSaved = true;
      } catch (saveError) {
        console.error("Error preparing score data:", saveError);
      }
    }

    console.log(`ATS analysis completed in ${Date.now() - startTime}ms`);
    return res.json(responseData);
  } catch (error) {
    return handleErrorResponse(res, error, "analyze resume");
  }
}
