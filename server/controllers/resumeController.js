import Resume from "../models/Resume.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// ==================== CREATE RESUME ====================
/**
 * Creates a new resume for the authenticated user
 * 
 * Frontend Integration Example:
 * POST /api/resume
 * Headers: { Authorization: "Bearer <jwt_token>" }
 * Body: {
 *   fullName: "John Doe",
 *   email: "john@example.com",
 *   phone: "+1234567890",
 *   summary: "Experienced software developer...",
 *   skills: ["JavaScript", "React", "Node.js"],
 *   education: [...],
 *   workExperience: [...],
 *   projects: [...]
 * }
 */
export const createResume = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Validate required fields
        const { fullName, email, phone } = req.body;
        if (!fullName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, and phone are required"
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Create new resume
        const resumeData = {
            userId,
            ...req.body
        };

        const newResume = new Resume(resumeData);
        await newResume.save();

        // Populate user data for response
        await newResume.populate('userId', 'name email role');

        res.status(201).json({
            success: true,
            message: "Resume created successfully",
            data: newResume
        });

    } catch (error) {
        console.error("Error creating resume:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create resume",
            error: error.message
        });
    }
};

// ==================== GET USER'S RESUMES ====================
/**
 * Fetches all resumes for the authenticated user
 * 
 * Frontend Integration Example:
 * GET /api/resume
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */
export const getResumesByUserId = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // Find all resumes for the user
        const resumes = await Resume.find({
            userId,
            isActive: true
        })
            .populate('userId', 'name email role')
            .sort({ updatedAt: -1 }); // Most recently updated first

        res.status(200).json({
            success: true,
            message: "Resumes fetched successfully",
            data: resumes,
            count: resumes.length
        });

    } catch (error) {
        console.error("Error fetching resumes:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch resumes",
            error: error.message
        });
    }
};

// ==================== GET SPECIFIC RESUME ====================
/**
 * Fetches a specific resume by ID (must belong to authenticated user)
 * 
 * Frontend Integration Example:
 * GET /api/resume/:resumeId
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */
export const getResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const userId = req.user.userId;

        // Validate resumeId
        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resume ID"
            });
        }

        // Find resume by ID and ensure it belongs to the user
        const resume = await Resume.findOne({
            _id: resumeId,
            userId,
            isActive: true
        }).populate('userId', 'name email role');

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found or access denied"
            });
        }

        res.status(200).json({
            success: true,
            message: "Resume fetched successfully",
            data: resume
        });

    } catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch resume",
            error: error.message
        });
    }
};

// ==================== UPDATE RESUME ====================
/**
 * Updates an existing resume (must belong to authenticated user)
 * 
 * Frontend Integration Example:
 * PUT /api/resume/:resumeId
 * Headers: { Authorization: "Bearer <jwt_token>" }
 * Body: { <updated_resume_data> }
 */
export const updateResume = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const userId = req.user.userId;

        // Validate resumeId
        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resume ID"
            });
        }

        // Validate required fields if provided
        const { fullName, email, phone } = req.body;
        if ((fullName !== undefined && !fullName) ||
            (email !== undefined && !email) ||
            (phone !== undefined && !phone)) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, and phone cannot be empty"
            });
        }

        // Find and update resume
        const updatedResume = await Resume.findOneAndUpdate(
            { _id: resumeId, userId, isActive: true },
            {
                ...req.body,
                version: { $inc: 1 } // Increment version for tracking
            },
            {
                new: true, // Return updated document
                runValidators: true // Run schema validations
            }
        ).populate('userId', 'name email role');

        if (!updatedResume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found or access denied"
            });
        }

        res.status(200).json({
            success: true,
            message: "Resume updated successfully",
            data: updatedResume
        });

    } catch (error) {
        console.error("Error updating resume:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update resume",
            error: error.message
        });
    }
};

// ==================== DELETE RESUME (SOFT DELETE) ====================
/**
 * Soft deletes a resume (sets isActive to false)
 * 
 * Frontend Integration Example:
 * DELETE /api/resume/:resumeId
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */
export const deleteResume = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const userId = req.user.userId;

        // Validate resumeId
        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resume ID"
            });
        }

        // Soft delete resume
        const deletedResume = await Resume.findOneAndUpdate(
            { _id: resumeId, userId, isActive: true },
            { isActive: false },
            { new: true }
        );

        if (!deletedResume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found or access denied"
            });
        }

        res.status(200).json({
            success: true,
            message: "Resume deleted successfully",
            data: { id: resumeId }
        });

    } catch (error) {
        console.error("Error deleting resume:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete resume",
            error: error.message
        });
    }
};

// ==================== GET RESUME ANALYTICS ====================
/**
 * Get analytics for user's resumes (optional advanced feature)
 * 
 * Frontend Integration Example:
 * GET /api/resume/analytics
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */
export const getResumeAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId;

        const analytics = await Resume.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true } },
            {
                $group: {
                    _id: null,
                    totalResumes: { $sum: 1 },
                    averageSkills: { $avg: { $size: "$skills" } },
                    averageEducation: { $avg: { $size: "$education" } },
                    averageExperience: { $avg: { $size: "$workExperience" } },
                    averageProjects: { $avg: { $size: "$projects" } },
                    lastUpdated: { $max: "$updatedAt" }
                }
            }
        ]);

        const result = analytics.length > 0 ? analytics[0] : {
            totalResumes: 0,
            averageSkills: 0,
            averageEducation: 0,
            averageExperience: 0,
            averageProjects: 0,
            lastUpdated: null
        };

        res.status(200).json({
            success: true,
            message: "Resume analytics fetched successfully",
            data: result
        });

    } catch (error) {
        console.error("Error fetching resume analytics:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch resume analytics",
            error: error.message
        });
    }
};
