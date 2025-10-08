import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import Employee from "../models/Employee.js";
import Institution from "../models/Institution.js";
import emailService from "../services/emailService.js";
import tokenService from "../services/tokenService.js";

/**
 * Password Reset Controller
 * 
 * This controller handles all password reset functionality:
 * - Forgot password requests
 * - Password reset with token validation
 * - Token management and cleanup
 * - Password validation
 * 
 * Separated from authController for better code maintainability
 */

// Temporary in-memory storage for password reset tokens
// In production, this should be stored in Redis or MongoDB
const passwordResetTokens = new Map();

// Helper function to hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Clean up expired password reset tokens from memory
 */
const cleanupExpiredTokens = () => {
  const now = new Date();
  let cleanedCount = 0;
  
  for (const [token, data] of passwordResetTokens.entries()) {
    if (new Date(data.expiresAt) < now) {
      passwordResetTokens.delete(token);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} expired password reset tokens`);
  }
};

/**
 * Get stored password reset token data (for password reset validation)
 */
export const getPasswordResetTokenData = (token) => {
  return passwordResetTokens.get(token) || null;
};

/**
 * Delete password reset token (after successful password reset)
 */
export const deletePasswordResetToken = (token) => {
  return passwordResetTokens.delete(token);
};

/**
 * Validate password strength and security criteria
 */
const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push("Password is required");
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (password.length > 128) {
    errors.push("Password must be less than 128 characters long");
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push("Password must contain at least one special character (@$!%*?&)");
  }

  // Check for common weak passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Password is too common. Please choose a more secure password");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Handle forgot password requests
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide a valid email address" 
      });
    }

    console.log(`🔍 Processing password reset request for email: ${email}`);

    // Check if user exists in any of the models
    // We need to search across all user types (Student, Company, Employee, Institution, User)
    let user = null;
    let userModel = null;

    // Search in all user models
    const models = [
      { model: Student, name: 'Student' },
      { model: Company, name: 'Company' },
      { model: Employee, name: 'Employee' },
      { model: Institution, name: 'Institution' },
      { model: User, name: 'User' }
    ];

    for (const { model, name } of models) {
      try {
        user = await model.findOne({ email: email.toLowerCase() });
        if (user) {
          userModel = name;
          console.log(`✅ User found in ${name} model`);
          break;
        }
      } catch (error) {
        console.log(`⚠️  Error searching in ${name} model:`, error.message);
        continue;
      }
    }

    // Always return success message for security (don't reveal if email exists)
    const securityResponse = {
      success: true,
      message: "If an account with that email exists, we have sent a password reset link."
    };

    // If user doesn't exist, still return success but don't send email
    if (!user) {
      console.log(`⚠️  No user found with email: ${email}`);
      return res.status(200).json(securityResponse);
    }

    // Generate password reset token
    console.log(`🔑 Generating password reset token for user: ${user._id}`);
    const resetTokenData = tokenService.generatePasswordResetToken(
      user._id.toString(),
      user.email,
      parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES) || 15
    );

    // Store token in memory (in production, use Redis or MongoDB)
    const tokenKey = resetTokenData.resetToken;
    passwordResetTokens.set(tokenKey, {
      userId: user._id.toString(),
      email: user.email,
      userModel: userModel,
      resetTokenHash: resetTokenData.resetTokenHash,
      verificationToken: resetTokenData.verificationToken,
      expiresAt: resetTokenData.expiresAt,
      createdAt: new Date()
    });

    // Clean up expired tokens periodically
    cleanupExpiredTokens();

    // Construct password reset link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${resetTokenData.resetToken}&verification=${resetTokenData.verificationToken}`;

    console.log(`📧 Sending password reset email to: ${user.email}`);

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        resetLink,
        {
          userName: user.name || 'User',
          expiryMinutes: parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY_MINUTES) || 15
        }
      );

      console.log(`✅ Password reset email sent successfully to: ${user.email}`);
      
      // Log the reset attempt for security monitoring
      console.log(`🔒 Password reset initiated for user ${user._id} (${userModel})`);

    } catch (emailError) {
      console.error(`❌ Failed to send password reset email:`, emailError.message);
      
      // Remove the token if email sending failed
      passwordResetTokens.delete(tokenKey);
      
      // Don't reveal email sending failure to user for security
      return res.status(200).json(securityResponse);
    }

    return res.status(200).json(securityResponse);

  } catch (error) {
    console.error("❌ Forgot password error:", error.message);
    console.error("Stack trace:", error.stack);
    
    res.status(500).json({ 
      success: false,
      message: "An error occurred while processing your request. Please try again later." 
    });
  }
};

