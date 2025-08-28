import ResumeScore from "../models/ResumeScore.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// ==================== SAVE RESUME SCORE ====================
/**
 * Saves ATS score to user's history
 * 
 * Frontend Integration Example:
 * POST /api/resume/score
 * Headers: { Authorization: "Bearer <jwt_token>" }
 * Body: {
 *   score: 85,
 *   scoreBreakdown: { keywordMatch: { score: 90, details: {} } },
 *   jobTitle: "Software Developer",
 *   companyName: "Tech Corp",
 *   resumeFileName: "john_doe_resume.pdf",
 *   aiAnalysis: { feedback: "...", suggestions: [] }
 * }
 */
export const saveResumeScore = async (req, res) => {
    try {
        const userId = req.user.userId;
        const startTime = Date.now();

        // Validate required fields
        const { score, scoreBreakdown } = req.body;
        if (score === undefined || score === null || scoreBreakdown === undefined) {
            return res.status(400).json({
                success: false,
                message: "Score and scoreBreakdown are required"
            });
        }

        // Validate score range
        if (score < 0 || score > 100) {
            return res.status(400).json({
                success: false,
                message: "Score must be between 0 and 100"
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

        // Calculate processing time
        const processingTime = Date.now() - startTime;

        // Create new score entry
        const scoreData = {
            userId,
            score,
            scoreBreakdown,
            processingTime,
            resumeId: null, // ATS uploads don't have associated Resume documents
            ...req.body // Include other optional fields like jobTitle, companyName, etc.
        };

        const newScoreEntry = new ResumeScore(scoreData);
        await newScoreEntry.save();

        // Populate user data for response
        await newScoreEntry.populate('userId', 'name email role');

        res.status(201).json({
            success: true,
            message: "Score saved successfully",
            data: newScoreEntry
        });

    } catch (error) {
        console.error("Error saving resume score:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save resume score",
            error: error.message
        });
    }
};

// ==================== GET USER'S SCORE HISTORY ====================
/**
 * Fetches score history for the authenticated user
 * 
 * Frontend Integration Example:
 * GET /api/resume/score?limit=20&page=1&sortBy=createdAt&sortOrder=desc
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */
export const getUserScoreHistory = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Parse query parameters
        const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100 per request
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const skip = (page - 1) * limit;

        // Build sort object
        const sort = { [sortBy]: sortOrder };

        // Fetch scores with pagination
        const scores = await ResumeScore.find({
            userId,
            isActive: true
        })
            .populate('userId', 'name email')
            .sort(sort)
            .limit(limit)
            .skip(skip);

        // Get total count for pagination
        const totalCount = await ResumeScore.countDocuments({
            userId,
            isActive: true
        });

        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            message: "Score history fetched successfully",
            data: scores,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage,
                hasPrevPage
            }
        });

    } catch (error) {
        console.error("Error fetching score history:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch score history",
            error: error.message
        });
    }
};

// ==================== GET LATEST SCORE ====================
/**
 * Fetches the latest score for the authenticated user
 * 
 * Frontend Integration Example:
 * GET /api/resume/score/latest
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */
export const getLatestScore = async (req, res) => {
    try {
        const userId = req.user.userId;

        const latestScore = await ResumeScore.findOne({
            userId,
            isActive: true
        })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        if (!latestScore) {
            return res.status(404).json({
                success: false,
                message: "No scores found for this user"
            });
        }

        res.status(200).json({
            success: true,
            message: "Latest score fetched successfully",
            data: latestScore
        });

    } catch (error) {
        console.error("Error fetching latest score:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch latest score",
            error: error.message
        });
    }
};

