import logger from '../../utils/logger';
import {
  School,
  Loader2,
  CheckCircle,
  XCircle,
  Brain,
  Clock,
  Users2,
} from "lucide-react";
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

// =================== PERFORMANCE MONITORING ===================
const componentStartTime = performance.now();
console.group("⚡ InstitutionForm Component Performance Monitoring");
logger.debug("🚀 Component file loaded at:", new Date().toISOString());
logger.debug("📊 Performance start time:", componentStartTime);
console.groupEnd();

export default function InstitutionForm() {
  const navigate = useNavigate();

  // =================== COMPONENT INITIALIZATION DEBUGGING ===================
  console.group("🏛️ InstitutionForm Component Initialization");
  logger.debug("📅 Component mounted at:", new Date().toISOString());
  logger.debug("🧭 Navigation object:", navigate);

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
  const [showMobileHero, setShowMobileHero] = useState(false);

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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    logger.debug("📋 Form submission started at:", new Date().toISOString());
    logger.debug("📝 Current form data:", formData);
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

    logger.debug("🔍 Checking required fields:", requiredFields);

    if (
      !formData.institutionName ||
      !formData.website ||
      !formData.contactPerson ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      logger.error("❌ Validation failed: Missing required fields");
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
      logger.debug("✅ Website URL is valid:", {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        pathname: urlObj.pathname,
      });
    } catch (urlError) {
      logger.error("❌ Website URL validation failed:", urlError.message);
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
      logger.error("❌ Password confirmation mismatch");
      logger.debug("Password:", formData.password?.length, "characters");
      logger.debug(
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

    logger.debug("✅ All client-side validations passed");
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

    logger.debug("📦 Request payload prepared:", requestPayload);
    logger.debug("🎯 API endpoint: /auth/register/institution");
    logger.debug(
      "📊 Request size:",
      JSON.stringify(requestPayload).length,
      "bytes"
    );
    console.groupEnd();

    try {
      // =================== API CALL EXECUTION ===================
      console.group("🌐 API Call Execution");
      console.time("⏱️ Registration API Call Duration");

      logger.debug("📡 Sending POST request to backend...");
      const response = await apiClient.post(
        "/auth/register/institution",
        requestPayload
      );

      console.timeEnd("⏱️ Registration API Call Duration");

      // =================== SUCCESS RESPONSE ANALYSIS ===================
      console.group("✅ SUCCESS - Backend Response Analysis");
      logger.debug("🎉 Registration successful!");
      logger.debug("📈 Response status:", response.status);
      logger.debug("📋 Response headers:", response.headers);
      logger.debug("💾 Response data:", response.data);

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

      logger.debug("📝 Expected backend actions completed:");
      logger.debug("  ✅ Email uniqueness check passed");
      logger.debug("  ✅ Password hashed using bcrypt");
      logger.debug("  ✅ Institution document created in MongoDB");
      logger.debug("  ✅ Success response sent");

      console.groupEnd(); // End success analysis group
      console.groupEnd(); // End API execution group

      // =================== UI FEEDBACK ===================
      console.group("🎨 UI Feedback & Navigation");
      logger.debug("🍞 Showing success toast notification");
      toast.success("Institution registration successful! Please login.");

      logger.debug("⏰ Setting 2-second delay before navigation");
      logger.debug("🧭 Will navigate to: /auth");
      setTimeout(() => {
        logger.debug("🚀 Navigating to login page...");
        navigate("/auth");
      }, 2000);
      console.groupEnd();
    } catch (err) {
      // =================== ERROR HANDLING & ANALYSIS ===================
      console.group("❌ ERROR - Registration Failed");
      logger.error("💥 Registration error occurred:", err);

      if (err.response) {
        // =================== SERVER ERROR RESPONSE ===================
        console.group("🖥️ Server Error Response Analysis");
        logger.error("📡 Server responded with error");
        logger.error("📈 Error status:", err.response.status);
        logger.error("📋 Error headers:", err.response.headers);
        logger.error("💾 Error data:", err.response.data);

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
        logger.debug("🔍 Parsed error message:", errorMessage);

        // Analyze specific error types
        if (
          err.response.status === 400 &&
          err.response.data?.message === "Email already exists"
        ) {
          logger.warn("⚠️ CONFLICT: Email already registered");
          logger.debug(
            "💡 Suggestion: User should try login or use different email"
          );
        } else if (err.response.status === 500) {
          logger.error("🔥 CRITICAL: Server internal error");
          logger.debug(
            "💡 Suggestion: Check server logs, database connection, or try again later"
          );
        }

        setError(errorMessage);
        toast.error(errorMessage);
        console.groupEnd(); // End server error analysis group
      } else if (err.request) {
        // =================== NETWORK ERROR ===================
        console.group("🌐 Network Error Analysis");
        logger.error("📡 No response received from server");
        logger.error("🔌 Request object:", err.request);
        logger.error("💡 Possible causes:");
        logger.error("  - Server is down");
        logger.error("  - Network connectivity issues");
        logger.error("  - CORS problems");
        logger.error("  - Firewall blocking request");
        logger.error("  - Wrong API endpoint URL");

        const networkError =
          "No response from server. Please check your connection.";
        setError(networkError);
        toast.error(networkError);
        console.groupEnd(); // End network error analysis group
      } else {
        // =================== CLIENT-SIDE ERROR ===================
        console.group("🖥️ Client-side Error Analysis");
        logger.error("💻 Client-side error during request setup");
        logger.error("📝 Error message:", err.message);
        logger.error("🔍 Error type:", err.name);
        logger.error("📚 Error stack:", err.stack);

        const clientError = `Error: ${err.message}`;
        setError(clientError);
        toast.error(clientError);
        console.groupEnd(); // End client error analysis group
      }

      console.groupEnd(); // End main error group
    } finally {
      // =================== CLEANUP ===================
      console.group("🧹 Cleanup & State Reset");
      logger.debug("⏳ Setting loading state to false");
      setLoading(false);
      logger.debug("✅ Form submission process completed");
      console.groupEnd();

      console.groupEnd(); // End main form submission group
      logger.debug(
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

  const particleCount = 20;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    size: Math.random() * 15 + 10,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 5,
  }));

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Header for mobile only */}
      <div className="lg:hidden">
        <Header />
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
        toastClassName="dark:bg-gray-800 dark:text-white"
      />

      {/* Left Panel - Hero Section */}
      <div className="w-full lg:w-1/2">
        {/* Mobile Condensed Hero with Toggle */}
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-950 text-white p-6 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <School className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    Institution Registration
                  </h2>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMobileHero(!showMobileHero)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  aria-label="Toggle details"
                >
                  <motion.div
                    animate={{ rotate: showMobileHero ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </motion.button>
              </div>

              <p className="text-white/90 text-sm mb-3">
                Transform campus placements with AI-powered platform
              </p>

              {/* Expandable content */}
              <motion.div
                initial={false}
                animate={{
                  height: showMobileHero ? "auto" : 0,
                  opacity: showMobileHero ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-white/20 space-y-3">
                  <p className="text-white/80 text-sm">
                    Complete setup in under 5 minutes and revolutionize your
                    placement process.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                      <Brain className="w-4 h-4" />
                      <span>AI Platform</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                      <Clock className="w-4 h-4" />
                      <span>5 Min Setup</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                      <Users2 className="w-4 h-4" />
                      <span>Smart Placement</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Desktop Full Hero */}
        <div className="hidden lg:block">
          <RegistrationHeader
            title="Institution Registration"
            subtitle="Transform your campus placements with our AI-powered recruitment platform."
            tagline="Complete setup in under 5 minutes"
            icon={<School className="w-10 h-10 text-white" />}
            color="blue"
            userType="institution"
          />
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        {/* Floating particles - fewer and lighter for form side */}
        {particles.slice(0, 8).map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/5 dark:bg-blue-500/10"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              bottom: `-${p.size}px`,
            }}
            animate={{ y: ["0%", "-120vh"] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                id="institution-name"
                label="Institution Name"
                placeholder="Enter Institution's Name"
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
                placeholder="Enter Institution's Website"
                type="url"
                value={formData.website}
                onChange={(e) =>
                  handleFormDataChange("website", e.target.value)
                }
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />

              <FormInput
                id="institution-contact-person"
                label="Contact Person"
                placeholder="Enter contact person"
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
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleFormDataChange("email", e.target.value)}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />

              <FormInput
                id="institution-password"
                type="password"
                label="Password"
                placeholder="Enter password"
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
                  animate={{ opacity: 1, height: "auto" }}
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
                            rotate: isValid ? 360 : 0,
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
                placeholder="Enter confirm password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleFormDataChange("confirmPassword", e.target.value)
                }
                onPaste={(e) => e.preventDefault()}
                required
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />

              {/* Password Mismatch Indicator */}
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
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
              {formData.confirmPassword &&
                formData.password === formData.confirmPassword &&
                formData.password.length > 0 && (
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
                className={`w-full flex justify-center items-center gap-2 py-3 px-4 text-base font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 ${
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
        </motion.div>
      </div>

      {/* Footer */}
      <div className="w-full lg:hidden">
        <Footer />
      </div>
    </div>
  );
}
