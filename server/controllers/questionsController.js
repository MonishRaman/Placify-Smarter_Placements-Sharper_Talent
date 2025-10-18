import { generateAptitudeQuestionWithGemini } from "../services/ai/gemini.js";
import Question from "../models/Question.js";

/**
 * POST /api/questions/generate
 * Body: { topic: string, difficulty: string }
 * Returns: { question, options, answer, explanation }
 */
export async function generateQuestion(req, res) {
  const { topic, difficulty } = req.body;

  if (!topic || !difficulty) {
    return res.status(400).json({ error: "Topic and difficulty are required" });
  }

  try {
    const generated = await generateAptitudeQuestionWithGemini({
      topic,
      difficulty,
    });

    if (generated.error) {
      console.error(
        "[generateQuestion] Gemini generation error:",
        generated.error
      );
      return res
        .status(500)
        .json({ error: generated.error, raw: generated.raw });
    }

    const questionDoc = new Question({
      topic,
      difficulty,
      question: generated.question,
      options: generated.options,
      answer: generated.answer,
      explanation: generated.explanation,
      source: "gemini",
    });

    await questionDoc.save();
    return res.status(201).json(questionDoc);
  } catch (err) {
    console.error("[generateQuestion] Error:", err);
    return res.status(500).json({ error: "Failed to generate question" });
  }
}
