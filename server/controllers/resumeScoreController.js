import ResumeScore from "../models/ResumeScore.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { spawn } from "child_process";
import Job from "../models/Jobs.js";
import Resume from "../models/Resume.js";

// ==================== UTILITY FUNCTIONS ====================
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildSortObject = (sortBy, sortOrder) => {
  const validSortFields = ["createdAt", "score", "updatedAt"];
  const field = validSortFields.includes(sortBy) ? sortBy : "createdAt";
  const order = sortOrder === "asc" ? 1 : -1;
  return { [field]: order };
};

const handleErrorResponse = (res, error, context) => {
  console.error(`Error in ${context}:`, error);
  res.status(500).json({
    success: false,
    message: `Failed to ${context}`,
    error: error.message,
  });
};

// ==================== SAVE RESUME SCORE ====================
export const saveResumeScore = async (req, res) => {
  try {
    const userId = req.user.userId;
    const startTime = Date.now();

    const { score, scoreBreakdown } = req.body;
    if (score === undefined || score === null || scoreBreakdown === undefined) {
      return res.status(400).json({
        success: false,
        message: "Score and scoreBreakdown are required",
      });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: "Score must be between 0 and 100",
      });
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const processingTime = Date.now() - startTime;

    const newScoreEntry = new ResumeScore({
      userId,
      score,
      scoreBreakdown,
      processingTime,
      resumeId: null,
      ...req.body,
    });

    await newScoreEntry.save();
    await newScoreEntry.populate("userId", "name email role");

    res.status(201).json({
      success: true,
      message: "Score saved successfully",
      data: newScoreEntry,
    });
  } catch (error) {
    handleErrorResponse(res, error, "save resume score");
  }
};

// ==================== GET USER'S SCORE HISTORY ====================
export const getUserScoreHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const sort = buildSortObject(req.query.sortBy, req.query.sortOrder);
    const skip = (page - 1) * limit;

    const [scores, totalCount] = await Promise.all([
      ResumeScore.find({ userId, isActive: true })
        .populate("userId", "name email")
        .sort(sort)
        .limit(limit)
        .skip(skip),
      ResumeScore.countDocuments({ userId, isActive: true }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      message: "Score history fetched successfully",
      data: scores,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    handleErrorResponse(res, error, "fetch score history");
  }
};

// ==================== GET LATEST SCORE ====================
export const getLatestScore = async (req, res) => {
  try {
    const userId = req.user.userId;

    const latestScore = await ResumeScore.findOne({ userId, isActive: true })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    if (!latestScore) {
      return res
        .status(404)
        .json({ success: false, message: "No scores found for this user" });
    }

    res.status(200).json({
      success: true,
      message: "Latest score fetched successfully",
      data: latestScore,
    });
  } catch (error) {
    handleErrorResponse(res, error, "fetch latest score");
  }
};

// ==================== GET USER SCORE ANALYTICS ====================
export const getUserScoreAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userIdObject = new mongoose.Types.ObjectId(userId);

    const [stats, recentProgress, categoryAnalytics, jobInsights] =
      await Promise.all([
        ResumeScore.getUserStats(userId),
        ResumeScore.getScoreProgress(userId, 10),
        ResumeScore.aggregate([
          { $match: { userId: userIdObject, isActive: true } },
          {
            $group: {
              _id: null,
              avgKeywordMatch: { $avg: "$scoreBreakdown.keywordMatch.score" },
              avgSkillsRelevance: {
                $avg: "$scoreBreakdown.skillsRelevance.score",
              },
              avgExperienceRelevance: {
                $avg: "$scoreBreakdown.experienceRelevance.score",
              },
              avgEducationRelevance: {
                $avg: "$scoreBreakdown.educationRelevance.score",
              },
              avgFormatStructure: {
                $avg: "$scoreBreakdown.formatAndStructure.score",
              },
            },
          },
        ]),
        ResumeScore.aggregate([
          { $match: { userId: userIdObject, isActive: true } },
          {
            $group: {
              _id: "$jobDescriptionHash",
              jobTitle: { $first: "$jobTitle" },
              companyName: { $first: "$companyName" },
              averageScore: { $avg: "$score" },
              bestScore: { $max: "$score" },
              attempts: { $sum: 1 },
              lastAttempt: { $max: "$createdAt" },
            },
          },
          { $sort: { lastAttempt: -1 } },
          { $limit: 10 },
        ]),
      ]);

    let improvementTrend = null;
    if (recentProgress.length >= 2) {
      const [recent, previous] = [
        recentProgress[0].score,
        recentProgress[1].score,
      ];
      improvementTrend = {
        current: recent,
        previous,
        difference: recent - previous,
        percentageChange: previous
          ? (((recent - previous) / previous) * 100).toFixed(1)
          : 0,
        isImprovement: recent > previous,
      };
    }

    res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: {
        stats,
        recentProgress,
        improvementTrend,
        categoryAnalytics: categoryAnalytics[0] || {},
        jobInsights,
      },
    });
  } catch (error) {
    handleErrorResponse(res, error, "fetch score analytics");
  }
};

