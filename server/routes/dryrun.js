// dryrun.js
// Express route for Python dry-run validation

const express = require('express');
const { dryRunPython } = require('../controllers/dryRunController');

const router = express.Router();

// POST /api/dryrun
// Body: { code: string, testCases: [{ input, expectedOutput }] }
router.post('/dryrun', dryRunPython);

module.exports = router;
