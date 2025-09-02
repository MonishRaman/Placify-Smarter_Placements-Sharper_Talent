import express from "express";
import {
    saveResumeScore,
    getUserScoreHistory,
    getLatestScore,
    getUserScoreAnalytics,
    deleteScoreEntry,
    getAdminScoreAnalytics
} from "../controllers/resumeScoreController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ==================== RESUME SCORE ROUTES ====================

/**
 * All routes are protected and require authentication
 * Frontend should include JWT token in Authorization header:
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */

// SAVE a new resume score to user's history
// POST /api/resume/score
router.post("/", verifyToken(), saveResumeScore);

// GET user's score history with pagination
// GET /api/resume/score?limit=20&page=1&sortBy=createdAt&sortOrder=desc
router.get("/", verifyToken(), getUserScoreHistory);

// GET user's latest score
// GET /api/resume/score/latest
router.get("/latest", verifyToken(), getLatestScore);

// GET comprehensive analytics for user's scores
// GET /api/resume/score/analytics
router.get("/analytics", verifyToken(), getUserScoreAnalytics);

// ADMIN: GET platform-wide score analytics (admin only)
// GET /api/resume/score/admin/analytics
router.get("/admin/analytics", verifyToken(), getAdminScoreAnalytics);

// DELETE a specific score entry by ID (soft delete)
// DELETE /api/resume/score/:scoreId
router.delete("/:scoreId", verifyToken(), deleteScoreEntry);

export default router;

/**
 * FRONTEND INTEGRATION EXAMPLES:
 * 
 * 1. SAVE RESUME SCORE:
 * ```javascript
 * const scoreData = {
 *   score: 85,
 *   scoreBreakdown: {
 *     keywordMatch: { score: 90, details: { matched: ["react", "node"], total: 10 } },
 *     skillsRelevance: { score: 80, details: { relevant: 8, total: 10 } },
 *     experienceRelevance: { score: 85, details: { relevantYears: 3, requiredYears: 3 } },
 *     educationRelevance: { score: 75, details: { degree: "Bachelor", required: "Bachelor" } },
 *     formatAndStructure: { score: 95, details: { sections: 5, completeness: 0.9 } }
 *   },
 *   jobTitle: "Full Stack Developer",
 *   companyName: "Tech Corp",
 *   resumeFileName: "john_doe_resume.pdf",
 *   resumeId: "optional_resume_id",
 *   aiAnalysis: {
 *     feedback: "Strong technical background with relevant experience...",
 *     suggestions: ["Add more quantified achievements", "Include cloud technologies"],
 *     strengths: ["Strong React skills", "Good project portfolio"],
 *     improvements: ["Add leadership experience", "Include certifications"]
 *   }
 * };
 * 
 * fetch('/api/resume/score', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify(scoreData)
 * });
 * ```
 * 
 * 2. GET SCORE HISTORY:
 * ```javascript
 * fetch('/api/resume/score?limit=20&page=1&sortBy=createdAt&sortOrder=desc', {
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 * ```
 * 
 * 3. GET LATEST SCORE:
 * ```javascript
 * fetch('/api/resume/score/latest', {
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 * ```
 * 
 * 4. GET USER ANALYTICS:
 * ```javascript
 * fetch('/api/resume/score/analytics', {
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 * ```
 * 
 * 5. DELETE SCORE ENTRY:
 * ```javascript
 * fetch('/api/resume/score/64a1b2c3d4e5f6789012345', {
 *   method: 'DELETE',
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 * ```
 * 
 * 6. ADMIN ANALYTICS (admin only):
 * ```javascript
 * fetch('/api/resume/score/admin/analytics', {
 *   headers: {
 *     'Authorization': `Bearer ${adminToken}`
 *   }
 * });
 * ```
 */
