import apiClient from "../api/apiClient";

/**
 * Send feedback email via backend API
 * @param {Object} feedbackData - The feedback data to send
 * @param {string} feedbackData.name - User's name
 * @param {string} feedbackData.email - User's email
 * @param {number} feedbackData.rating - Rating (1-5)
 * @param {string} feedbackData.testimonial - User testimonial
 * @param {Array} feedbackData.improvements - Array of improvement suggestions
 * @param {string} feedbackData.additionalFeedback - Additional feedback text
 * @returns {Promise<Object>} - Promise with success status and message
 */
export const sendFeedbackEmail = async (feedbackData) => {
  try {
    // Validate required data
    if (!feedbackData.rating) {
      throw new Error("Rating is required");
    }

    // Send feedback to backend
    const response = await apiClient.post(
      `/feedback`,
      feedbackData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || "Feedback sent successfully!",
      };
    } else {
      throw new Error(response.data.message || "Failed to send feedback");
    }
  } catch (error) {
    console.error("❌ Error sending feedback:", error.message);

    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Unable to connect to server. Please make sure the backend server is running on http://localhost:5000");
    } else {
      // Something else happened
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
};

/**
 * Test email configuration via backend API
 * @returns {Promise<Object>} - Promise with test result
 */
export const testEmailService = async () => {
  try {
    const response = await apiClient.get(`/feedback/test`, {
      timeout: 10000,
    });

    return {
      success: true,
      message: response.data.message || "Email service test successful!",
    };
  } catch (error) {
    console.error("Email service test failed:", error);

    if (error.response) {
      throw new Error(
        error.response.data?.message || "Email service test failed"
      );
    } else if (error.request) {
      throw new Error("Unable to connect to server for testing");
    } else {
      throw new Error("Test request failed");
    }
  }
};

/**
 * Validate feedback data before sending
 * @param {Object} feedbackData - The feedback data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
export const validateFeedbackData = (feedbackData) => {
  const errors = [];

  // Required fields validation
  if (
    !feedbackData.rating ||
    feedbackData.rating < 1 ||
    feedbackData.rating > 5
  ) {
    errors.push("Please provide a rating between 1 and 5 stars");
  }

  // Optional field validation
  if (feedbackData.email && !isValidEmail(feedbackData.email)) {
    errors.push("Please provide a valid email address");
  }

  if (feedbackData.name && feedbackData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Simple email validation
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Export improvement options for the feedback form
export const IMPROVEMENT_OPTIONS = [
  "User Interface & Design",
  "Interview Experience",
  "Performance Analytics",
  "Question Quality",
  "Technical Features",
  "Mobile Experience",
  "Loading Speed",
  "Documentation & Help",
  "Accessibility",
  "Security & Privacy",
];
