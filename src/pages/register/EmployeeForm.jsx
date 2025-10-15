import { Briefcase, Loader2, CheckCircle, XCircle } from "lucide-react";
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
  const [emailError, setEmailError] = useState("");

  // Password strength tracking
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
      await apiClient.post("/auth/register/employee", formData);
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating particles */}
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
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative max-w-lg mx-auto p-8 rounded-2xl shadow-xl
                     bg-white dark:bg-slate-800 border border-transparent 
                     transition-all
                     before:absolute before:inset-0 before:rounded-2xl before:p-[2px]
                     before:bg-gradient-to-r before:from-green-600 before:via-emerald-600 before:to-green-700
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
              id="employee-fullname"
              label="Full Name"
              placeholder="Enter your Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />

            <FormInput
              id="employee-company"
              label="Current Company"
              placeholder="Enter your company's name"
              value={formData.currentCompany}
              onChange={(e) =>
                setFormData({ ...formData, currentCompany: e.target.value })
              }
              required
            />

            <FormInput
              id="employee-job"
              label="Job Title"
              placeholder="Enter your job title"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              required
            />

            <FormInput
              id="employee-email"
              type="email"
              label="Email"
              placeholder="Enter your email"
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
              id="employee-password"
              type="password"
              label="Password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handlePasswordChange}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              required
            />

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

            <FormInput
              id="employee-confirm-password"
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
                !allRequirementsMet ||
                formData.password !== formData.confirmPassword
              }
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 text-lg font-medium rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 ${
                loading ||
                !allRequirementsMet ||
                formData.password !== formData.confirmPassword
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              }`}
            >
              {loading && <Loader2 className="animate-spin w-5 h-5" />}
              {loading ? "Registering..." : "Register as Employee"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
