import { School, Loader2 } from "lucide-react";
import { useState } from "react";
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

export default function InstitutionForm() {
  const navigate = useNavigate();

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
  const allPasswordRulesSatisfied = Object.values(passwordRules).every(rule => rule);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (
      !formData.institutionName ||
      !formData.website ||
      !formData.contactPerson ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    
    try {
      new URL(formData.website);
    } catch {
      setError("Please enter a valid website URL");
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
      console.log("Sending registration data:", formData);

      await apiClient.post("/auth/register/institution", formData);

      toast.success("Institution registration successful! Please login.");
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
              label="Institution Name"
              value={formData.institutionName}
              onChange={(e) =>
                setFormData({ ...formData, institutionName: e.target.value })
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            <FormInput
              label="Website"
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />

            <FormInput
              label="Contact Person"
              value={formData.contactPerson}
              onChange={(e) =>
                setFormData({ ...formData, contactPerson: e.target.value })
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
              disabled={loading || !allPasswordRulesSatisfied || (formData.password !== formData.confirmPassword)}
              className={`w-full flex justify-center items-center gap-2 py-2 px-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ${
                loading || !allPasswordRulesSatisfied || (formData.password !== formData.confirmPassword)
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white'
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