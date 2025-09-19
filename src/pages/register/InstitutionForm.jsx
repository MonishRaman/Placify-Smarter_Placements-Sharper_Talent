import { School, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormInput from "../../components/FormInput";
import RegistrationHeader from "../../components/RegistrationHeader";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import apiClient from "../../api/apiClient";
import { CheckCircle, XCircle } from "lucide-react";

// =================== PERFORMANCE MONITORING ===================
const componentStartTime = performance.now();
console.group("⚡ InstitutionForm Component Performance Monitoring");
console.log("🚀 Component file loaded at:", new Date().toISOString());
console.log("📊 Performance start time:", componentStartTime);
console.groupEnd();

export default function InstitutionForm() {
  const navigate = useNavigate();

  // =================== COMPONENT INITIALIZATION DEBUGGING ===================
  console.group("🏛️ InstitutionForm Component Initialization");
  console.log("📅 Component mounted at:", new Date().toISOString());
  console.log("🧭 Navigation object:", navigate);

  const [formData, setFormData] = useState({
    institutionName: "",
    website: "",
    contactPerson: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "institution",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Track password validation
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const validatePassword = (password) => {
    const rules = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordRules(rules);
    return rules;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    validatePassword(newPassword);
  };

  // Check if all password rules are satisfied
  const allPasswordRulesSatisfied = Object.values(passwordRules).every(
    (rule) => rule
  );

  const handleFormDataChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // =================== DEBUGGING GROUP: FORM SUBMISSION ===================
    console.group("🏛️ Institution Registration Form Submission");
    console.log("📋 Form submission started at:", new Date().toISOString());
    console.log("📝 Current form data:", formData);
    console.table(formData); // Table format for better readability

    // =================== CLIENT-SIDE VALIDATION ===================
    console.group("✅ Client-side Validation");

    // Check required fields
    const requiredFields = {
      institutionName: formData.institutionName,
      website: formData.website,
      contactPerson: formData.contactPerson,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    console.log("🔍 Checking required fields:", requiredFields);

    if (
      !formData.institutionName ||
      !formData.website ||
      !formData.contactPerson ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      console.error("❌ Validation failed: Missing required fields");
      console.table(
        Object.entries(requiredFields).map(([key, value]) => ({
          field: key,
          value: value || "MISSING",
          status: value ? "✅ Valid" : "❌ Missing",
        }))
      );
      setError("All fields are required");
      setLoading(false);
      console.groupEnd();
      console.groupEnd();
      return;
    }

    try {
      const urlObj = new URL(formData.website);
      console.log("✅ Website URL is valid:", {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
      });
    } catch (urlError) {
      console.error("❌ Website URL validation failed:", urlError.message);
      setError("Please enter a valid website URL");
      setLoading(false);
      console.groupEnd();
      console.groupEnd();
      return;
    }

    // Check if all password rules are satisfied
    if (!allPasswordRulesSatisfied) {
      setError("Password must meet all security requirements");

      setLoading(false);
      console.groupEnd();
      console.groupEnd();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.error("❌ Password confirmation mismatch");
      console.log("Password:", formData.password?.length, "characters");
      console.log(
        "Confirm Password:",
        formData.confirmPassword?.length,
        "characters"
      );
      setError("Passwords do not match");
      setLoading(false);
      console.groupEnd();
      console.groupEnd();
      return;
    }

    console.log("✅ All client-side validations passed");
    console.groupEnd(); // End validation group

    // =================== API REQUEST PREPARATION ===================
    console.group("🚀 API Request Preparation");

    // Prepare payload (excluding confirmPassword as backend doesn't need it)
    const requestPayload = {
      institutionName: formData.institutionName,
      website: formData.website,
      contactPerson: formData.contactPerson,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    console.log("📦 Request payload prepared:", requestPayload);
    console.log("🎯 API endpoint: /auth/register/institution");
    console.log(
      "📊 Request size:",
      JSON.stringify(requestPayload).length,
      "bytes"
    );
    console.groupEnd();

    try {
      // =================== API CALL EXECUTION ===================
      console.group("🌐 API Call Execution");
      console.time("⏱️ Registration API Call Duration");

      console.log("📡 Sending POST request to backend...");
      const response = await apiClient.post(
        "/auth/register/institution",
        requestPayload
      );

      console.timeEnd("⏱️ Registration API Call Duration");

      // =================== SUCCESS RESPONSE ANALYSIS ===================
      console.group("✅ SUCCESS - Backend Response Analysis");
      console.log("🎉 Registration successful!");
      console.log("📈 Response status:", response.status);
      console.log("📋 Response headers:", response.headers);
      console.log("💾 Response data:", response.data);

      /*
       * BACKEND RESPONSE STRUCTURE (from authController.js registerInstitution):
       * SUCCESS (Status 201):
       * {
       *   message: "Institution registered successfully"
       * }
       *
       * The backend also creates a new Institution document with:
       * - name: institutionName (from request)
       * - website: website (from request)
       * - contactPerson: contactPerson (from request)
       * - email: email (from request)
       * - password: hashedPassword (bcrypt hashed)
       * - role: "institution" (hardcoded)
       * - _id: MongoDB ObjectId (auto-generated)
       * - createdAt, updatedAt: timestamps (auto-generated)
       */

      console.log("📝 Expected backend actions completed:");
      console.log("  ✅ Email uniqueness check passed");
      console.log("  ✅ Password hashed using bcrypt");
      console.log("  ✅ Institution document created in MongoDB");
      console.log("  ✅ Success response sent");

      console.groupEnd(); // End success analysis group
      console.groupEnd(); // End API execution group

      // =================== UI FEEDBACK ===================
      console.group("🎨 UI Feedback & Navigation");
      console.log("🍞 Showing success toast notification");
      toast.success("Institution registration successful! Please login.");

      console.log("⏰ Setting 2-second delay before navigation");
      console.log("🧭 Will navigate to: /auth");
      setTimeout(() => {
        console.log("🚀 Navigating to login page...");
        navigate("/auth");
      }, 2000);
      console.groupEnd();
    } catch (err) {
      // =================== ERROR HANDLING & ANALYSIS ===================
      console.group("❌ ERROR - Registration Failed");
      console.error("💥 Registration error occurred:", err);

      if (err.response) {
        // =================== SERVER ERROR RESPONSE ===================
        console.group("🖥️ Server Error Response Analysis");
        console.error("📡 Server responded with error");
        console.error("📈 Error status:", err.response.status);
        console.error("📋 Error headers:", err.response.headers);
        console.error("💾 Error data:", err.response.data);

        /*
         * POSSIBLE BACKEND ERROR RESPONSES (from authController.js):
         *
         * 1. EMAIL ALREADY EXISTS (Status 400):
         * {
         *   message: "Email already exists"
         * }
         *
         * 2. SERVER ERROR (Status 500):
         * {
         *   message: "Server error"
         * }
         *
         * Additional context: Backend logs "Institution Register Error:" with full error details
         */

        const errorMessage =
          err.response?.data?.message || `Server error: ${err.response.status}`;
        console.log("🔍 Parsed error message:", errorMessage);

        // Analyze specific error types
        if (
          err.response.status === 400 &&
          err.response.data?.message === "Email already exists"
        ) {
          console.warn("⚠️ CONFLICT: Email already registered");
          console.log(
            "💡 Suggestion: User should try login or use different email"
          );
        } else if (err.response.status === 500) {
          console.error("🔥 CRITICAL: Server internal error");
          console.log(
            "💡 Suggestion: Check server logs, database connection, or try again later"
          );
        }

        setError(errorMessage);
        toast.error(errorMessage);
        console.groupEnd(); // End server error analysis group
      } else if (err.request) {
        // =================== NETWORK ERROR ===================
        console.group("🌐 Network Error Analysis");
        console.error("📡 No response received from server");
        console.error("🔌 Request object:", err.request);
        console.error("💡 Possible causes:");
        console.error("  - Server is down");
        console.error("  - Network connectivity issues");
        console.error("  - CORS problems");
        console.error("  - Firewall blocking request");
        console.error("  - Wrong API endpoint URL");

        const networkError =
          "No response from server. Please check your connection.";
        setError(networkError);
        toast.error(networkError);
        console.groupEnd(); // End network error analysis group
      } else {
        // =================== CLIENT-SIDE ERROR ===================
        console.group("🖥️ Client-side Error Analysis");
        console.error("💻 Client-side error during request setup");
        console.error("📝 Error message:", err.message);
        console.error("🔍 Error type:", err.name);
        console.error("📚 Error stack:", err.stack);

        const clientError = `Error: ${err.message}`;
        setError(clientError);
        toast.error(clientError);
        console.groupEnd(); // End client error analysis group
      }

      console.groupEnd(); // End main error group
    } finally {
      // =================== CLEANUP ===================
      console.group("🧹 Cleanup & State Reset");
      console.log("⏳ Setting loading state to false");
      setLoading(false);
      console.log("✅ Form submission process completed");
      console.groupEnd();

      console.groupEnd(); // End main form submission group
      console.log(
        "🏁 Institution registration form submission ended at:",
        new Date().toISOString()
      );
    }
  };

  const passwordValidationRules = [
    { label: "At least 8 characters", key: "length" },
    { label: "One uppercase letter", key: "upper" },
    { label: "One lowercase letter", key: "lower" },
    { label: "One number", key: "number" },
    { label: "One special character", key: "special" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
        toastClassName="dark:bg-gray-800 dark:text-white"
      />

      <div className="pt-16">
        <RegistrationHeader
          title="Institution Registration"
          subtitle="Transform your campus placements with our AI-powered recruitment platform."
          tagline="Complete setup in under 5 minutes"
          icon={<School className="w-10 h-10 text-white" />}
          color="blue"
          userType="institution"
        />
      </div>

      <div className="py-12 px-4">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 transition-colors duration-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="institution-name"
              label="Institution Name"
              value={formData.institutionName}
              onChange={(e) =>
                handleFormDataChange("institutionName", e.target.value)
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            <FormInput
              id="institution-website"
              label="Website"
              type="url"
              value={formData.website}
              onChange={(e) => handleFormDataChange("website", e.target.value)}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            <FormInput
              id="institution-contact-person"
              label="Contact Person"
              value={formData.contactPerson}
              onChange={(e) =>
                handleFormDataChange("contactPerson", e.target.value)
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            <FormInput
              id="institution-email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) => handleFormDataChange("email", e.target.value)}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            <FormInput
              id="institution-password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handlePasswordChange}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            {/* Dynamic Password Validation - Only show if password field has content */}
            {formData.password && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 space-y-2"
              >
                {passwordValidationRules.map((rule) => {
                  const isValid = passwordRules[rule.key];
                  return (
                    <motion.div
                      key={rule.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <motion.div
                        initial={false}
                        animate={{ 
                          scale: isValid ? 1.1 : 1,
                          rotate: isValid ? 360 : 0 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {isValid ? (
                          <CheckCircle className="text-green-500 w-4 h-4" />
                        ) : (
                          <XCircle className="text-red-500 w-4 h-4" />
                        )}
                      </motion.div>
                      <span
                        className={`transition-colors duration-200 ${
                          isValid
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-500 dark:text-red-400"
                        }`}
                      >
                        {rule.label}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            <FormInput
              id="institution-confirm-password"
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleFormDataChange("confirmPassword", e.target.value)
              }
              onPaste={(e) => e.preventDefault()}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            {/* Password Mismatch Indicator */}
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400"
              >
                <XCircle className="w-4 h-4" />
                <span>Passwords do not match</span>
              </motion.div>
            )}

            {/* Password Match Indicator */}
            {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Passwords match</span>
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={
                loading ||
                !allPasswordRulesSatisfied ||
                formData.password !== formData.confirmPassword
              }
              className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                loading ||
                !allPasswordRulesSatisfied ||
                formData.password !== formData.confirmPassword
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              }`}
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? "Registering..." : "Register Institution"}
            </motion.button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
