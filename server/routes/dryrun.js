// dryrun.js
// Express route for Python dry-run validation


import express from 'express';
import { dryRunPython } from '../controllers/dryRunController.js';

const router = express.Router();

// POST /api/dryrun
// Body: { code: string, testCases: [{ input, expectedOutput }] }
router.post('/dryrun', dryRunPython);

export default router;
