import {
  GraduationCap,
  Loader2,
  CheckCircle,
  XCircle,
  Brain,
  Clock,
  Users2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormInput from "../../components/FormInput";
import RegistrationHeader from "../../components/RegistrationHeader";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import apiClient from "../../api/apiClient";

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
  const [emailError, setEmailError] = useState("");
  const [showMobileHero, setShowMobileHero] = useState(false);

  // Logic remains the same to calculate strength
  const [passwordStrength, setPasswordStrength] = useState("");
  const [requirements, setRequirements] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const checkPasswordStrength = (pwd) => {
    const newReqs = {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*]/.test(pwd),
    };

    setRequirements(newReqs);

    const metCount = Object.values(newReqs).filter(Boolean).length;
    if (metCount <= 2) setPasswordStrength("Weak");
    else if (metCount === 3 || metCount === 4) setPasswordStrength("Medium");
    else setPasswordStrength("Strong");
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    checkPasswordStrength(newPassword);
  };

  const allRequirementsMet = Object.values(requirements).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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

    if (!allRequirementsMet) {
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-950 text-white p-6 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Student Registration</h2>
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
                Land your dream job with AI-powered interview coaching
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
                    Join thousands of students who have landed their dream jobs
                    with Placify.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                      <Brain className="w-4 h-4" />
                      <span>AI-Powered</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                      <Clock className="w-4 h-4" />
                      <span>2 Min Setup</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                      <Users2 className="w-4 h-4" />
                      <span>Smart Feedback</span>
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
            title="Student Registration"
            subtitle="Join thousands of students who have landed their dream jobs with Placify's AI-powered interview coaching."
            tagline="Takes less than 2 minutes"
            icon={<GraduationCap className="w-10 h-10 text-white" />}
            color="purple"
            userType="student"
          />
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        {/* Floating particles - fewer and lighter for form side */}
        {particles.slice(0, 8).map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/5 dark:bg-purple-500/10"
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
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                role="alert"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                id="student-fullname"
                label="Full Name"
                placeholder="Enter your Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />

              <FormInput
                id="student-university"
                label="University Name"
                placeholder="Enter your University's Name"
                value={formData.university}
                onChange={(e) =>
                  setFormData({ ...formData, university: e.target.value })
                }
                required
              />
              <FormInput
                id="student-major"
                label="Major/Field of Study"
                placeholder="Enter your field of study"
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
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, email: val });

                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (val && !emailRegex.test(val)) {
                    setEmailError(
                      "Please enter a valid email — e.g. user@example.com"
                    );
                  } else {
                    setEmailError("");
                  }
                }}
                required
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
              />

              {emailError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-red-500 mt-1"
                >
                  {emailError}
                </motion.div>
              )}

              <FormInput
                id="student-password"
                type="password"
                label="Password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handlePasswordChange}
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                required
              />

              {/* --- START: UPDATED PASSWORD FEEDBACK UI --- */}
              {formData.password && (
                <div className="mt-2">
                  <p
                    className={`text-sm font-medium ${
                      passwordStrength === "Strong"
                        ? "text-green-500"
                        : passwordStrength === "Medium"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    Strength: {passwordStrength}
                  </p>

                  {passwordStrength === "Weak" && (
                    <p className="text-xs mt-2 text-red-500">
                      Your password is considered weak. Please update it in
                      account settings for better security.
                    </p>
                  )}
                </div>
              )}
              {/* --- END: UPDATED PASSWORD FEEDBACK UI --- */}

              <FormInput
                id="student-confirm-password"
                type="password"
                label="Confirm Password"
                placeholder="Enter Confirm password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                onPaste={(e) => e.preventDefault()}
                required
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

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={
                  loading ||
                  !allRequirementsMet ||
                  formData.password !== formData.confirmPassword
                }
                className={`w-full flex justify-center items-center gap-2 py-3 px-4 text-base font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 transition-all duration-200 ${
                  loading ||
                  !allRequirementsMet ||
                  formData.password !== formData.confirmPassword
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                }`}
              >
                {loading && <Loader2 className="animate-spin w-5 h-5" />}
                {loading ? "Registering..." : "Register as Student"}
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
