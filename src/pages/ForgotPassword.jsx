import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Mail } from "lucide-react";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hardError, setHardError] = useState("");

  const onChangeEmail = (val) => {
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !emailRegex.test(val)) {
      setEmailError("Please enter a valid email (e.g., user@example.com).");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHardError("");

  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Placify
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Forgot Password
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Enter your email to receive a password reset link.
            </p>
          </motion.div>

          {hardError && (
            <p className="text-red-500 text-center mb-4" role="alert">
              {hardError}
            </p>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => onChangeEmail(e.target.value)}
                    required
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                {emailError && (
                  <p id="email-error" className="text-red-500 text-sm mt-1">
                    {emailError}
                  </p>
                )}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading || !email || !!emailError}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-green-600 dark:text-green-400 font-medium">
                If an account exists for{" "}
                <span className="font-semibold">{email}</span>, we'll email you
                a link to reset your password.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Didn't get an email? Check your spam folder or try again in a
                few minutes.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/auth" className="text-purple-600 font-semibold">
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