/**
 * Handle password reset requests
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, verificationToken, newPassword, confirmPassword } = req.body;

    console.log(`🔄 Processing password reset for token: ${token ? token.substring(0, 8) + '...' : 'missing'}`);

    // Input validation
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required"
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required"
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password confirmation is required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet security requirements",
        errors: passwordValidation.errors
      });
    }

    // Clean up expired tokens before validation
    cleanupExpiredTokens();

    // Get stored token data
    const storedTokenData = getPasswordResetTokenData(token);
    if (!storedTokenData) {
      console.log(`❌ Token not found or expired: ${token.substring(0, 8)}...`);
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
        code: "TOKEN_NOT_FOUND"
      });
    }

    // Validate the token using tokenService
    const tokenValidation = tokenService.validatePasswordResetToken(
      token,
      storedTokenData.resetTokenHash,
      storedTokenData.expiresAt,
      verificationToken || storedTokenData.verificationToken
    );

    if (!tokenValidation.valid) {
      console.log(`❌ Token validation failed: ${tokenValidation.error}`);
      
      // If token is expired, clean it up
      if (tokenValidation.reason === 'EXPIRED') {
        deletePasswordResetToken(token);
      }

      return res.status(400).json({
        success: false,
        message: tokenValidation.error,
        code: tokenValidation.reason
      });
    }

    console.log(`✅ Token validated for user: ${tokenValidation.userId}`);

    // Find the user in the appropriate model
    const { userId, userModel } = storedTokenData;
    let user = null;
    let Model = null;

    // Get the correct model based on stored user model
    switch (userModel) {
      case 'Student':
        Model = Student;
        break;
      case 'Company':
        Model = Company;
        break;
      case 'Employee':
        Model = Employee;
        break;
      case 'Institution':
        Model = Institution;
        break;
      default:
        Model = User;
    }

    // Find the user
    try {
      user = await Model.findById(userId);
      if (!user) {
        console.log(`❌ User not found: ${userId}`);
        deletePasswordResetToken(token);
        return res.status(404).json({
          success: false,
          message: "User not found",
          code: "USER_NOT_FOUND"
        });
      }
    } catch (error) {
      console.error(`❌ Error finding user: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Error retrieving user information"
      });
    }

    // Verify email matches (additional security check)
    if (user.email.toLowerCase() !== storedTokenData.email.toLowerCase()) {
      console.log(`❌ Email mismatch for user ${userId}`);
      deletePasswordResetToken(token);
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
        code: "EMAIL_MISMATCH"
      });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    try {
      await Model.findByIdAndUpdate(
        userId,
        { 
          password: hashedPassword,
          // You might want to add a field to track when password was last changed
          passwordChangedAt: new Date()
        },
        { new: true }
      );

      console.log(`✅ Password updated successfully for user: ${userId} (${userModel})`);

    } catch (error) {
      console.error(`❌ Error updating password: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Error updating password"
      });
    }

    // Invalidate the reset token (delete from storage)
    deletePasswordResetToken(token);
    console.log(`🗑️  Reset token invalidated: ${token.substring(0, 8)}...`);

    // Log security event (without sensitive data)
    console.log(`🔒 Password reset completed for user ${userId} (${userModel}) at ${new Date().toISOString()}`);

    // Send success response
    res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now log in with your new password."
    });

    // Optional: Send password changed confirmation email
    // This could be implemented as a separate function
    try {
      console.log(`📧 Sending password change confirmation to: ${user.email}`);
      
      // Create a simple notification email
      await emailService.sendEmail({
        to: user.email,
        subject: 'Password Changed - Placify',
        text: `Hello ${user.name || 'User'},\n\nYour password has been successfully changed.\n\nIf you did not make this change, please contact support immediately.\n\nBest regards,\nThe Placify Team`,
        html: `
          <h2>Password Changed Successfully</h2>
          <p>Hello ${user.name || 'User'},</p>
          <p>Your password has been successfully changed on ${new Date().toLocaleString()}.</p>
          <p><strong>If you did not make this change, please contact support immediately.</strong></p>
          <p>Best regards,<br>The Placify Team</p>
        `
      });

      console.log(`✅ Password change confirmation email sent to: ${user.email}`);
    } catch (emailError) {
      // Don't fail the password reset if email fails
      console.error(`⚠️  Failed to send confirmation email: ${emailError.message}`);
    }

  } catch (error) {
    console.error("❌ Reset password error:", error.message);
    console.error("Stack trace:", error.stack);

    res.status(500).json({
      success: false,
      message: "An error occurred while resetting your password. Please try again later."
    });
  }
};

/**
 * Get password reset statistics (for admin/monitoring)
 * This could be useful for debugging and monitoring
 */
export const getPasswordResetStats = () => {
  const now = new Date();
  let activeTokens = 0;
  let expiredTokens = 0;

  for (const [token, data] of passwordResetTokens.entries()) {
    if (new Date(data.expiresAt) > now) {
      activeTokens++;
    } else {
      expiredTokens++;
    }
  }

  return {
    totalTokens: passwordResetTokens.size,
    activeTokens,
    expiredTokens,
    lastCleanup: now
  };
};

/**
 * Manually cleanup expired tokens (for admin use)
 */
export const manualCleanupTokens = () => {
  const beforeCount = passwordResetTokens.size;
  cleanupExpiredTokens();
  const afterCount = passwordResetTokens.size;
  
  return {
    tokensRemoved: beforeCount - afterCount,
    remainingTokens: afterCount
  };
};