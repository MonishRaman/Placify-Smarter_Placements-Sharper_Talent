import express from "express";
import { getQuestions, submitAnswer } from "../controllers/questionController.js";

const router = express.Router();

// GET /api/questions?topic=xyz
router.get("/", getQuestions);

// POST /api/answers
router.post("/answers", submitAnswer);

export default router;
