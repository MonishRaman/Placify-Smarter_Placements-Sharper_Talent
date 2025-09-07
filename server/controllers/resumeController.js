import Resume from "../models/Resume.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// ==================== UTILITY FUNCTIONS ====================
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleErrorResponse = (res, error, context) => {
  console.error(`Error in ${context}:`, error);
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

    // Validate required fields
    const { fullName, email, phone } = req.body;
    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and phone are required",
      });
    }

    // Check if user exists
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create new resume
    const resumeData = {
      userId,
      ...req.body,
    };

    const newResume = new Resume(resumeData);
    await newResume.save();

    // Populate user data for response
    await newResume.populate("userId", "name email role");

    res.status(201).json({
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

    // Validate userId
    if (!validateObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find all resumes for the user
    const resumes = await Resume.find({
      userId,
      isActive: true,
    })
      .populate("userId", "name email role")
      .sort({ updatedAt: -1 }); // Most recently updated first

    res.status(200).json({
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

    // Validate resumeId
    if (!validateObjectId(resumeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID",
      });
    }

    // Find resume by ID and ensure it belongs to the user
    const resume = await Resume.findOne({
      _id: resumeId,
      userId,
      isActive: true,
    }).populate("userId", "name email role");

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or access denied",
      });
    }

    res.status(200).json({
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

    // Validate resumeId
    if (!validateObjectId(resumeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID",
      });
    }

    // Validate required fields if provided
    const { fullName, email, phone } = req.body;
    if (
      (fullName !== undefined && !fullName) ||
      (email !== undefined && !email) ||
      (phone !== undefined && !phone)
    ) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and phone cannot be empty",
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    // Find and update resume
    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId, isActive: true },
      updateData,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validations
      }
    ).populate("userId", "name email role");

    if (!updatedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or access denied",
      });
    }

    res.status(200).json({
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

    // Validate resumeId
    if (!validateObjectId(resumeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resume ID",
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
        message: "Resume not found or access denied",
      });
    }

    res.status(200).json({
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
    const userId = req.user.userId;
    const userIdObject = new mongoose.Types.ObjectId(userId);

    const analytics = await Resume.aggregate([
      { $match: { userId: userIdObject, isActive: true } },
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

    const result =
      analytics.length > 0
        ? analytics[0]
        : {
            totalResumes: 0,
            averageSkills: 0,
            averageEducation: 0,
            averageExperience: 0,
            averageProjects: 0,
            lastUpdated: null,
          };

    res.status(200).json({
      success: true,
      message: "Resume analytics fetched successfully",
      data: result,
    });
  } catch (error) {
    handleErrorResponse(res, error, "fetch resume analytics");
  }
};
