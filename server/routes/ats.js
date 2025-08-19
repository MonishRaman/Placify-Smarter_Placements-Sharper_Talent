import express from "express";
import upload from "../middleware/uploadPdf.js";
import { analyzeUpload } from "../controllers/atsController.js";

const router = express.Router();

// POST /api/ats/upload
router.post("/upload", upload.single("resume"), analyzeUpload);

export default router;
