import express from "express";
import {
    forgotPassword,
    resetPassword,
    getPasswordResetStats,
    manualCleanupTokens
} from "../controllers/passwordResetController.js";

/**
 * Password Reset Routes
 * 
 * Dedicated routes for password reset functionality
 * Separated from auth routes for better maintainability
 */

const router = express.Router();

// Public password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Admin/monitoring routes (you might want to add authentication middleware)
router.get("/stats", getPasswordResetStats);
router.post("/cleanup", manualCleanupTokens);

export default router;