import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import Employee from "../models/Employee.js";
import Institution from "../models/Institution.js";
import emailService from "../services/emailService.js";
import tokenService from "../services/tokenService.js";
import logger from '../utils/logger.js';

// In-memory storage for password reset tokens (use Redis/MongoDB in production)
const passwordResetTokens = new Map();

// Hash password
const hashPassword = (password) => bcrypt.hash(password, 10);

// Validate password strength
const validatePassword = (password) => {
  const errors = [];
  if (!password) return { isValid: false, errors: ["Password is required"] };

  if (password.length < 8)
    errors.push("Password must be at least 8 characters long");
  if (password.length > 128)
    errors.push("Password must be less than 128 characters long");
  if (!/[a-z]/.test(password))
    errors.push("Password must contain at least one lowercase letter");
  if (!/[A-Z]/.test(password))
    errors.push("Password must contain at least one uppercase letter");
  if (!/\d/.test(password))
    errors.push("Password must contain at least one number");
  if (!/[@$!%*?&]/.test(password))
    errors.push(
      "Password must contain at least one special character (@$!%*?&)"
    );

  const commonPasswords = [
    "password",
    "123456",
    "123456789",
    "qwerty",
    "abc123",
    "password123",
    "admin",
    "letmein",
    "welcome",
    "monkey",
  ];
  if (commonPasswords.includes(password.toLowerCase()))
    errors.push("Password is too common. Please choose a more secure password");

  return { isValid: errors.length === 0, errors };
};

// Cleanup expired tokens
const cleanupExpiredTokens = () => {
  const now = Date.now();
  let cleanedCount = 0;
  for (const [token, data] of passwordResetTokens.entries()) {
    if (new Date(data.expiresAt) < now) {
      passwordResetTokens.delete(token);
      cleanedCount++;
    }
  }
  if (cleanedCount)
    logger.debug(`🧹 Cleaned up ${cleanedCount} expired password reset tokens`);
};

// Token helpers
export const getPasswordResetTokenData = (token) =>
  passwordResetTokens.get(token) || null;
