// server/routes/javaDryRun.js
// Route for Java Dry-Run API
import express from 'express';
import { dryRunJava } from '../controllers/javaDryRunController.js';

const router = express.Router();

// POST /api/java-dry-run
// Body: { code: string, testCases: [{ input, expectedOutput }] }
// Returns: { success, results, message }
router.post('/java-dry-run', dryRunJava);

export default router;
