// server/routes/studentRoutes.js

import express from 'express';
import { getStudentProgress, getStudentById } from '../controllers/studentController.js';

const router = express.Router();

// This route handles GET requests to /api/students/progress
router.get('/progress', getStudentProgress);

// This new route handles GET requests for a single student by ID
router.get('/:id', getStudentById);

export default router;