// ==================== DELETE SCORE ENTRY ====================
export const deleteScoreEntry = async (req, res) => {
  try {
    const { scoreId } = req.params;
    const userId = req.user.userId;

    if (!validateObjectId(scoreId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid score ID" });
    }

    const deletedScore = await ResumeScore.findOneAndUpdate(
      { _id: scoreId, userId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!deletedScore) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Score entry not found or access denied",
        });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Score entry deleted successfully",
        data: { id: scoreId },
      });
  } catch (error) {
    handleErrorResponse(res, error, "delete score entry");
  }
};

// ==================== ADMIN: GET ALL SCORES ANALYTICS ====================
export const getAdminScoreAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied. Admin privileges required.",
        });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [platformStats, scoreDistribution, topUsers, trends] =
      await Promise.all([
        ResumeScore.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: null,
              totalScores: { $sum: 1 },
              averageScore: { $avg: "$score" },
              uniqueUsers: { $addToSet: "$userId" },
            },
          },
          {
            $project: {
              totalScores: 1,
              averageScore: { $round: ["$averageScore", 2] },
              uniqueUsers: { $size: "$uniqueUsers" },
            },
          },
        ]),
        ResumeScore.aggregate([
          { $match: { isActive: true } },
          {
            $bucket: {
              groupBy: "$score",
              boundaries: [0, 20, 40, 60, 80, 100],
              default: "100+",
              output: { count: { $sum: 1 } },
            },
          },
        ]),
        ResumeScore.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: "$userId",
              totalScores: { $sum: 1 },
              averageScore: { $avg: "$score" },
              bestScore: { $max: "$score" },
            },
          },
          { $sort: { totalScores: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $project: {
              _id: 1,
              totalScores: 1,
              averageScore: { $round: ["$averageScore", 2] },
              bestScore: 1,
              userName: { $arrayElemAt: ["$user.name", 0] },
              userEmail: { $arrayElemAt: ["$user.email", 0] },
            },
          },
        ]),
        ResumeScore.aggregate([
          { $match: { isActive: true, createdAt: { $gte: thirtyDaysAgo } } },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              dailyScores: { $sum: 1 },
              dailyAverage: { $avg: "$score" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ]),
      ]);

    res.status(200).json({
      success: true,
      message: "Admin analytics fetched successfully",
      data: {
        platformStats: platformStats[0] || {},
        scoreDistribution,
        topUsers,
        trends,
      },
    });
  } catch (error) {
    handleErrorResponse(res, error, "fetch admin analytics");
  }
};

// ==================== AI-DRIVEN RESUME-JOB MATCHING ====================
export const getResumeJobMatch = async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;
    if (!resumeId || !jobId)
      return res
        .status(400)
        .json({ success: false, message: "resumeId and jobId are required" });

    const [resume, job] = await Promise.all([
      Resume.findById(resumeId).lean(),
      Job.findById(jobId).lean(),
    ]);

    if (!resume || !job)
      return res
        .status(404)
        .json({ success: false, message: "Resume or Job not found" });

    const py = spawn("python", ["./ml_modules/call_match.py"]);
    const input = JSON.stringify({ resume, job });
    let output = "";

    py.stdin.write(input);
    py.stdin.end();

    py.stdout.on("data", (data) => (output += data.toString()));
    py.stderr.on("data", (data) => console.error("ML Error:", data.toString()));

    py.on("close", () => {
      try {
        res.status(200).json({ success: true, data: JSON.parse(output) });
      } catch {
        res
          .status(500)
          .json({
            success: false,
            message: "ML analysis failed",
            error: output,
          });
      }
    });
  } catch (error) {
    handleErrorResponse(res, error, "AI-driven resume-job match");
  }
};
