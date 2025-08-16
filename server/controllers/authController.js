import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import Employee from "../models/Employee.js";
import Institution from "../models/Institution.js";

const generateToken = (id, role) =>
  jwt.sign({ userId: id, role: role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// Helper function to get the correct model based on role
const getModelByRole = (role) => {
  switch (role?.toLowerCase()) {
    case "student":
      return Student;
    case "institution":
      return Institution;
    case "company":
      return Company;
    case "employee":
      return Employee;
    default:
      return User;
  }
};

// ---------------- REGISTER ----------------
export const registerStudent = async (req, res) => {
  try {
    const { fullName, university, major, email, password } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await Student.create({
      name: fullName, // Map to base schema field
      university,
      major,
      email,
      password: hashedPassword,
      role: "Student", // Explicitly set role
    });

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Student Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerInstitution = async (req, res) => {
  try {
    const { institutionName, website, contactPerson, email, password } = req.body;
    await Institution.create({
      name: institutionName,
      website,
      contactPerson,
      email,
      password: hashedPassword,
      role: "Institution",
    });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await Institution.create({
      name: institutionName, // Map to base schema field
      website,
      contactPerson,
      email,
      password: hashedPassword,
      role: "Institution", // Explicitly set role
    });

    res.status(201).json({ message: "Institution registered successfully" });
  } catch (error) {
    console.error("Institution Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerEmployee = async (req, res) => {
  try {
    const { fullName, currentCompany, jobTitle, email, password } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await Employee.create({
      name: fullName, // Map to base schema field
      currentCompany,
      jobTitle,
      email,
      password: hashedPassword,
      role: "Employee", // Explicitly set role
    });

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    console.error("Employee Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerCompany = async (req, res) => {
  try {
    const { companyName, industry, email, password, website } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await Company.create({
      name: companyName, // Only use base schema field - no more companyName duplication
      industry,
      website,
      email,
      password: hashedPassword,
      role: "Company", // Explicitly set role
    });

    res.status(201).json({ message: "Company registered successfully" });
  } catch (error) {
    console.error("Company Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LOGIN ----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    // Find user using base User model (will include discriminated fields)
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role?.toLowerCase());

    res.json({
      token,
      user: {
        id: user._id,
        role: user.role?.toLowerCase(),
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- PROFILE ----------------
export const getProfile = async (req, res) => {
  try {
    // First get the user to determine their role
    const baseUser = await User.findById(req.user.userId).select("role");
    if (!baseUser) return res.status(404).json({ message: "User not found" });

    // Get the appropriate model and fetch with all fields
    const UserModel = getModelByRole(baseUser.role);
    const user = await UserModel.findById(req.user.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // First get the user to determine their role
    const baseUser = await User.findById(userId).select("role");
    if (!baseUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the appropriate model
    const UserModel = getModelByRole(baseUser.role);

    // Define allowed fields based on user role
    let allowedFields = [];

    switch (baseUser.role?.toLowerCase()) {
      case "student":
        allowedFields = [
          // Base User schema fields
          "name",
          "phone",
          "dob",
          "address",
          "gender",
          "education",
          // Student-specific discriminator fields
          "major",
          "university",
        ];
        break;

      case "institution":
        allowedFields = [
          // Base User schema fields
          "name",
          "phone",
          "address",
          // Institution-specific discriminator fields
          "website",
          "contactPerson",
          "establishedYear",
          "description",
          "accreditation",
          "totalStudents",
        ];
        break;

      case "company":
        allowedFields = [
          // Base User schema fields
          "name",
          "phone",
          "address",
          // Company-specific discriminator fields
          "website",
          "industry",
          "description",
          "foundedYear",
          "employeeCount",
        ];
        break;

      case "employee":
        allowedFields = [
          // Base User schema fields
          "name",
          "phone",
          "dob",
          "address",
          "gender",
          "education",
          // Employee-specific discriminator fields
          "currentCompany",
          "jobTitle",
          "experience",
          "skills",
        ];
        break;

      default:
        allowedFields = [
          // Base User schema fields only
          "name",
          "phone",
          "dob",
          "address",
          "gender",
          "education",
        ];
    }

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Handle frontend sending 'companyName' -> map to 'name' for company users
    if (
      baseUser.role?.toLowerCase() === "company" &&
      req.body.companyName !== undefined
    ) {
      updateData.name = req.body.companyName;
    }

    // Handle frontend sending 'institutionName' -> map to 'name' for institution users
    if (
      baseUser.role?.toLowerCase() === "institution" &&
      req.body.institutionName !== undefined
    ) {
      updateData.name = req.body.institutionName;
    }

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    console.log("Update data being sent to database:", updateData); // Debug log

    // Update using the correct model
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated user from database:", updatedUser); // Debug log

    return res.json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