export const deletePasswordResetToken = (token) =>
  passwordResetTokens.delete(token);

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide a valid email address",
        });

    logger.debug(`🔍 Processing password reset request for email: ${email}`);
    let user = null,
      userModel = null;
    const models = [
      { model: Student, name: "Student" },
      { model: Company, name: "Company" },
      { model: Employee, name: "Employee" },
      { model: Institution, name: "Institution" },
      { model: User, name: "User" },
    ];

    for (const { model, name } of models) {
      try {
        user = await model.findOne({ email: email.toLowerCase() });
        if (user) {
          userModel = name;
          logger.debug(`✅ User found in ${name} model`);
          break;
        }
      } catch {
        continue;
      }
    }

    const securityResponse = {
      success: true,
      message:
        "If an account with that email exists, we have sent a password reset link.",
    };
    if (!user) {
      logger.debug(`⚠️  No user found with email: ${email}`);
      return res.status(200).json(securityResponse);
    }

    // Generate token
    const resetTokenData = tokenService.generatePasswordResetToken(
      user._id.toString(),
      user.email,
      parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES) || 15
    );
    passwordResetTokens.set(resetTokenData.resetToken, {
      userId: user._id.toString(),
      email: user.email,
      userModel,
      resetTokenHash: resetTokenData.resetTokenHash,
      verificationToken: resetTokenData.verificationToken,
      expiresAt: resetTokenData.expiresAt,
      createdAt: new Date(),
    });

    cleanupExpiredTokens();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendUrl}/reset-password?token=${resetTokenData.resetToken}&verification=${resetTokenData.verificationToken}`;

    try {
      await emailService.sendPasswordResetEmail(user.email, resetLink, {
        userName: user.name || "User",
        expiryMinutes:
          parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES) || 15,
      });
      logger.debug(
        `✅ Password reset email sent successfully to: ${user.email}`
      );
    } catch (emailError) {
      logger.error(
        `❌ Failed to send password reset email: ${emailError.message}`
      );
      passwordResetTokens.delete(resetTokenData.resetToken);
    }

    return res.status(200).json(securityResponse);
  } catch (error) {
    logger.error("❌ Forgot password error:", error);
    res
      .status(500)
      .json({
        success: false,
        message:
          "An error occurred while processing your request. Please try again later.",
      });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, verificationToken, newPassword, confirmPassword } = req.body;

    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Reset token is required" });
    if (!newPassword)
      return res
        .status(400)
        .json({ success: false, message: "New password is required" });
    if (!confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "Password confirmation is required" });
    if (newPassword !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid)
      return res
        .status(400)
        .json({
          success: false,
          message: "Password does not meet security requirements",
          errors: passwordValidation.errors,
        });

    cleanupExpiredTokens();

    const storedTokenData = getPasswordResetTokenData(token);
    if (!storedTokenData)
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired reset token",
          code: "TOKEN_NOT_FOUND",
        });

    const tokenValidation = tokenService.validatePasswordResetToken(
      token,
      storedTokenData.resetTokenHash,
      storedTokenData.expiresAt,
      verificationToken || storedTokenData.verificationToken
    );
    if (!tokenValidation.valid) {
      if (tokenValidation.reason === "EXPIRED") deletePasswordResetToken(token);
      return res
        .status(400)
        .json({
          success: false,
          message: tokenValidation.error,
          code: tokenValidation.reason,
        });
    }

    const { userId, userModel } = storedTokenData;
    const Model =
      { Student, Company, Employee, Institution, User }[userModel] || User;
    const user = await Model.findById(userId);
    if (!user) {
      deletePasswordResetToken(token);
      return res
        .status(404)
        .json({
          success: false,
          message: "User not found",
          code: "USER_NOT_FOUND",
        });
    }
    if (user.email.toLowerCase() !== storedTokenData.email.toLowerCase()) {
      deletePasswordResetToken(token);
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid reset token",
          code: "EMAIL_MISMATCH",
        });
    }

    const hashedPassword = await hashPassword(newPassword);
    await Model.findByIdAndUpdate(
      userId,
      { password: hashedPassword, passwordChangedAt: new Date() },
      { new: true }
    );
    deletePasswordResetToken(token);

    try {
      await emailService.sendEmail({
        to: user.email,
        subject: "Password Changed - Placify",
        text: `Hello ${
          user.name || "User"
        },\n\nYour password has been successfully changed.\n\nIf you did not make this change, please contact support immediately.`,
        html: `<h2>Password Changed Successfully</h2><p>Hello ${
          user.name || "User"
        },</p><p>Your password has been successfully changed on ${new Date().toLocaleString()}.</p><p><strong>If you did not make this change, please contact support immediately.</strong></p>`,
      });
    } catch {}

    return res
      .status(200)
      .json({
        success: true,
        message:
          "Password has been reset successfully. You can now log in with your new password.",
      });
  } catch (error) {
    logger.error("❌ Reset password error:", error);
    res
      .status(500)
      .json({
        success: false,
        message:
          "An error occurred while resetting your password. Please try again later.",
      });
  }
};

// Admin utilities
export const getPasswordResetStats = () => {
  const now = new Date();
  let activeTokens = 0,
    expiredTokens = 0;
  for (const data of passwordResetTokens.values())
    new Date(data.expiresAt) > now ? activeTokens++ : expiredTokens++;
  return {
    totalTokens: passwordResetTokens.size,
    activeTokens,
    expiredTokens,
    lastCleanup: now,
  };
};

export const manualCleanupTokens = () => {
  const beforeCount = passwordResetTokens.size;
  cleanupExpiredTokens();
  const afterCount = passwordResetTokens.size;
  return {
    tokensRemoved: beforeCount - afterCount,
    remainingTokens: afterCount,
  };
};
