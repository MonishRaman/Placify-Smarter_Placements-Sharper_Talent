import express from "express";
import {
    createResume,
    getResumesByUserId,
    getResumeById,
    updateResume,
    deleteResume,
    getResumeAnalytics
} from "../controllers/resumeController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ==================== RESUME ROUTES ====================

/**
 * All routes are protected and require authentication
 * Frontend should include JWT token in Authorization header:
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */

// CREATE a new resume
// POST /api/resume
router.post("/", verifyToken(), createResume);

// GET all resumes for the authenticated user
// GET /api/resume
router.get("/", verifyToken(), getResumesByUserId);

// GET analytics for user's resumes (optional advanced feature)
// GET /api/resume/analytics
router.get("/analytics", verifyToken(), getResumeAnalytics);

// GET a specific resume by ID
// GET /api/resume/:resumeId
router.get("/:resumeId", verifyToken(), getResumeById);

// UPDATE a specific resume by ID
// PUT /api/resume/:resumeId
router.put("/:resumeId", verifyToken(), updateResume);

// DELETE a specific resume by ID (soft delete)
// DELETE /api/resume/:resumeId
router.delete("/:resumeId", verifyToken(), deleteResume);

export default router;

/**
 * FRONTEND INTEGRATION EXAMPLES:
 * 
 * 1. CREATE RESUME:
 * ```javascript
 * const createResumeData = {
 *   fullName: "John Doe",
 *   email: "john@example.com",
 *   phone: "+1234567890",
 *   summary: "Experienced software developer with 5+ years...",
 *   skills: ["JavaScript", "React", "Node.js", "MongoDB"],
 *   education: [
 *     {
 *       institution: "University of Example",
 *       degree: "Bachelor of Computer Science",
 *       startDate: "2018",
 *       endDate: "2022",
 *       description: "Graduated with honors..."
 *     }
 *   ],
 *   workExperience: [
 *     {
 *       company: "Tech Corp",
 *       role: "Software Developer",
 *       startDate: "2022-01",
 *       endDate: "Present",
 *       description: "Developed web applications using React..."
 *     }
 *   ],
 *   projects: [
 *     {
 *       title: "E-commerce Platform",
 *       description: "Built a full-stack e-commerce solution...",
 *       techStack: ["React", "Node.js", "MongoDB"],
 *       link: "https://github.com/johndoe/ecommerce"
 *     }
 *   ]
 * };
 * 
 * fetch('/api/resume', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify(createResumeData)
 * });
 * ```
 * 
 * 2. GET USER'S RESUMES:
 * ```javascript
 * fetch('/api/resume', {
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 * ```
 * 
 * 3. GET SPECIFIC RESUME:
 * ```javascript
 * fetch(`/api/resume/${resumeId}`, {
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 * ```
 * 
 * 4. UPDATE RESUME:
 * ```javascript
 * const updateData = {
 *   fullName: "John Doe Updated",
 *   skills: ["JavaScript", "React", "Node.js", "Python", "Docker"]
 * };
 * 
 * fetch(`/api/resume/${resumeId}`, {
 *   method: 'PUT',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': `Bearer ${token}`
 *   },
 *   body: JSON.stringify(updateData)
 * });
 * ```
 * 
 * 5. DELETE RESUME:
 * ```javascript
 * fetch(`/api/resume/${resumeId}`, {
 *   method: 'DELETE',
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 * ```
 * 
 * RESPONSE FORMAT:
 * All endpoints return JSON in this format:
 * {
 *   success: boolean,
 *   message: string,
 *   data: object|array,
 *   count?: number (for list endpoints)
 * }
 */
