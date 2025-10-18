import InterviewExperience from "../models/InterviewExperience.js";

// Utility: Validate required fields
const validateRequiredFields = (body, requiredFields) => {
  const missing = requiredFields.filter((field) => !body[field]);
  return missing.length > 0 ? missing : null;
};

// Utility: Standard error response
const handleError = (res, error, message) => {
  console.error(message, error);
  return res.status(500).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

// ------------------- Create Interview Experience -------------------
export const createInterviewExperience = async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      role,
      interviewType,
      difficulty,
      rating,
      experience,
      tips,
    } = req.body;

    const required = [
      "name",
      "email",
      "company",
      "role",
      "interviewType",
      "difficulty",
      "rating",
      "experience",
    ];

    // Validate required fields
    const missingFields = validateRequiredFields(req.body, required);
    if (missingFields) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
        missingFields,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const newExperience = new InterviewExperience({
      name,
      email,
      company,
      role,
      interviewType,
      difficulty,
      rating: parseInt(rating, 10),
      experience,
      tips: tips || "",
      isApproved: true,
    });

    const savedExperience = await newExperience.save();

    return res.status(201).json({
      success: true,
      message:
        "Interview experience submitted successfully! Thank you for sharing.",
      data: savedExperience,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }
    return handleError(res, error, "Error creating interview experience");
  }
};

// ------------------- Get All Interview Experiences -------------------
export const getAllInterviewExperiences = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = { isPublic: true, isApproved: true };
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [experiences, total] = await Promise.all([
      InterviewExperience.find(filter)
        .select("-email")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      InterviewExperience.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / parseInt(limit, 10));

    return res.status(200).json({
      success: true,
      data: experiences,
      pagination: {
        currentPage: parseInt(page, 10),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit, 10),
        hasNextPage: parseInt(page, 10) < totalPages,
        hasPrevPage: parseInt(page, 10) > 1,
      },
    });
  } catch (error) {
    return handleError(res, error, "Error fetching interview experiences");
  }
};

// ------------------- Get Interview Experience by ID -------------------
export const getInterviewExperienceById = async (req, res) => {
  try {
    const { id } = req.params;

    const experience = await InterviewExperience.findById(id)
      .select("-email")
      .lean();

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Interview experience not found",
      });
    }

    if (!experience.isPublic || !experience.isApproved) {
      return res.status(403).json({
        success: false,
        message: "This interview experience is not publicly available",
      });
    }

    return res.status(200).json({ success: true, data: experience });
  } catch (error) {
    return handleError(res, error, "Error fetching interview experience");
  }
};

// ------------------- Get Interview Stats -------------------
export const getInterviewStats = async (req, res) => {
  try {
    const stats = await InterviewExperience.aggregate([
      { $match: { isPublic: true, isApproved: true } },
      {
        $group: {
          _id: null,
          totalExperiences: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          companyCount: { $addToSet: "$company" },
          interviewTypes: {
            $push: {
              type: "$interviewType",
              difficulty: "$difficulty",
              rating: "$rating",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalExperiences: 1,
          averageRating: { $round: ["$averageRating", 2] },
          uniqueCompanies: { $size: "$companyCount" },
          interviewTypes: 1,
        },
      },
    ]);

    const topCompanies = await InterviewExperience.aggregate([
      { $match: { isPublic: true, isApproved: true } },
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $project: {
          company: "$_id",
          experienceCount: "$count",
          averageRating: { $round: ["$averageRating", 2] },
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalExperiences: 0,
          averageRating: 0,
          uniqueCompanies: 0,
          interviewTypes: [],
        },
        topCompanies,
      },
    });
  } catch (error) {
    return handleError(res, error, "Error fetching interview statistics");
  }
};
