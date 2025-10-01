import { Briefcase, Loader2 } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
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

export default function EmployeeForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    currentCompany: "",
    jobTitle: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
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

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);


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
      !formData.currentCompany ||
      !formData.jobTitle ||
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
      console.log("Sending registration data:", formData);
      await apiClient.post("/auth/register/employee", formData);

      toast.success("Employee registration successful! Please login.");
      setTimeout(() => navigate("/auth"), 2000);
    } catch (err) {
      console.error("Registration error:", err);

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

  // 🌟 Bubble particles setup
  const particleCount = 20;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    size: Math.random() * 15 + 10,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 5,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-slate-900">
      {/* Floating Bubbles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20 dark:bg-white/10"
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

      <Header />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
        toastClassName="dark:bg-gray-800 dark:text-white"
      />
      <div className="pt-16">
        <RegistrationHeader
          title="HR Professional Registration"
          subtitle="Revolutionize your recruitment process with AI-powered candidate assessment and streamlined hiring workflows designed for HR professionals."
          tagline="Quick setup for recruiting teams"
          icon={<Briefcase className="w-10 h-10 text-white" />}
          color="green"
          userType="employee"
        />
      </div>
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-slate-800 relative z-10">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-500/50">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="employee-fullname"
              label="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <FormInput
              id="employee-current-company"
              label="Current Company"
              value={formData.currentCompany}
              onChange={(e) =>
                setFormData({ ...formData, currentCompany: e.target.value })
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <FormInput
              id="employee-job-title"
              label="Job Title"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <FormInput
              id="employee-email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <FormInput
              id="employee-password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handlePasswordChange}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            {/* Dynamic Password Validation */}
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
              id="employee-confirm-password"
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              onPaste={(e) => e.preventDefault()}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            {/* Password Match Indicators */}
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={
                loading ||
                !allPasswordRulesSatisfied ||
                formData.password !== formData.confirmPassword
              }
              className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md transition duration-200 ${
                loading ||
                !allPasswordRulesSatisfied ||
                formData.password !== formData.confirmPassword
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70"
                  : "bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white"
              }`}
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? "Registering..." : "Register as Employee"}
            </motion.button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
