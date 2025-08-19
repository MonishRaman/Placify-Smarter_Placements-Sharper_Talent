// server/controllers/atsController.js
import fs from "fs/promises";
import { analyzeWithGemini } from "../services/ai/gemini.js"; // optional
import { extractPdfText } from "../services/pdf/extractTextPdfjs.js";
import { scoreResumeMultiFactor } from "../services/ats/atsScorer.js";

export async function analyzeUpload(req, res) {
  console.log("ATS route hit!");
  try {
    const { jobDescription } = req.body;
    if (!req.file || !jobDescription) {
      return res.status(400).json({ error: "Resume file and job description required" });
    }

    const filePath = req.file.path;
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
      try { await fs.unlink(filePath); } catch {}
    }

    if (!resumeText.trim()) {
      return res.status(422).json({
        error: "No selectable text found. If this is a scanned PDF, upload a text-based PDF or TXT.",
      });
    }

    // === our new multi-factor scoring ===
    const multi = await scoreResumeMultiFactor(resumeText, jobDescription);

    // === optional: LLM feedback (don’t block if rate-limited) ===
    let geminiAnalysis = null;
    try {
      geminiAnalysis = await analyzeWithGemini(resumeText, jobDescription);
    } catch (e) {
      console.warn("Gemini unavailable, continuing with heuristic scoring only.");
    }

    return res.json({
      message: "Resume analyzed successfully",
      resumeChars: resumeText.length,
      multiFactor: multi,
      geminiAnalysis, // may be null or an error; front-end can show a soft warning
    });
  } catch (err) {
    console.error("ATS Error:", err);
    return res.status(500).json({ error: "Failed to analyze resume" });
  }
}
