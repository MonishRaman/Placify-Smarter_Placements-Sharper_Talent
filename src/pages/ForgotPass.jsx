import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Brain, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion"; // No changes here
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../api/apiClient";

const ResetPasswordPage = () => {
  // All state and logic functions remain exactly the same
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [requirements, setRequirements] = useState({
    length: false, upper: false, lower: false, number: false, special: false,
  });
  const checkPasswordStrength = (pwd) => {
    const newReqs = { length: pwd.length >= 8, upper: /[A-Z]/.test(pwd), lower: /[a-z]/.test(pwd), number: /[0-9]/.test(pwd), special: /[!@#$%^&*]/.test(pwd) };
    setRequirements(newReqs);
    const metCount = Object.values(newReqs).filter(Boolean).length;
    if (metCount <= 2) setPasswordStrength("Weak");
    else if (metCount <= 3 || metCount === 4) setPasswordStrength("Medium");
    else setPasswordStrength("Strong");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setPasswordError("Passwords do not match."); toast.error("Passwords do not match."); return; }
    if (!Object.values(requirements).every(Boolean)) { setPasswordError("Please ensure your password meets all requirements."); toast.error("Password is not strong enough."); return; }
    setPasswordError(""); setError(""); setLoading(true);
    try {
      await apiClient.post("/auth/reset-password", { email, password });
      toast.success("Password reset successfully! Redirecting...");
      setTimeout(() => { navigate("/auth"); }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reset password.";
      setError(errorMessage); toast.error(errorMessage);
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <ToastContainer position="top-center" autoClose={2000} theme="colored"/>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full space-y-8"
      >
        {/* === ANIMATION CHANGE #1: The entire card now has the spring animation === */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200, damping: 12 }}
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8"
        >
          <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* === ANIMATION CHANGE #2: Header and its contents are now animated === */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center space-x-2 mb-4"
            >
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Placify</span>
            </motion.div>
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              Reset Password
            </motion.h2>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-gray-600 dark:text-gray-300 mt-2"
            >
              Create a new strong password for your account.
            </motion.p>
          </motion.div>
          
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* === ANIMATION CHANGE #3: The form and its fields are now animated === */}
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            onSubmit={handleSubmit} className="space-y-6"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Your Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"><Mail className="w-5 h-5 text-gray-400" /></div>
                <input id="email" type="email" required value={email} onChange={(e) => { const val = e.target.value; setEmail(val); if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setEmailError("Please enter a valid email address."); } else { setEmailError(""); } }}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter your email" />
              </div>
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">New Password</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"><Lock className="w-5 h-5 text-gray-400" /></div>
                 <input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => { setPassword(e.target.value); checkPasswordStrength(e.target.value); }}
                   className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter new password" />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
              </div>
            </motion.div>
            
            {password && (
              // This part doesn't need extra animation as it's tied to the password field's appearance
              <div className="mt-2">
                <p className={`text-sm font-medium ${passwordStrength === "Strong" ? "text-green-500" : passwordStrength === "Medium" ? "text-yellow-500" : "text-red-500"}`}>Strength: {passwordStrength}</p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                  <li className={requirements.length ? "text-green-500" : ""}>• At least 8 characters</li>
                  <li className={requirements.upper ? "text-green-500" : ""}>• One uppercase letter</li>
                  <li className={requirements.lower ? "text-green-500" : ""}>• One lowercase letter</li>
                  <li className={requirements.number ? "text-green-500" : ""}>• One number</li>
                  <li className={requirements.special ? "text-green-500" : ""}>• One special character (!@#$%^&*)</li>
                </ul>
              </div>
            )}
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"><Lock className="w-5 h-5 text-gray-400" /></div>
                <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Confirm your password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading || !!emailError}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (<motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"/>) : ("Reset Password")}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600 dark:text-gray-300">
              Remembered your password?
              <Link to="/auth" className="ml-2 text-purple-600 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResetPasswordPage;
