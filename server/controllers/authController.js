import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import Employee from "../models/Employee.js";
import Institution from "../models/Institution.js";
import logger from '../utils/logger.js';

const generateToken = (id, role) =>
  jwt.sign({ userId: id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

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

const checkEmailExists = async (email) => {
  if (await User.findOne({ email })) throw new Error("Email already exists");
};

const hashPassword = (password) => bcrypt.hash(password, 10);

// ---------------- REGISTER ----------------
export const registerStudent = async (req, res) => {
  try {
    const { fullName, university, major, email, password, role } = req.body;
    await checkEmailExists(email);
    const hashedPassword = await hashPassword(password);

    await Student.create({
      name: fullName,
      university,
      major,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    logger.error("Student Register Error:", error);
    if (error.message === "Email already exists")
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

export const registerInstitution = async (req, res) => {
  try {
    const { institutionName, website, contactPerson, email, password } =
      req.body;
    await checkEmailExists(email);
    const hashedPassword = await hashPassword(password);

    await Institution.create({
      name: institutionName,
      website,
      contactPerson,
      email,
      password: hashedPassword,
      role: "institution",
    });
    res.status(201).json({ message: "Institution registered successfully" });
  } catch (error) {
    logger.error("Institution Register Error:", error);
    if (error.message === "Email already exists")
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: "Server error" });
  }
};

export const registerEmployee = async (req, res) => {
  try {
    const { fullName, currentCompany, jobTitle, email, password, skills } =
      req.body;
    await checkEmailExists(email);
    const hashedPassword = await hashPassword(password);

    await Employee.create({
      name: fullName,
      currentCompany,
      jobTitle,
      email,
      password: hashedPassword,
      role: "employee",
      ...(skills && { skills }),
    });
    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    logger.error("Employee Register Error:", error);
    if (error.message === "Email already exists")
      return res.status(400).json({ message: error.message });
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    if (error.name === "CastError")
      return res
        .status(400)
        .json({
          message: `Invalid value for field '${error.path}': ${error.value}`,
        });
    res.status(500).json({ message: "Server error" });
  }
};

export const registerCompany = async (req, res) => {
  try {
    const { companyName, industry, email, password, website } = req.body;
    await checkEmailExists(email);
    const hashedPassword = await hashPassword(password);

    await Company.create({
      name: companyName,
      industry,
      website,
      email,
      password: hashedPassword,
      role: "company",
    });
    res.status(201).json({ message: "Company registered successfully" });
  } catch (error) {
    logger.error("Company Register Error:", error);
    if (error.message === "Email already exists")
      return res.status(400).json({ message: error.message });
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

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role?.toLowerCase());
    res.json({
      token,
      user: { id: user._id, role: user.role?.toLowerCase(), email: user.email },
    });
  } catch (error) {
    logger.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- PROFILE ----------------
export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId)
      return res.status(401).json({ message: "Invalid token payload" });
    if (!/^[0-9a-fA-F]{24}$/.test(userId))
      return res.status(400).json({ message: "Malformed user id in token" });

    const baseUser = await User.findById(userId).select("role");
    if (!baseUser)
      return res
        .status(401)
        .json({ message: "Account no longer exists. Please login again." });

    const UserModel = getModelByRole(baseUser.role);
    const user = await UserModel.findById(userId).select("-password");
    if (!user)
      return res.status(404).json({ message: "Profile document not found" });

    return res.json(user);
  } catch (error) {
    logger.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const baseUser = await User.findById(userId).select("role");
    if (!baseUser) return res.status(404).json({ message: "User not found" });

    const UserModel = getModelByRole(baseUser.role);
    let allowedFields = [];

    switch (baseUser.role?.toLowerCase()) {
      case "student":
        allowedFields = [
          "name",
          "phone",
          "dob",
          "address",
          "gender",
          "education",
          "major",
          "university",
        ];
        break;
      case "institution":
        allowedFields = [
          "name",
          "phone",
          "address",
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
          "name",
          "phone",
          "address",
          "website",
          "industry",
          "description",
          "foundedYear",
          "employeeCount",
        ];
        break;
      case "employee":
        allowedFields = [
          "name",
          "phone",
          "dob",
          "address",
          "gender",
          "education",
          "currentCompany",
          "jobTitle",
          "experience",
          "skills",
        ];
        break;
      default:
        allowedFields = [
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
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (baseUser.role?.toLowerCase() === "company" && req.body.companyName)
      updateData.name = req.body.companyName;
    if (
      baseUser.role?.toLowerCase() === "institution" &&
      req.body.institutionName
    )
      updateData.name = req.body.institutionName;
    if (req.file) updateData.profileImage = `/uploads/${req.file.filename}`;

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    return res.json(updatedUser);
  } catch (error) {
    logger.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
