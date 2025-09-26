// Route for C/C++ Dry-Run
// Exposes POST /api/c-dry-run for C and C++ code validation using Gemini AI
// Well-commented for frontend integration

import express from "express";
import { dryRunC } from "../controllers/cDryRunController.js";

const router = express.Router();

/**
 * @route POST /api/c-dry-run
 * @desc Simulate C/C++ code execution using Gemini AI
 * @access Public
 *
 * Request body:
 *   {
 *     code: string (C or C++ code),
 *     language: 'c' | 'cpp',
 *     testCases: [ { input: string, expectedOutput: string } ]
 *   }
 *
 * Response:
 *   {
 *     success: boolean,
 *     results: [ { input, expectedOutput, actualOutput, passed } ],
 *     message: string
 *   }
 */
router.post("/", dryRunC);

export default router;
