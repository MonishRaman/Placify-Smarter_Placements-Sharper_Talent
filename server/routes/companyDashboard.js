import express from 'express';
import { getCompanyDashboard } from '../controllers/companyDashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Secured dashboard endpoint
router.get('/dashboard', authMiddleware, getCompanyDashboard);

export default router;
