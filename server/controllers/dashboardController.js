import User from "../models/User.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import Employee from "../models/Employee.js";
import Institution from "../models/Institution.js";

const roleModelMap = {
  student: Student,
  company: Company,
  employee: Employee,
  institution: Institution,
};

// GET /api/dashboard - returns unified dashboard data for the currently authenticated user
export const getUserDashboardData = async (req, res) => {
  try {
    const { user } = req;

    if (!user?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const baseUser = await User.findById(user.userId).select("role email name");
    if (!baseUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = baseUser.role?.toLowerCase();
    const Model = roleModelMap[role] || User;

    // Fetch full document excluding password
    const fullUser = await Model.findById(user.userId).select("-password");
    if (!fullUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Common structure
    const response = {
      name: fullUser.name || "",
      email: fullUser.email,
      role,
      department: fullUser.department || fullUser.team || "N/A", // Placeholder if not captured at registration
      profileImage: fullUser.profileImage || null,
      additionalData: {},
    };

    // Role-specific data enrichment
    switch (role) {
      case "employee":
        response.additionalData = {
          currentCompany: fullUser.currentCompany || null,
          jobTitle: fullUser.jobTitle || null,
          experience: fullUser.experience || null,
          skills: fullUser.skills || null,
          workLocation: fullUser.workLocation || null,
          phone: fullUser.phone || null,
          address: fullUser.address || null,
        };
        break;

      case "student":
        response.additionalData = {
          university: fullUser.university,
          major: fullUser.major,
          placementStatus: fullUser.placementStatus,
          resultStatus: fullUser.resultStatus,
          attendance: fullUser.attendance,
          passedInterviews: fullUser.passedInterviews,
          failedInterviews: fullUser.failedInterviews,
          year: fullUser.year,
          semester: fullUser.semester,
        };
        break;

      case "company":
        response.additionalData = {
          industry: fullUser.industry,
          website: fullUser.website,
          description: fullUser.description,
          foundedYear: fullUser.foundedYear,
          employeeCount: fullUser.employeeCount,
        };
        break;

      case "institution":
        response.additionalData = {
          website: fullUser.website,
          contactPerson: fullUser.contactPerson,
          establishedYear: fullUser.establishedYear,
          description: fullUser.description,
          accreditation: fullUser.accreditation,
          totalStudents: fullUser.totalStudents,
        };
        break;

      default:
        response.additionalData = {};
    }

    // Provide sample structure if data is mostly empty
    if (
      Object.values(response.additionalData).every(
        (v) => v === undefined || v === null
      )
    ) {
      response.additionalData.sample = true;
    }

    res.json(response);
  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
