
import express from "express";
import { getQuestions, submitAnswer } from "../controllers/questionController.js";
import { generateQuestion } from "../controllers/questionsController.js";

const router = express.Router();

// GET /api/questions?topic=xyz
router.get("/", getQuestions);

// POST /api/answers
router.post("/answers", submitAnswer);

// POST /api/questions/generate
router.post("/generate", generateQuestion);

export default router;
