import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from '../utils/logger.js';

dotenv.config();

// Create reusable transporter
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Send Feedback Email
export const sendFeedback = async (req, res) => {
  try {
    const {
      name,
      email,
      rating,
      testimonial,
      improvements,
      additionalFeedback,
    } = req.body;

    // Basic validation
    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    logger.debug("📧 Sending feedback email...");

    // Format email content
    const emailContent = `
🎯 NEW FEEDBACK RECEIVED - PLACIFY PLATFORM
═══════════════════════════════════════════

👤 USER INFORMATION:
   Name: ${name || "Anonymous"}
   Email: ${email || "Not provided"}

⭐ OVERALL RATING: ${rating}/5 stars

📝 TESTIMONIAL:
${testimonial || "No testimonial provided"}

🚀 SUGGESTED IMPROVEMENTS:
${
  improvements?.length
    ? improvements.map((i) => `   • ${i}`).join("\n")
    : "   • No specific improvements mentioned"
}

💬 ADDITIONAL FEEDBACK:
${additionalFeedback || "No additional feedback provided"}

═══════════════════════════════════════════
📧 This feedback was submitted through the Placify feedback form.
🕒 Timestamp: ${new Date().toLocaleString()}
    `;

    // Send email
    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.FEEDBACK_EMAIL,
      subject: `🎯 New Feedback - ${rating}⭐ Rating from ${
        name || "Anonymous User"
      }`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    });

    logger.debug("✅ Feedback email sent successfully!");

    return res.status(200).json({
      success: true,
      message: "Feedback sent successfully! Thank you for your input.",
    });
  } catch (error) {
    logger.error("❌ Error sending feedback email:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send feedback. Please try again later.",
      error: error.message,
    });
  }
};

// Test Email Configuration
export const testEmailConfig = async (_req, res) => {
  try {
    logger.debug("🧪 Testing email configuration...");

    const transporter = createTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.FEEDBACK_EMAIL,
      subject: "✅ Placify Email Test",
      text: "Email configuration working correctly!",
      html: "<p>✅ <strong>Success!</strong> Email working!</p>",
    });

    logger.debug("✅ Test email sent successfully!");

    return res.status(200).json({
      success: true,
      message: "Email test successful!",
    });
  } catch (error) {
    logger.error("❌ Email test failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Email test failed",
      error: error.message,
    });
  }
};
