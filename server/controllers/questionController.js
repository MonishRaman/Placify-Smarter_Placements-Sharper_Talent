import Question from "../models/Question.js";
import logger from '../utils/logger.js';

// GET /questions?topic=xyz
export const getQuestions = async (req, res) => {
  try {
    const { topic } = req.query;
    const filter = topic ? { topic } : {};
    const questions = await Question.find(filter);
    res.status(200).json(questions);
  } catch (error) {
    logger.error("❌ Failed to fetch questions:", error.message);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

// POST /answers
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body;

    if (!questionId || !selectedAnswer) {
      return res
        .status(400)
        .json({ error: "Missing questionId or selectedAnswer" });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    const isCorrect = question.answer === selectedAnswer;

    res.status(200).json({
      correct: isCorrect,
      explanation: question.explanation || "",
      answer: question.answer,
    });
  } catch (error) {
    logger.error("❌ Failed to submit answer:", error.message);
    res.status(500).json({ error: "Failed to submit answer" });
  }
};
