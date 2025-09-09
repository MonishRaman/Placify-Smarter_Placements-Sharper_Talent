import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create reusable transporter object
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Format feedback content
const formatFeedbackContent = (feedbackData) => {
  const { name, email, rating, testimonial, improvements, additionalFeedback } =
    feedbackData;

  return `
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
  improvements && improvements.length > 0
    ? improvements.map((improvement) => `   • ${improvement}`).join("\n")
    : "   • No specific improvements mentioned"
}

💬 ADDITIONAL FEEDBACK:
${additionalFeedback || "No additional feedback provided"}

═══════════════════════════════════════════
📧 This feedback was submitted through the Placify feedback form.
🕒 Timestamp: ${new Date().toLocaleString()}
    `;
};

// Send email helper function
const sendEmail = async (mailOptions) => {
  const transporter = createTransporter();
  return await transporter.sendMail(mailOptions);
};

// Validate feedback data
const validateFeedback = (feedbackData) => {
  const { rating } = feedbackData;

  if (!rating) {
    throw new Error("Rating is required");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
};

// Send feedback email
export const sendFeedback = async (req, res) => {
  try {
    const feedbackData = req.body;

    validateFeedback(feedbackData);

    console.log("📧 Sending feedback email...");

    const emailContent = formatFeedbackContent(feedbackData);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.FEEDBACK_EMAIL,
      subject: `🎯 New Feedback - ${feedbackData.rating}⭐ Rating from ${
        feedbackData.name || "Anonymous User"
      }`,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
    };

    await sendEmail(mailOptions);

    console.log("✅ Feedback email sent successfully!");

    res.status(200).json({
      success: true,
      message: "Feedback sent successfully! Thank you for your input.",
    });
  } catch (error) {
    console.error("❌ Error sending feedback email:", error.message);

    const statusCode =
      error.message.includes("required") || error.message.includes("must be")
        ? 400
        : 500;

    res.status(statusCode).json({
      success: false,
      message:
        error.message.includes("required") || error.message.includes("must be")
          ? error.message
          : "Failed to send feedback. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Test email configuration
export const testEmailConfig = async (req, res) => {
  try {
    console.log("🧪 Testing email configuration...");

    const testMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.FEEDBACK_EMAIL,
      subject: "✅ Placify Email Test",
      text: "Email configuration working correctly!",
      html: "<p>✅ <strong>Success!</strong> Email working!</p>",
    };

    await sendEmail(testMailOptions);

    console.log("✅ Test email sent successfully!");

    res.status(200).json({
      success: true,
      message: "Email test successful!",
    });
  } catch (error) {
    console.error("❌ Email test failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Email test failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
