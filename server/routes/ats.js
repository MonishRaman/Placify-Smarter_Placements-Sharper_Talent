import express from "express";
import upload from "../middleware/uploadPdf.js";
import { analyzeUpload } from "../controllers/atsController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/ats/upload - with optional authentication for score saving
router.post("/upload", upload.single("resume"), verifyToken([], true), analyzeUpload);

export default router;
