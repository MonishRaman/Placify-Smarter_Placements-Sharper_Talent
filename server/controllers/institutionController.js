import Student from "../models/Student.js";
import Company from "../models/Company.js";

// Utility: Standard error handler
const handleError = (res, error, message) => {
  console.error(message, error);
  return res.status(500).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

export const getInstitutionDashboard = async (req, res) => {
  try {
    const institutionId = req.user.id;

    // Fetch students for this institution
    const students = await Student.find({ institution: institutionId }).lean();
    const totalStudents = students.length;

    const placedStudents = students.filter(
      (s) => s.placementStatus === "placed"
    ).length;

    const placementRate =
      totalStudents > 0
        ? ((placedStudents / totalStudents) * 100).toFixed(2)
        : 0;

    const performanceData = students.map(({ name, performanceScore }) => ({
      name,
      score: performanceScore || 0,
    }));

    // Fetch companies that hired students from this institution
    const companies = await Company.find({
      "hiredStudents.institution": institutionId,
    }).lean();

    const companyData = companies.map(({ name, role, location }) => ({
      name,
      role,
      location,
    }));

    return res.status(200).json({
      success: true,
      totalStudents,
      placedStudents,
      placementRate,
      performanceData,
      companyData,
    });
  } catch (error) {
    return handleError(res, error, "Error fetching institution dashboard");
  }
};
