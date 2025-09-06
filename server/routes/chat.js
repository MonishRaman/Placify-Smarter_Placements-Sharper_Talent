import express from "express";
import { chatHandler } from "../controllers/chatController.js";

const router = express.Router();

// POST /api/chat
router.post("/", chatHandler);

export default router;
