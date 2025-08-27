import { Briefcase, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormInput from "../../components/FormInput";
import RegistrationHeader from "../../components/RegistrationHeader";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import apiClient from "../../api/apiClient"; // Import the new apiClient
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
    role: "employee", // Role is important
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
  setPasswordRules({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });
};

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
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // REFACTORED API CALL - Fixed endpoint to match server routes
      console.log("Sending registration data:", formData);
      await apiClient.post("/auth/register/employee", formData);

      toast.success("Employee registration successful! Please login.");
      setTimeout(() => navigate("/auth"), 2000);
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        setError(
          err.response?.data?.message || `Server error: ${err.response.status}`
        );
        toast.error(
          err.response?.data?.message || `Server error: ${err.response.status}`
        );
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError("No response from server. Please check your connection.");
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", err.message);
        setError(`Error: ${err.message}`);
        toast.error(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // JSX remains the same
  return (
    // 1. ADDED dark mode background to the main container
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
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
        {/* 2. ADDED dark mode background to the form card */}
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-slate-800">
          {error && (
            // 3. ADDED dark mode styles for the error message
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-500/50">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <FormInput
              label="Current Company"
              value={formData.currentCompany}
              onChange={(e) =>
                setFormData({ ...formData, currentCompany: e.target.value })
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <FormInput
              label="Job Title"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <FormInput
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
                        type="password"
                        label="Password"
                        value={formData.password}
                        onChange={(e) => {
                        const newPass = e.target.value;
                        setFormData({ ...formData, password: newPass });
                        validatePassword(newPass); 
                        }}
                        required
                        />
                        <div className="mt-2 space-y-1 text-sm">
              {[
                { label: "At least 8 characters", key: "length" },
                { label: "One uppercase letter", key: "upper" },
                { label: "One lowercase letter", key: "lower" },
                { label: "One number", key: "number" },
                { label: "One special character", key: "special" },
                        ].map((rule) => (
                        <div key={rule.key} className="flex items-center gap-2">
                        {passwordRules[rule.key] ? (
                        <CheckCircle className="text-green-500 w-4 h-4" />
                        ) : (
                        <XCircle className="text-red-500 w-4 h-4" />
                        )}
                        <span
                        className={
                        passwordRules[rule.key] ? "text-green-600" : "text-red-500"
                        }
                        >
                        {rule.label}
                        </span>
                        </div>
                        ))}
                        </div>
            <FormInput
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 dark:hover:bg-blue-500 dark:disabled:bg-blue-800"
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
