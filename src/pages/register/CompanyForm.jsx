import { Building2, Loader2, CheckCircle, XCircle } from "lucide-react";
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

export default function CompanyForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    website: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "company",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Password validation & strength tracking
  const [passwordStrength, setPasswordStrength] = useState("");
  const [requirements, setRequirements] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

    // Field validation
    if (
      !formData.companyName ||
      !formData.industry ||
      !formData.website ||
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

    // API call
    try {
      await apiClient.post("/auth/register/company", formData);
      toast.success("Company registration successful! Please login.");
      setTimeout(() => navigate("/auth"), 2000);
    } catch (err) {
      if (err.response) {
        setError(
          err.response?.data?.message ||
            `Server error: ${err.response.status}`
        );
        toast.error(
          err.response?.data?.message ||
            `Server error: ${err.response.status}`
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

  // Animated floating particles
  const particleCount = 20;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    size: Math.random() * 15 + 10,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 5,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Particles */}
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

      {/* Header & Toasts */}
      <Header />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
        toastClassName="dark:bg-gray-800 dark:text-white"
      />

      <div className="pt-16">
        <RegistrationHeader
          title="Company Registration"
          subtitle="Scale your hiring process with enterprise-grade AI assessment platform. Join 500+ companies transforming recruitment with intelligent automation."
          tagline="Enterprise setup in minutes."
          icon={<Building2 className="w-10 h-10 text-white" />}
          color="orange"
          userType="company"
        />
      </div>

      {/* Main Form Card */}
      <div className="py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative max-w-lg mx-auto p-8 rounded-2xl shadow-xl
                     bg-white dark:bg-slate-800 border border-transparent 
                     transition-all
                     before:absolute before:inset-0 before:rounded-2xl before:p-[2px]
                     before:bg-gradient-to-r before:from-orange-500 before:via-yellow-500 before:to-orange-600
                     before:animate-gradient-move before:-z-10"
        >
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-500/50"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              id="company-name"
              label="Company Name"
              placeholder="Enter company's name"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              required
            />

            <FormInput
              id="company-industry"
              label="Industry"
              placeholder="Enter industry"
              value={formData.industry}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
              required
            />

            <FormInput
              id="company-website"
              label="Website"
              placeholder="Enter company website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              required
            />

            <FormInput
              id="company-email"
              type="email"
              label="HR Contact Email"
              placeholder="Enter HR email"
              value={formData.email}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, email: val });

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (val && !emailRegex.test(val)) {
                  setEmailError("Please enter a valid email — e.g. hr@company.com");
                } else {
                  setEmailError("");
                }
              }}
              required
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
            />

            {/* Email validation error (animated) */}
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
              id="company-password"
              type="password"
              label="Password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handlePasswordChange}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              required
            />

            {/* Password strength indicator */}
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
                    Your password is weak. Please use a stronger one for better security.
                  </p>
                )}
              </div>
            )}

            <FormInput
              id="company-confirm-password"
              type="password"
              label="Confirm Password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              onPaste={(e) => e.preventDefault()}
              required
            />

            {/* Password match / mismatch indicators */}
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
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 text-lg font-medium rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 ${
                loading ||
                !allRequirementsMet ||
                formData.password !== formData.confirmPassword
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
              }`}
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? "Registering..." : "Register Company"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
