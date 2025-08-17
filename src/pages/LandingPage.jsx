import React, { useState, useEffect } from "react";
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

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Enhanced Navbar */}
      <AnimatePresence>
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled
              ? "backdrop-blur-xs bg-white/80 dark:bg-gray-900/80 shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
              : "backdrop-blur-xs bg-purple-600/20 dark:bg-purple-800/20 border-b border-purple-300/30 dark:border-purple-600/30"
          }`}
          style={{
            backdropFilter: isScrolled ? "blur(12px)" : "blur(8px)",
            WebkitBackdropFilter: isScrolled ? "blur(12px)" : "blur(8px)",
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
                {/* Added onClick to scroll to top when Brain icon is clicked */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg cursor-pointer"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  <Brain className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </motion.div>
                <span
                  className={`text-2xl lg:text-3xl font-bold transition-all duration-500 ${
                    isScrolled
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent"
                      : "text-white"
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
                {/* Sign In Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-6 py-2.5 font-medium rounded-xl transition-all duration-300 hover-lift will-change-transform
                           ${
                             isScrolled
                               ? "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 before:absolute before:inset-0 before:rounded-xl before:bg-gray-100 dark:before:bg-gray-800 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                               : "text-white/90 hover:text-white before:absolute before:inset-0 before:rounded-xl before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                           }`}
                  onClick={() => navigate("/auth")}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </span>
                </motion.button>

                {/* Get Started Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-6 py-2.5 font-semibold rounded-xl shadow-lg transition-all duration-300 overflow-hidden group btn-hover ${
                    isScrolled
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-white text-purple-600"
                  }`}
                  onClick={() => navigate("/register")}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Get Started</span>
                  </span>
                  {isScrolled && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700"
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
                    : "bg-white/10 hover:bg-white/20"
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
                            : "text-white"
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
                            : "text-white"
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
                      ? "border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90"
                      : "border-purple-300/30 dark:border-purple-600/30 bg-purple-600/20 dark:bg-purple-800/20"
                  }`}
                  style={{
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <div className="py-4 space-y-3">
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
                          : "text-white/90 hover:bg-white/10"
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span>Sign In</span>
                    </motion.button>

                    <motion.button
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate("/register");
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 will-change-transform hover-lift ${
                        isScrolled
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                          : "bg-white text-purple-600"
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                      <span>Get Started</span>
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
                            : "text-white/90"
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
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

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
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium"
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
                <span className="block bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
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
                  <div className="text-2xl font-bold text-yellow-400">
                    60-70%
                  </div>
                  <div className="text-purple-200">Process Automation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">10x</div>
                  <div className="text-purple-200">Faster Screening</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300">500+</div>
                  <div className="text-purple-200">Students per Day</div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                {/* Primary CTA Button - Optimized for performance */}
                <button
                  onClick={() => navigate("/resume")}
                  className="group relative inline-flex items-center justify-center px-6 py-4 text-lg font-semibold text-purple-700 bg-white rounded-2xl shadow-xl transition-all duration-200 overflow-hidden btn-hover"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Transform Your Placements</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </button>

                {/* Secondary CTA Button - Optimized for performance */}
                <button
                  onClick={() => {
                    document
                      .getElementById("works")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-200 backdrop-blur-sm hover-lift will-change-transform"
                >
                  <span className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>See How It Works</span>
                  </span>
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-purple-200"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>AI-Powered Screening</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span>Adaptive Assessments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
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
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-300 to-black rounded-3xl blur-3xl opacity-30"
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
                <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-200 hover:-translate-y-2 will-change-transform">
                  {/* Mock AI Interview Scene */}
                  <div className="aspect-square bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 rounded-2xl p-6 relative overflow-hidden">
                    {/* Floating AI Elements */}
                    <motion.div
                      className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center"
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
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-purple-200 rounded-full mb-2"></div>
                          <div className="h-2 bg-purple-100 rounded-full w-3/4"></div>
                        </div>
                      </div>

                      {/* AI Analysis Bars */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-purple-700">
                          <span>Technical Skills</span>
                          <span>92%</span>
                        </div>
                        <motion.div
                          className="h-2 bg-purple-100 rounded-full overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 2 }}
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "92%" }}
                            transition={{ duration: 2, delay: 2.5 }}
                          />
                        </motion.div>

                        <div className="flex items-center justify-between text-xs text-purple-700">
                          <span>Communication</span>
                          <span>88%</span>
                        </div>
                        <motion.div
                          className="h-2 bg-purple-100 rounded-full overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 2.2 }}
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "88%" }}
                            transition={{ duration: 2, delay: 2.7 }}
                          />
                        </motion.div>

                        <div className="flex items-center justify-between text-xs text-purple-700">
                          <span>Industry Readiness</span>
                          <span>95%</span>
                        </div>
                        <motion.div
                          className="h-2 bg-purple-100 rounded-full overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, delay: 2.4 }}
                        >
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "95%" }}
                            transition={{ duration: 2, delay: 2.9 }}
                          />
                        </motion.div>
                      </div>

                      {/* Success Indicator */}
                      <motion.div
                        className="mt-6 p-3 bg-green-100 rounded-xl border-2 border-green-200"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 3.5 }}
                      >
                        <div className="flex items-center space-x-2 text-green-700">
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
                        className="absolute w-2 h-2 bg-purple-300 rounded-full"
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
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg">
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded"></div>
                      <div className="w-6 h-6 bg-green-500 rounded"></div>
                      <div className="w-6 h-6 bg-purple-500 rounded"></div>
                    </div>
                  </div>

                  <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg">
                    <Zap className="w-6 h-6 text-yellow-500" />
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
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl transition-all duration-300 
           hover:bg-purple-100 dark:hover:bg-gray-700 
           border border-transparent hover:border-purple-300 
           dark:hover:border-purple-400 card-hover"

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
className="py-20 bg-gradient-to-tr from-[#B566FF] to-[#FFFFFF] dark:from-gray-900 dark:to-gray-900"
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
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-lg z-10">
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
        className="py-20 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
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
className="p-8 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 will-change-transform 
  bg-gradient-to-br from-[#EFDDFF] to-[#FFFFFF] 
  dark:from-gray-900 dark:to-gray-900 
  border border-transparent hover:border-[#B566FF] 
  hover:shadow-[0_0_25px_#B566FF]/70"
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
        className="py-20 bg-gradient-to-br from-[#B566FF] to-[#FFFFFF] dark:from-black dark:to-black text-white transition-colors duration-300"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl dark:text-white text-black font-bold mb-6"
          >
            Ready to Ace Your Next Interview?
          </motion.h2>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-700 dark:text-gray-400 mb-8"
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
            onClick={() => navigate("/register")}
            className="bg-purple-600 dark:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg 
                       hover:bg-purple-700 dark:hover:bg-purple-800 transition-all duration-200 
                       shadow-xl hover:shadow-2xl inline-flex items-center space-x-2 btn-hover"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.section>
      <Chatbot />
    </div>
  );
};

export default LandingPage;
