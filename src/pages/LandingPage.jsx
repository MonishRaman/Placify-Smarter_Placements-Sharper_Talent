import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Users,
  Zap,
  User,
  Target,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "../components/Chatbot";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to get dashboard route based on user role
  const getDashboardRoute = () => {
    if (!user?.role) return "/register";

    switch (user.role.toLowerCase()) {
      case "student":
        return "/dashboard";
      case "institution":
        return "/dashboard/institution";
      case "company":
        return "/dashboard/company";
      case "employee":
        return "/dashboard/employee";
      default:
        return "/register";
    }
  };

  // Handle Get Started button click
  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      navigate(getDashboardRoute());
    } else {
      navigate("/register");
    }
  };

  // Handle scroll effect for dynamic navbar
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero-section");
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        // Trigger earlier for smoother transition
        setIsScrolled(window.scrollY > heroBottom - 200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description:
        "Advanced algorithms analyze your communication skills, confidence, and technical knowledge",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Real Interview Experience",
      description:
        "Practice with realistic interview scenarios tailored to your target companies",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Feedback",
      description:
        "Get detailed insights and actionable recommendations to improve your performance",
    },
  ];

  const benefits = [
    "Boost your interview confidence",
    "Get hired by top companies",
    "Receive expert-level feedback",
    "Practice anytime, anywhere",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Enhanced Navbar */}
      <AnimatePresence>
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled
              ? "backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 shadow-lg border-b border-gray-200/80 dark:border-gray-700/80"
              : "backdrop-blur-md bg-purple-600/20 dark:bg-purple-800/30 border-b border-purple-300/30 dark:border-purple-600/40"
          }`}
          style={{
            backdropFilter: isScrolled ? "blur(16px)" : "blur(12px)",
            WebkitBackdropFilter: isScrolled ? "blur(16px)" : "blur(12px)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo Section */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center space-x-3"
              >
                {/* onClick and cursor-pointer are on the icon's div */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg cursor-pointer"
                  onClick={() => (window.location.href = "/")}
                >
                  <Brain className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </motion.div>
                {/* onClick and cursor-pointer are also on the text's span */}
                <span
                  onClick={() => (window.location.href = "/")}
                  className={`text-2xl lg:text-3xl font-bold transition-all duration-500 cursor-pointer ${
                    isScrolled
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent"
                      : "text-white dark:text-gray-100"
                  }`}
                >
                  Placify
                </span>
              </motion.div>

              {/* Desktop Navigation */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:flex items-center space-x-6"
              >
                {/* Sign In Button - Only show if not authenticated */}
                {!loading && !isAuthenticated && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-6 py-2.5 font-medium rounded-xl transition-all duration-300 hover-lift will-change-transform
                             ${
                               isScrolled
                                 ? "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 before:absolute before:inset-0 before:rounded-xl before:bg-gray-100 dark:before:bg-gray-800 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                                 : "text-white/90 dark:text-gray-100/90 hover:text-white dark:hover:text-white before:absolute before:inset-0 before:rounded-xl before:bg-white/10 dark:before:bg-white/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                             }`}
                    onClick={() => navigate("/auth")}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </span>
                  </motion.button>
                )}

                {/* Get Started Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-6 py-2.5 font-semibold rounded-xl shadow-lg transition-all duration-300 overflow-hidden group btn-hover ${
                    isScrolled
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white"
                      : "bg-white dark:bg-gray-100 text-purple-600 dark:text-purple-700"
                  }`}
                  onClick={handleGetStarted}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>
                      {!loading && isAuthenticated
                        ? "Go to Dashboard"
                        : "Get Started"}
                    </span>
                  </span>
                  {isScrolled && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-600 dark:to-indigo-600"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>

                {/* Theme Toggle */}
                <ThemeToggle />
              </motion.div>
              {/* Mobile Menu Button */}
              <motion.button
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-all duration-300 will-change-transform hover-lift ${
                  isScrolled
                    ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                    : "bg-white/10 dark:bg-white/20 hover:bg-white/20 dark:hover:bg-white/30"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X
                        className={`w-5 h-5 ${
                          isScrolled
                            ? "text-gray-600 dark:text-gray-300"
                            : "text-white dark:text-gray-100"
                        }`}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu
                        className={`w-5 h-5 ${
                          isScrolled
                            ? "text-gray-600 dark:text-gray-300"
                            : "text-white dark:text-gray-100"
                        }`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`lg:hidden overflow-hidden border-t transition-colors duration-300 ${
                    isScrolled
                      ? "border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95"
                      : "border-purple-300/30 dark:border-purple-600/40 bg-purple-600/20 dark:bg-purple-800/30"
                  }`}
                  style={{
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  <div className="py-4 space-y-3">
                    {/* Sign In Button - Only show if not authenticated */}
                    {!loading && !isAuthenticated && (
                      <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          navigate("/auth");
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 will-change-transform hover-lift ${
                          isScrolled
                            ? "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                            : "text-white/90 dark:text-gray-100/90 hover:bg-white/10 dark:hover:bg-white/20"
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <span>Sign In</span>
                      </motion.button>
                    )}

                    <motion.button
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleGetStarted();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 will-change-transform hover-lift ${
                        isScrolled
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white"
                          : "bg-white dark:bg-gray-100 text-purple-600 dark:text-purple-700"
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                      <span>
                        {!loading && isAuthenticated
                          ? "Go to Dashboard"
                          : "Get Started"}
                      </span>
                    </motion.button>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <span
                        className={`transition-colors duration-300 ${
                          isScrolled
                            ? "text-gray-700 dark:text-gray-200"
                            : "text-white/90 dark:text-gray-100/90"
                        }`}
                      >
                        Theme
                      </span>
                      <ThemeToggle />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      </AnimatePresence>

      {/* Enhanced Hero Section */}
      <motion.section
        id="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative min-h-screen bg-gradient-to-br from-black via-purple-700 to-black dark:from-purple-800 dark:via-purple-900 dark:to-indigo-950 text-white transition-colors duration-300 pt-24 lg:pt-28 overflow-hidden"
      >
        {/* Background Pattern/Decoration */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white dark:bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 dark:bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-200 dark:bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-3"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15 pb-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
            {/* Left Column - Text Content */}
            <motion.div
              className="text-center lg:text-left space-y-8"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 dark:bg-white/20 backdrop-blur-sm border border-white/20 dark:border-white/30 text-sm font-medium"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Recruitment & Skill Assessment
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                <span className="block">Placify:</span>
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                  Smarter Placements.
                </span>
                <span className="block text-purple-200 dark:text-purple-300 text-3xl md:text-4xl lg:text-5xl mt-2">
                  Sharper Talent.
                </span>
              </motion.h1>
              {/* Subtitle */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="text-lg md:text-l text-purple-100 dark:text-purple-200 leading-relaxed max-w-2xl lg:max-w-none"
              >
                Revolutionize campus placements with our AI-powered platform
                that streamlines 60-70% of recruitment processes. From automated
                resume screening to adaptive assessments, we bridge the gap
                between industry needs and candidate readiness.
              </motion.p>

              {/* Stats Row */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300 dark:text-yellow-400">
                    60-70%
                  </div>
                  <div className="text-purple-200 dark:text-purple-300">
                    Process Automation
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300 dark:text-green-400">
                    10x
                  </div>
                  <div className="text-purple-200 dark:text-purple-300">
                    Faster Screening
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300 dark:text-blue-400">
                    500+
                  </div>
                  <div className="text-purple-200 dark:text-purple-300">
                    Students per Day
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {/* Primary CTA Button */}
                <button
                  onClick={handleGetStarted}
                  className="group relative inline-flex items-center justify-center px-6 py-4 text-lg font-semibold text-purple-700 dark:text-purple-800 bg-white dark:bg-gray-100 rounded-2xl shadow-xl transition-all duration-200 overflow-hidden btn-hover"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>
                      {!loading && isAuthenticated
                        ? "Go to Dashboard"
                        : "Transform Your Placements"}
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </button>

                {/* Secondary CTA Button */}
                <button
                  onClick={() => {
                    document
                      .getElementById("works")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white/30 dark:border-white/40 rounded-2xl hover:bg-white/10 dark:hover:bg-white/20 hover:border-white/50 dark:hover:border-white/60 transition-all duration-200 backdrop-blur-sm hover-lift will-change-transform"
                >
                  <span className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Try Our New Resume Builder</span>
                  </span>
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-purple-200 dark:text-purple-300"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-300 dark:text-green-400" />
                  <span>AI-Powered Screening</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-300 dark:text-green-400" />
                  <span>Adaptive Assessments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-300 dark:text-green-400" />
                  <span>Real-time Analytics</span>
                </div>
              </motion.div>
            </motion.div>
            {/* Right Column - AI Image/Illustration */}
            <motion.div
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              {/* Main Image Container */}
              <div className="relative">
                {/* Glowing background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 dark:from-purple-500 dark:via-pink-400 dark:to-indigo-500 rounded-3xl blur-3xl opacity-30 dark:opacity-20"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {/* AI Generated Image Placeholder */}
                <div className="relative bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-white/30 shadow-2xl transition-all duration-200 hover:-translate-y-2 will-change-transform">
                  {/* Mock AI Interview Scene */}
                  <div className="aspect-square bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-indigo-900/40 rounded-2xl p-6 relative overflow-hidden">
                    {/* Floating AI Elements */}
                    <motion.div
                      className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 rounded-full flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Brain className="w-6 h-6 text-white" />
                    </motion.div>
                    {/* Interview Simulation Visualization */}
                    <div className="space-y-4">
                      {/* User Avatar */}
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-purple-200 dark:bg-purple-600 rounded-full mb-2"></div>
                          <div className="h-2 bg-purple-100 dark:bg-purple-700 rounded-full w-3/4"></div>
                        </div>
                      </div>

                      {/* AI Analysis Bars */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-300">
                          <span>Technical Skills</span>
                          <span>92%</span>
                        </div>
                        <motion.div
                          className="h-2 bg-purple-100 dark:bg-purple-800 rounded-full overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 2 }}
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "92%" }}
                            transition={{ duration: 2, delay: 2.5 }}
                          />
                        </motion.div>

                        <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-300">
                          <span>Communication</span>
                          <span>88%</span>
                        </div>
                        <motion.div
                          className="h-2 bg-purple-100 dark:bg-purple-800 rounded-full overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 2.2 }}
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 dark:from-blue-500 dark:to-cyan-600 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "88%" }}
                            transition={{ duration: 2, delay: 2.7 }}
                          />
                        </motion.div>

                        <div className="flex items-center justify-between text-xs text-purple-700 dark:text-purple-300">
                          <span>Industry Readiness</span>
                          <span>95%</span>
                        </div>
                        <motion.div
                          className="h-2 bg-purple-100 dark:bg-purple-800 rounded-full overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 2.4 }}
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-500 dark:from-purple-500 dark:to-pink-600 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "95%" }}
                            transition={{ duration: 2, delay: 2.9 }}
                          />
                        </motion.div>
                      </div>

                      {/* Success Indicator */}
                      <motion.div
                        className="mt-6 p-3 bg-green-100 dark:bg-green-900/40 rounded-xl border-2 border-green-200 dark:border-green-700"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 3.5 }}
                      >
                        <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            Interview Success!
                          </span>
                        </div>
                      </motion.div>
                    </div>
                    {/* Floating particles */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-300 dark:bg-purple-500 rounded-full"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [-20, 20, -20],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>

                  {/* Tech Stack Icons */}
                  <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded"></div>
                      <div className="w-6 h-6 bg-green-500 dark:bg-green-400 rounded"></div>
                      <div className="w-6 h-6 bg-purple-500 dark:bg-purple-400 rounded"></div>
                    </div>
                  </div>

                  <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg">
                    <Zap className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Placify?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of interview preparation with cutting-edge
              AI technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl transition-all duration-200 
                           hover:bg-white dark:hover:bg-gray-750 border border-transparent hover:border-purple-100 
                           dark:hover:border-purple-700 hover:shadow-lg dark:hover:shadow-2xl card-hover"
              >
                <div className="text-purple-600 dark:text-purple-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How it works? */}
      <motion.section
        id="works"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-gray-100 dark:bg-gray-800 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A smarter path to placements in just three simple stages.
            </p>
          </motion.div>

          <div className="relative flex items-center justify-between gap-6 md:gap-12 px-4 sm:px-8 lg:px-16">
            {[
              {
                icon: (
                  <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                ),
                title: "Sign Up",
                description:
                  "Create your profile and select your placement goals.",
              },
              {
                icon: (
                  <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                ),
                title: "Practice",
                description: "AI-driven mock interviews and custom challenges.",
              },
              {
                icon: (
                  <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                ),
                title: "Get Placed",
                description: "Use feedback to improve and ace real interviews.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center text-center w-1/3"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-700 shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                  {step.icon}
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < 2 && (
                  <div className="absolute top-7 right-[-50%] w-full h-1 bg-purple-300 dark:bg-purple-600 z-0 hidden md:block"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-850 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Unlock Your Full Potential
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of students who have successfully landed their
                dream jobs with Placify's AI-powered interview coaching.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-lg text-gray-700 dark:text-gray-200">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0, scale: 0.9 }}
              whileInView={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:scale-105 will-change-transform"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2"
                >
                  85%
                </motion.div>
                <div className="text-gray-600 dark:text-gray-300 mb-6">
                  Success Rate
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2"
                >
                  10K+
                </motion.div>
                <div className="text-gray-600 dark:text-gray-300 mb-6">
                  Students Placed
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-4xl font-bold text-emerald-500 dark:text-emerald-400 mb-2"
                >
                  500+
                </motion.div>
                <div className="text-gray-600 dark:text-gray-300">
                  Partner Companies
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Ready to Ace Your Next Interview?
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            Start your journey today and join the ranks of successful
            professionals
          </motion.p>
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="bg-purple-600 dark:bg-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg 
                       hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-200 
                       shadow-xl hover:shadow-2xl inline-flex items-center space-x-2 btn-hover"
          >
            <span>
              {!loading && isAuthenticated
                ? "Go to Dashboard"
                : "Start Free Trial"}
            </span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.section>

      <div style={{ position: "fixed", right: "20px", bottom: "15rem" }}>
        <Chatbot />
      </div>
    </div>
  );
};

export default LandingPage;
