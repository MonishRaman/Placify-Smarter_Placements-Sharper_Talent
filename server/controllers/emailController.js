import nodemailer from "nodemailer";
import dotenv from "dotenv";
import validator from "validator";
import logger from '../utils/logger.js';

dotenv.config();

// Create reusable transporter object
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Format feedback content
const formatFeedbackContent = ({
  name,
  email,
  rating,
  testimonial,
  improvements,
  additionalFeedback,
}) => `
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
📧 Submitted through the Placify feedback form.
🕒 Timestamp: ${new Date().toLocaleString()}
`;

// Send email helper
const sendEmail = async (mailOptions) => {
  const transporter = createTransporter();
  return transporter.sendMail(mailOptions);
};

// Validate feedback data
const validateFeedback = ({ email, rating }) => {
  if (!rating) throw new Error("Rating is required");
  if (rating < 1 || rating > 5)
    throw new Error("Rating must be between 1 and 5");
  if (email && !validator.isEmail(email))
    throw new Error("Invalid email format");
};

// Send feedback email
export const sendFeedback = async (req, res) => {
  try {
    const feedbackData = req.body;
    validateFeedback(feedbackData);

    logger.debug("📧 Sending feedback email...");

    const emailContent = formatFeedbackContent(feedbackData);
    const subject = `🎯 New Feedback - ${feedbackData.rating}⭐ Rating from ${
      feedbackData.name || "Anonymous User"
    }`;

    await sendEmail({
      from: process.env.EMAIL_USER,
      to: process.env.FEEDBACK_EMAIL,
      subject,
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

    const isValidationError = ["required", "must be", "Invalid email"].some(
      (msg) => error.message.includes(msg)
    );

    return res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: isValidationError
        ? error.message
        : "Failed to send feedback. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Test email configuration
export const testEmailConfig = async (_req, res) => {
  try {
    logger.debug("🧪 Testing email configuration...");

    await sendEmail({
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
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
