import Resume from "../models/Resume.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// ==================== UTILITY FUNCTIONS ====================
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleErrorResponse = (res, error, context) => {
  console.error(`❌ Error in ${context}:`, error.message);
  res.status(500).json({
    success: false,
    message: `Failed to ${context}`,
    error: error.message,
  });
};

// ==================== CREATE RESUME ====================
export const createResume = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Full name, email, and phone are required",
        });
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const newResume = new Resume({ userId, ...req.body });
    await newResume.save();
    await newResume.populate("userId", "name email role");

    res
      .status(201)
      .json({
        success: true,
        message: "Resume created successfully",
        data: newResume,
      });
  } catch (error) {
    handleErrorResponse(res, error, "create resume");
  }
};

// ==================== GET USER'S RESUMES ====================
export const getResumesByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!validateObjectId(userId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });

    const resumes = await Resume.find({ userId, isActive: true })
      .populate("userId", "name email role")
      .sort({ updatedAt: -1 });

    res
      .status(200)
      .json({
        success: true,
        message: "Resumes fetched successfully",
        data: resumes,
        count: resumes.length,
      });
  } catch (error) {
    handleErrorResponse(res, error, "fetch resumes");
  }
};

// ==================== GET SPECIFIC RESUME ====================
export const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.userId;

    if (!validateObjectId(resumeId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid resume ID" });

    const resume = await Resume.findOne({
      _id: resumeId,
      userId,
      isActive: true,
    }).populate("userId", "name email role");

    if (!resume)
      return res
        .status(404)
        .json({ success: false, message: "Resume not found or access denied" });

    res
      .status(200)
      .json({
        success: true,
        message: "Resume fetched successfully",
        data: resume,
      });
  } catch (error) {
    handleErrorResponse(res, error, "fetch resume");
  }
};

// ==================== UPDATE RESUME ====================
export const updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.userId;
    const { fullName, email, phone } = req.body;

    if (!validateObjectId(resumeId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid resume ID" });
    if (
      (fullName !== undefined && !fullName) ||
      (email !== undefined && !email) ||
      (phone !== undefined && !phone)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Full name, email, and phone cannot be empty",
        });
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId, isActive: true },
      { ...req.body },
      { new: true, runValidators: true }
    ).populate("userId", "name email role");

    if (!updatedResume)
      return res
        .status(404)
        .json({ success: false, message: "Resume not found or access denied" });

    res
      .status(200)
      .json({
        success: true,
        message: "Resume updated successfully",
        data: updatedResume,
      });
  } catch (error) {
    handleErrorResponse(res, error, "update resume");
  }
};

// ==================== DELETE RESUME (SOFT DELETE) ====================
export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.user.userId;

    if (!validateObjectId(resumeId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid resume ID" });

    const deletedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId, isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!deletedResume)
      return res
        .status(404)
        .json({ success: false, message: "Resume not found or access denied" });

    res
      .status(200)
      .json({
        success: true,
        message: "Resume deleted successfully",
        data: { id: resumeId },
      });
  } catch (error) {
    handleErrorResponse(res, error, "delete resume");
  }
};

// ==================== GET RESUME ANALYTICS ====================
export const getResumeAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const analytics = await Resume.aggregate([
      { $match: { userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalResumes: { $sum: 1 },
          averageSkills: { $avg: { $size: "$skills" } },
          averageEducation: { $avg: { $size: "$education" } },
          averageExperience: { $avg: { $size: "$workExperience" } },
          averageProjects: { $avg: { $size: "$projects" } },
          lastUpdated: { $max: "$updatedAt" },
        },
      },
    ]);

    const result = analytics[0] || {
      totalResumes: 0,
      averageSkills: 0,
      averageEducation: 0,
      averageExperience: 0,
      averageProjects: 0,
      lastUpdated: null,
    };

    res
      .status(200)
      .json({
        success: true,
        message: "Resume analytics fetched successfully",
        data: result,
      });
  } catch (error) {
    handleErrorResponse(res, error, "fetch resume analytics");
  }
};
