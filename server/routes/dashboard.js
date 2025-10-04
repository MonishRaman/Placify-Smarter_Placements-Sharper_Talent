import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { getUserDashboardData } from '../controllers/dashboardController.js';

const router = express.Router();

// Unified dashboard endpoint for any authenticated user
router.get('/dashboard', verifyToken(), getUserDashboardData);

export default router;
