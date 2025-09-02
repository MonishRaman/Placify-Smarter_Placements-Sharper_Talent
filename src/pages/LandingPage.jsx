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
      case "candidate":
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
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
            isScrolled
              ? "backdrop-blur-xl bg-white/80 dark:bg-gray-900/85 shadow-xl border-b border-gray-200/60 dark:border-gray-700/60"
              : "backdrop-blur-lg bg-purple-600/15 dark:bg-purple-800/25 border-b border-purple-300/20 dark:border-purple-600/30"
          }`}
          style={{
            backdropFilter: isScrolled ? "blur(20px)" : "blur(16px)",
            WebkitBackdropFilter: isScrolled ? "blur(20px)" : "blur(16px)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo Section */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-xl cursor-pointer backdrop-blur-sm"
                  onClick={() => (window.location.href = "/")}
                >
                  <Brain className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </motion.div>
                <span
                  onClick={() => (window.location.href = "/")}
                  className={`text-2xl lg:text-3xl font-bold transition-all duration-700 ease-in-out cursor-pointer ${
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
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="hidden lg:flex items-center space-x-6"
              >
                {/* Sign In Button - Only show if not authenticated */}
                {!loading && !isAuthenticated && (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`relative px-6 py-2.5 font-medium rounded-xl transition-all duration-500 ease-in-out hover-lift will-change-transform backdrop-blur-sm
                             ${
                               isScrolled
                                 ? "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 before:absolute before:inset-0 before:rounded-xl before:bg-gray-100/70 dark:before:bg-gray-800/70 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:backdrop-blur-md"
                                 : "text-white/90 dark:text-gray-100/90 hover:text-white dark:hover:text-white before:absolute before:inset-0 before:rounded-xl before:bg-white/15 dark:before:bg-white/25 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:backdrop-blur-md"
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
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`relative px-6 py-2.5 font-semibold rounded-xl shadow-xl transition-all duration-500 ease-in-out overflow-hidden group btn-hover backdrop-blur-md ${
                    isScrolled
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white"
                      : "bg-white/90 dark:bg-gray-100/90 text-purple-600 dark:text-purple-700 backdrop-blur-xl"
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
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  )}
                </motion.button>

                {/* Theme Toggle */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ThemeToggle />
                </motion.div>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-all duration-500 ease-in-out will-change-transform hover-lift backdrop-blur-md ${
                  isScrolled
                    ? "bg-gray-100/70 dark:bg-gray-800/70 hover:bg-gray-200/70 dark:hover:bg-gray-700/70"
                    : "bg-white/15 dark:bg-white/25 hover:bg-white/25 dark:hover:bg-white/35"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <X
                        className={`w-5 h-5 transition-colors duration-300 ${
                          isScrolled
                            ? "text-gray-600 dark:text-gray-300"
                            : "text-white dark:text-gray-100"
                        }`}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Menu
                        className={`w-5 h-5 transition-colors duration-300 ${
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
                  initial={{ height: 0, opacity: 0, y: -20 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className={`lg:hidden overflow-hidden border-t transition-colors duration-500 ${
                    isScrolled
                      ? "border-gray-200/60 dark:border-gray-700/60 bg-white/85 dark:bg-gray-900/85"
                      : "border-purple-300/25 dark:border-purple-600/35 bg-purple-600/15 dark:bg-purple-800/25"
                  }`}
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <div className="py-4 space-y-3">
                    {/* Sign In Button - Only show if not authenticated */}
                    {!loading && !isAuthenticated && (
                      <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                        whileHover={{ x: 4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          navigate("/auth");
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-500 ease-in-out flex items-center space-x-3 will-change-transform hover-lift backdrop-blur-sm ${
                          isScrolled
                            ? "text-gray-700 dark:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                            : "text-white/90 dark:text-gray-100/90 hover:bg-white/15 dark:hover:bg-white/25"
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <span>Sign In</span>
                      </motion.button>
                    )}

                    <motion.button
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                      whileHover={{ x: 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleGetStarted();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-500 ease-in-out flex items-center space-x-3 will-change-transform hover-lift backdrop-blur-md ${
                        isScrolled
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white"
                          : "bg-white/90 dark:bg-gray-100/90 text-purple-600 dark:text-purple-700"
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
                      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <span
                        className={`transition-colors duration-500 ${
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
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="relative min-h-screen bg-gradient-to-br from-black via-purple-700 to-black dark:from-purple-800 dark:via-purple-900 dark:to-indigo-950 text-white transition-colors duration-300 pt-24 lg:pt-28 overflow-hidden"
      >
        {/* Enhanced Background Pattern/Decoration */}
        <div className="absolute inset-0 opacity-15 dark:opacity-8">
          <motion.div 
            className="absolute top-20 left-10 w-96 h-96 bg-white dark:bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute top-40 right-10 w-96 h-96 bg-yellow-200 dark:bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div 
            className="absolute bottom-20 left-20 w-96 h-96 bg-pink-200 dark:bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />
        </div>

        {/* Enhanced Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-8 dark:opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15 pb-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
            {/* Left Column - Text Content */}
            <motion.div
              className="text-center lg:text-left space-y-8"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            >
              {/* Badge */}
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 dark:bg-white/25 backdrop-blur-xl border border-white/25 dark:border-white/35 text-sm font-medium shadow-xl"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI-Powered Recruitment & Skill Assessment
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                <motion.span 
                  className="block"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                >
                  Placify:
                </motion.span>
                <motion.span 
                  className="block bg-gradient-to-r from-yellow-300 to-orange-300 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.3 }}
                >
                  Smarter Placements.
                </motion.span>
                <motion.span 
                  className="block text-purple-200 dark:text-purple-300 text-3xl md:text-4xl lg:text-5xl mt-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                >
                  Sharper Talent.
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.7, ease: "easeOut" }}
                className="text-lg md:text-l text-purple-100 dark:text-purple-200 leading-relaxed max-w-2xl lg:max-w-none backdrop-blur-sm"
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
                transition={{ duration: 0.8, delay: 1.9, ease: "easeOut" }}
                className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm"
              >
                {[
                  { value: "60-70%", label: "Process Automation", color: "yellow" },
                  { value: "10x", label: "Faster Screening", color: "green" },
                  { value: "500+", label: "Students per Day", color: "blue" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center backdrop-blur-sm bg-white/5 dark:bg-white/10 rounded-lg p-3"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2.1 + index * 0.1 }}
                  >
                    <div className={`text-2xl font-bold ${
                      stat.color === 'yellow' ? 'text-yellow-300 dark:text-yellow-400' :
                      stat.color === 'green' ? 'text-green-300 dark:text-green-400' :
                      'text-blue-300 dark:text-blue-400'
                    }`}>
                      {stat.value}
                    </div>
                    <div className="text-purple-200 dark:text-purple-300">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.5, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {/* Primary CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  onClick={handleGetStarted}
                  className="group relative inline-flex items-center justify-center px-6 py-4 text-lg font-semibold text-purple-700 dark:text-purple-800 bg-white/95 dark:bg-gray-100/95 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden btn-hover backdrop-blur-xl"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>
                      {!loading && isAuthenticated
                        ? "Go to Dashboard"
                        : "Transform Your Placements"}
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </motion.button>

                {/* Secondary CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  onClick={() => {
                    document
                      .getElementById("works")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white/40 dark:border-white/50 rounded-2xl hover:bg-white/15 dark:hover:bg-white/25 hover:border-white/60 dark:hover:border-white/70 transition-all duration-300 backdrop-blur-xl hover-lift will-change-transform"
                >
                  <span className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Try Our New Resume Builder</span>
                  </span>
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.8, ease: "easeOut" }}
                className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-purple-200 dark:text-purple-300"
              >
                {[
                  "AI-Powered Screening",
                  "Adaptive Assessments", 
                  "Real-time Analytics"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 backdrop-blur-sm bg-white/5 dark:bg-white/10 rounded-full px-3 py-1"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 3 + index * 0.1 }}
                  >
                    <CheckCircle className="w-4 h-4 text-green-300 dark:text-green-400" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - AI Image/Illustration */}
            <motion.div
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            >
              {/* Main Image Container */}
              <div className="relative">
                {/* Enhanced glowing background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 dark:from-purple-500 dark:via-pink-400 dark:to-indigo-500 rounded-3xl blur-3xl opacity-40 dark:opacity-25"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* AI Generated Image Placeholder */}
                <motion.div 
                  className="relative bg-gradient-to-br from-white/25 to-white/10 dark:from-white/15 dark:to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/30 dark:border-white/40 shadow-2xl transition-all duration-500 hover:-translate-y-3 will-change-transform"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {/* Mock AI Interview Scene */}
                  <div className="aspect-square bg-gradient-to-br from-purple-100/80 via-blue-50/80 to-indigo-100/80 dark:from-purple-900/50 dark:via-blue-900/50 dark:to-indigo-900/50 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
                    {/* Floating AI Elements */}
                    <motion.div
                      className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm"
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
                      <motion.div 
                        className="flex items-center space-x-3"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 2 }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <motion.div 
                            className="h-3 bg-purple-200/80 dark:bg-purple-600/80 rounded-full mb-2 backdrop-blur-sm"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, delay: 2.2 }}
                          />
                          <motion.div 
                            className="h-2 bg-purple-100/80 dark:bg-purple-700/80 rounded-full w-3/4 backdrop-blur-sm"
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1.2, delay: 2.5 }}
                          />
                        </div>
                      </motion.div>

                      {/* AI Analysis Bars */}
                      <div className="space-y-3">
                        {[
                          { label: "Technical Skills", percentage: 92, color: "green" },
                          { label: "Communication", percentage: 88, color: "blue" },
                          { label: "Industry Readiness", percentage: 95, color: "purple" }
                        ].map((skill, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between text-xs text-purple-700/90 dark:text-purple-300/90 mb-1">
                              <span className="font-medium">{skill.label}</span>
                              <span className="font-bold">{skill.percentage}%</span>
                            </div>
                            <motion.div
                              className="h-2 bg-purple-100/60 dark:bg-purple-800/60 rounded-full overflow-hidden backdrop-blur-sm"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1, delay: 2.5 + index * 0.2 }}
                            >
                              <motion.div
                                className={`h-full rounded-full ${
                                  skill.color === 'green' ? 'bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600' :
                                  skill.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 dark:from-blue-500 dark:to-cyan-600' :
                                  'bg-gradient-to-r from-purple-400 to-pink-500 dark:from-purple-500 dark:to-pink-600'
                                }`}
                                initial={{ width: "0%" }}
                                animate={{ width: `${skill.percentage}%` }}
                                transition={{ duration: 1.5, delay: 3 + index * 0.2, ease: "easeOut" }}
                              />
                            </motion.div>
                          </div>
                        ))}
                      </div>

                      {/* Success Indicator */}
                      <motion.div
                        className="mt-6 p-3 bg-green-100/80 dark:bg-green-900/50 rounded-xl border-2 border-green-200/80 dark:border-green-700/80 backdrop-blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 4.5, ease: "easeOut" }}
                      >
                        <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-semibold">
                            Interview Success!
                          </span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Enhanced floating particles */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-300/60 dark:bg-purple-500/60 rounded-full backdrop-blur-sm"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [-20, 20, -20],
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 4 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 3,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>

                  {/* Tech Stack Icons */}
                  <motion.div 
                    className="absolute -bottom-4 -left-4 bg-white/90 dark:bg-gray-800/90 rounded-xl p-3 shadow-xl backdrop-blur-xl"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 2 }}
                  >
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-blue-500 dark:bg-blue-400 rounded"></div>
                      <div className="w-6 h-6 bg-green-500 dark:bg-green-400 rounded"></div>
                      <div className="w-6 h-6 bg-purple-500 dark:bg-purple-400 rounded"></div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="absolute -top-4 -right-4 bg-white/90 dark:bg-gray-800/90 rounded-xl p-3 shadow-xl backdrop-blur-xl"
                    initial={{ scale: 0, rotate: 10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 2.2 }}
                  >
                    <Zap className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                  </motion.div>
                </motion.div>
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
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
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
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                className="bg-gray-50/80 dark:bg-gray-800/80 p-8 rounded-2xl transition-all duration-500 
                           hover:bg-white dark:hover:bg-gray-750 border border-transparent hover:border-purple-100 
                           dark:hover:border-purple-700 hover:shadow-xl dark:hover:shadow-2xl card-hover backdrop-blur-sm"
              >
                <motion.div 
                  className="text-purple-600 dark:text-purple-400 mb-4"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
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
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-gray-100/80 dark:bg-gray-800/80 transition-colors duration-300 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
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
                icon: <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
                title: "Sign Up",
                description: "Create your profile and select your placement goals.",
              },
              {
                icon: <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
                title: "Practice",
                description: "AI-driven mock interviews and custom challenges.",
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
                title: "Get Placed",
                description: "Use feedback to improve and ace real interviews.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative flex flex-col items-center text-center w-1/3"
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.3,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 dark:bg-gray-700/90 shadow-xl z-10 border border-gray-200/80 dark:border-gray-600/80 backdrop-blur-xl"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {step.icon}
                </motion.div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {step.description}
                  </p>
                </div>

                {/* Enhanced Connector Line */}
                {index < 2 && (
                  <motion.div 
                    className="absolute top-7 right-[-50%] w-full h-1 bg-gradient-to-r from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-500 z-0 hidden md:block rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: index * 0.3 + 0.5 }}
                    viewport={{ once: true }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-gray-900/80 dark:to-gray-850/80 transition-colors duration-300 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
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
                    initial={{ x: -30, opacity: 0, scale: 0.95 }}
                    whileInView={{ x: 0, opacity: 1, scale: 1 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-lg text-gray-700 dark:text-gray-200 font-medium">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0.9 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 transition-all duration-500 will-change-transform backdrop-blur-xl"
            >
              <div className="text-center">
                {[
                  { value: "85%", label: "Success Rate", color: "purple" },
                  { value: "10K+", label: "Students Placed", color: "indigo" },
                  { value: "500+", label: "Partner Companies", color: "emerald" }
                ].map((stat, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.2, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className={`text-4xl font-bold mb-2 ${
                        stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                        stat.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                        'text-emerald-500 dark:text-emerald-400'
                      }`}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-white/80 dark:bg-gray-900/80 transition-colors duration-300 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Ready to Ace Your Next Interview?
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            Start your journey today and join the ranks of successful
            professionals
          </motion.p>
          <motion.button
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true }}
            onClick={handleGetStarted}
            className="bg-purple-600 dark:bg-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg 
                       hover:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-500 
                       shadow-2xl hover:shadow-purple-500/25 dark:hover:shadow-purple-400/25 inline-flex items-center space-x-2 btn-hover backdrop-blur-sm"
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
