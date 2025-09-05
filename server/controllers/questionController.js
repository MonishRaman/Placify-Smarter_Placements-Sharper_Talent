import Question from "../models/Question.js";

// GET /questions?topic=xyz
export const getQuestions = async (req, res) => {
    try {
        const { topic } = req.query;
        const filter = topic ? { topic } : {};
        const questions = await Question.find(filter);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch questions" });
    }
};

// POST /answers
export const submitAnswer = async (req, res) => {
    try {
        const { questionId, selectedAnswer } = req.body;
        if (!questionId || !selectedAnswer) {
            return res.status(400).json({ error: "Missing questionId or selectedAnswer" });
        }
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: "Question not found" });
        }
        const isCorrect = question.answer === selectedAnswer;
        res.json({
            correct: isCorrect,
            explanation: question.explanation || "",
            answer: question.answer
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to submit answer" });
    }
};
