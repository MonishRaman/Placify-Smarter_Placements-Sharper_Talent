import Company from "../models/Company.js";
import Employee from "../models/Employee.js";

// Assumes req.user is set by auth middleware and contains _id and role
export const getCompanyDashboard = async (req, res) => {
  try {
    const user = req.user;

    if (!user || user.role !== "Company") {
      return res
        .status(403)
        .json({ error: "Access denied. Company role required." });
    }

    const company = await Company.findById(user._id).select(
      "name logo email foundedYear location"
    );
    if (!company) {
      return res.status(404).json({ error: "Company not found." });
    }

    const totalEmployees = await Employee.countDocuments({ company: user._id });

    res.json({
      name: company.name,
      logo: company.logo,
      email: company.email,
      foundedYear: company.foundedYear,
      location: company.location,
      totalEmployees,
      departmentsCount: 0, // Placeholder for future department count
      performance: {}, // Placeholder for performance data
    });
  } catch (error) {
    console.error("Company Dashboard Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