// ==================== GET USER SCORE ANALYTICS ====================
/**
 * Fetches comprehensive analytics for user's scores
 * 
 * Frontend Integration Example:
 * GET /api/resume/score/analytics
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */
export const getUserScoreAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get user stats
        const stats = await ResumeScore.getUserStats(userId);

        // Get recent progress (last 10 scores)
        const recentProgress = await ResumeScore.getScoreProgress(userId, 10);

        // Calculate improvement trends
        let improvementTrend = null;
        if (recentProgress.length >= 2) {
            const recent = recentProgress[0].score;
            const previous = recentProgress[1].score;
            improvementTrend = {
                current: recent,
                previous: previous,
                difference: recent - previous,
                percentageChange: previous !== 0 ? ((recent - previous) / previous * 100).toFixed(1) : 0,
                isImprovement: recent > previous
            };
        }

        // Get score distribution by categories
        const categoryAnalytics = await ResumeScore.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true } },
            {
                $group: {
                    _id: null,
                    avgKeywordMatch: { $avg: "$scoreBreakdown.keywordMatch.score" },
                    avgSkillsRelevance: { $avg: "$scoreBreakdown.skillsRelevance.score" },
                    avgExperienceRelevance: { $avg: "$scoreBreakdown.experienceRelevance.score" },
                    avgEducationRelevance: { $avg: "$scoreBreakdown.educationRelevance.score" },
                    avgFormatStructure: { $avg: "$scoreBreakdown.formatAndStructure.score" }
                }
            }
        ]);

        // Get job application insights
        const jobInsights = await ResumeScore.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true } },
            {
                $group: {
                    _id: "$jobDescriptionHash",
                    jobTitle: { $first: "$jobTitle" },
                    companyName: { $first: "$companyName" },
                    averageScore: { $avg: "$score" },
                    bestScore: { $max: "$score" },
                    attempts: { $sum: 1 },
                    lastAttempt: { $max: "$createdAt" }
                }
            },
            { $sort: { lastAttempt: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            message: "Analytics fetched successfully",
            data: {
                stats,
                recentProgress,
                improvementTrend,
                categoryAnalytics: categoryAnalytics[0] || {},
                jobInsights
            }
        });

    } catch (error) {
        console.error("Error fetching score analytics:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch score analytics",
            error: error.message
        });
    }
};

// ==================== DELETE SCORE ENTRY ====================
/**
 * Soft deletes a score entry (sets isActive to false)
 * 
 * Frontend Integration Example:
 * DELETE /api/resume/score/:scoreId
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */
export const deleteScoreEntry = async (req, res) => {
    try {
        const { scoreId } = req.params;
        const userId = req.user.userId;

        // Validate scoreId
        if (!mongoose.Types.ObjectId.isValid(scoreId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid score ID"
            });
        }

        // Soft delete score entry
        const deletedScore = await ResumeScore.findOneAndUpdate(
            { _id: scoreId, userId, isActive: true },
            { isActive: false },
            { new: true }
        );

        if (!deletedScore) {
            return res.status(404).json({
                success: false,
                message: "Score entry not found or access denied"
            });
        }

        res.status(200).json({
            success: true,
            message: "Score entry deleted successfully",
            data: { id: scoreId }
        });

    } catch (error) {
        console.error("Error deleting score entry:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete score entry",
            error: error.message
        });
    }
};

// ==================== ADMIN: GET ALL SCORES ANALYTICS ====================
/**
 * Admin-only endpoint to get platform-wide score analytics
 * 
 * Frontend Integration Example:
 * GET /api/resume/score/admin/analytics
 * Headers: { Authorization: "Bearer <admin_jwt_token>" }
 */
export const getAdminScoreAnalytics = async (req, res) => {
    try {
        // Check if user is admin (this should be handled by middleware)
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        // Platform-wide statistics
        const platformStats = await ResumeScore.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalScores: { $sum: 1 },
                    averageScore: { $avg: "$score" },
                    uniqueUsers: { $addToSet: "$userId" }
                }
            },
            {
                $project: {
                    totalScores: 1,
                    averageScore: { $round: ["$averageScore", 2] },
                    uniqueUsers: { $size: "$uniqueUsers" }
                }
            }
        ]);

        // Score distribution
        const scoreDistribution = await ResumeScore.aggregate([
            { $match: { isActive: true } },
            {
                $bucket: {
                    groupBy: "$score",
                    boundaries: [0, 20, 40, 60, 80, 100],
                    default: "100+",
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);

        // Most active users
        const topUsers = await ResumeScore.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: "$userId",
                    totalScores: { $sum: 1 },
                    averageScore: { $avg: "$score" },
                    bestScore: { $max: "$score" }
                }
            },
            { $sort: { totalScores: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $project: {
                    _id: 1,
                    totalScores: 1,
                    averageScore: { $round: ["$averageScore", 2] },
                    bestScore: 1,
                    userName: { $arrayElemAt: ["$user.name", 0] },
                    userEmail: { $arrayElemAt: ["$user.email", 0] }
                }
            }
        ]);

        // Trends over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const trends = await ResumeScore.aggregate([
            {
                $match: {
                    isActive: true,
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    dailyScores: { $sum: 1 },
                    dailyAverage: { $avg: "$score" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        res.status(200).json({
            success: true,
            message: "Admin analytics fetched successfully",
            data: {
                platformStats: platformStats[0] || {},
                scoreDistribution,
                topUsers,
                trends
            }
        });

    } catch (error) {
        console.error("Error fetching admin analytics:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin analytics",
            error: error.message
        });
    }
};
