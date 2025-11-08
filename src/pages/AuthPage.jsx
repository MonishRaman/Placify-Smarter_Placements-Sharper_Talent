import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import our new apiClient instead of axios directly
import apiClient from "../api/apiClient"; // <-- CHANGE HERE
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
const AuthPage = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passerror, setPasserror] = useState("");
  const [emailError, setEmailError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only enforce strong password rules on SIGN UP flows (isLogin === false)
    if (!isLogin) {
      if (
        !requirements.length ||
        !requirements.upper ||
        !requirements.lower ||
        !requirements.number ||
        !requirements.special
      ) {
        setPasserror(
          "Password must be strong (8+ chars, uppercase, lowercase, number, special character)."
        );
        return;
      }
    }
    // For login we clear blocking error even if password is weak
    setPasserror("");

    setLoading(true);
    setError("");

    try {
      // --- REFACTORED API CALL ---
      // No more hardcoded URL or headers!
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token & user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      logger.debug("Token stored:", token);

      const decoded = jwtDecode(token);
      const role = decoded.role;
      logger.debug("User role:", role);

      setIsAuthenticated(true);

      toast.success("Login successful! Redirecting...");
      if (isLogin && passwordStrength === "Weak") {
        setTimeout(() => {
          toast.warning(
            "Your password is weak. Please update it in Account Settings for improved security.",
            { autoClose: 4000 }
          );
        }, 300);
      }

      // Redirect based on role with delay for toast
      setTimeout(() => {
        switch (role) {
          case "student":
            navigate("/dashboard");
            break;
          case "institution":
            navigate("/dashboard/institution");
            break;
          case "employee":
            navigate("/dashboard/employee");
            break;
          case "company":
            navigate("/dashboard/company");
            break;
          default:
            logger.warn("Unknown role:", role);
            navigate("/dashboard");
        }
      }, 1000);
    } catch (err) {
      // The global interceptor will show an alert, but we can still set a local error if we want
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... the rest of your JSX remains exactly the same
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
        toastClassName="dark:bg-gray-800 dark:text-white"
      />
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full space-y-8"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.99 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 12,
            mass: 0.5,
          }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 hover:shadow-2xl transition-shadow duration-300"
        >
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                type: "spring",
                stiffness: 200,
              }}
              className="flex items-center justify-center space-x-2 mb-4"
            >
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Placify
              </span>
            </motion.div>
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              {isLogin ? "Welcome back" : "Create account"}
            </motion.h2>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-gray-600 dark:text-gray-300 mt-2"
            >
              {isLogin
                ? "Sign in to your account"
                : "Start your journey with us"}
            </motion.p>
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-red-500 text-center mb-4"
            >
              {error}
            </motion.p>
          )}

          {/* Form */}
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Email address <sup className="text-sm text-red-500 ml-1">*</sup>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  id="email"
                  type="email"
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!isLogin && val && !emailRegex.test(val)) {
                      setEmailError(
                        "Please enter a valid email (e.g., user@example.com)."
                      );
                    } else {
                      setEmailError("");
                    }
                  }}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
                             transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </motion.div>

            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}

            {/* Password */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Password <sup className="text-sm text-red-500 ml-1">*</sup>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    if(!isLogin){
                      checkPasswordStrength(val);
                    }
                  }}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-xl 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
                             transition-all duration-200"
                  placeholder="Enter your password"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>
            {passerror && <p className="text-red-500 text-sm">{passerror}</p>}
            {!isLogin && password && (
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

                {/* Show checklist only during sign up for guidance */}
                {!isLogin && (
                  <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                    <li className={requirements.length ? "text-green-500" : ""}>
                      • At least 8 characters
                    </li>
                    <li className={requirements.upper ? "text-green-500" : ""}>
                      • One uppercase letter
                    </li>
                    <li className={requirements.lower ? "text-green-500" : ""}>
                      • One lowercase letter
                    </li>
                    <li className={requirements.number ? "text-green-500" : ""}>
                      • One number
                    </li>
                    <li
                      className={requirements.special ? "text-green-500" : ""}
                    >
                      • One special character (!@#$%^&*)
                    </li>
                  </ul>
                )}
                {/* Non-blocking advisory when logging in with weak password */}
                {isLogin && passwordStrength === "Weak" && (
                  <p className="text-xs mt-2 text-yellow-500">
                    Your password is considered weak. After signing in, please
                    update it in account settings for better security.
                  </p>
                )}
              </div>
            )}

            {/* Forgot password */}
            <p style={{ marginTop: "20px", textAlign: "center" }}>
              <Link
                to="/forgot-password"
                style={{ color: "#9333EA", textDecoration: "none" }}
              >
                Forgot Password?
              </Link>
            </p>

            {/* Submit Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || emailError}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold
                         hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                         transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : null}
              {loading ? "Signing in..." : isLogin ? "Sign In" : "Sign Up"}
            </motion.button>
          </motion.form>

          {/* Switch to Sign Up/Sign In */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600 dark:text-gray-300">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={
                  isLogin
                    ? () =>
                        navigate("/register", {
                          state: { scrollToCards: true },
                        })
                    : () => setIsLogin(true)
                }
                className="ml-2 text-purple-600 font-semibold"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </motion.button>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AuthPage;
