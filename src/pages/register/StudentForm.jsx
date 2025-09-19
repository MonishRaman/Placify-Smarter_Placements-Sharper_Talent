import { GraduationCap, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Animation library
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormInput from "../../components/FormInput";
import RegistrationHeader from "../../components/RegistrationHeader";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import apiClient from "../../api/apiClient";
import { CheckCircle, XCircle } from "lucide-react";

export default function StudentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    university: "",
    major: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (
      !formData.fullName ||
      !formData.university ||
      !formData.major ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Check if all password rules are satisfied
    if (!allPasswordRulesSatisfied) {
      setError("Password must meet all security requirements");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending registration request with data:", formData);
      await apiClient.post("/auth/register/student", formData);
      toast.success("Registration successful! Please login.");
      setTimeout(() => navigate("/auth"), 2000);
    } catch (err) {
      if (err.response) {
        setError(
          err.response?.data?.message || `Server error: ${err.response.status}`
        );
        toast.error(
          err.response?.data?.message || `Server error: ${err.response.status}`
        );
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
        toast.error("No response from server. Please check your connection.");
      } else {
        setError(`Error: ${err.message}`);
        toast.error(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Top header */}
      <Header />

      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
        toastClassName="dark:bg-gray-800 dark:text-white"
      />

      {/* Hero section */}
      <div className="pt-16">
        <RegistrationHeader
          title="Student Registration"
          subtitle="Join thousands of students who have landed their dream jobs with Placify's AI-powered interview coaching."
          tagline="Takes less than 2 minutes. No resume required."
          icon={<GraduationCap className="w-10 h-10 text-white" />}
          color="purple"
          userType="student"
        />
      </div>

      {/* Form section */}
      <div className="py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative max-w-lg mx-auto p-8 rounded-2xl shadow-xl
                     bg-white dark:bg-slate-800 border border-transparent 
                     transition-all
                     before:absolute before:inset-0 before:rounded-2xl before:p-[2px]
                     before:bg-gradient-to-r before:from-indigo-600 before:via-purple-600 before:to-indigo-700
                     before:animate-gradient-move before:-z-10"
        >
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-500/50"
              role="alert"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              id="student-fullname"
              label="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
            <FormInput
              id="student-university"
              label="University Name"
              value={formData.university}
              onChange={(e) =>
                setFormData({ ...formData, university: e.target.value })
              }
              required
            />
            <FormInput
              id="student-major"
              label="Major/Field of Study"
              value={formData.major}
              onChange={(e) =>
                setFormData({ ...formData, major: e.target.value })
              }
              required
            />
            <FormInput
              id="student-email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <FormInput
              id="student-password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handlePasswordChange}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              required
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
              id="student-confirm-password"
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              onPaste={(e) => e.preventDefault()}
              required
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

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={
                loading ||
                !allPasswordRulesSatisfied ||
                formData.password !== formData.confirmPassword
              }
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 text-lg font-medium rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 ${
                loading ||
                !allPasswordRulesSatisfied ||
                formData.password !== formData.confirmPassword
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              }`}
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? "Registering..." : "Register as Student"}
            </motion.button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
