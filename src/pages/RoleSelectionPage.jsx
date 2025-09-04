import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap,
  School,
  Briefcase,
  Building,
  ArrowRight,
  CheckCircle,
  Users,
  Brain,
  Sun,
  Moon,
  Star,
  Sparkles,
  Zap,
  User,
  Target,
  Menu,
  X,
} from "lucide-react";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const RoleSelectionPage = () => {
  const [isDark, setIsDark] = useState(false);
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
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage?.getItem("theme");
    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    )?.matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

   useEffect(() => {
     window.scrollTo({ top: 0, behavior: "smooth" });
   }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage?.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage?.setItem("theme", "light");
    }
  };

  const handleRoleNavigation = (route, e) => {
    // Prevent event bubbling to avoid double navigation
    e.stopPropagation();
    navigate(route);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const roles = [
    {
      title: "Student",
      subtitle: "Looking for your dream job",
      description:
        "Practice interviews, get AI feedback, and land your perfect placement",
      icon: <GraduationCap className="w-8 h-8" />,
      route: "/register/student",
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      bgGradient:
        "from-blue-50/90 to-cyan-50/90 dark:from-blue-900/40 dark:to-cyan-900/40",
      iconBg:
        "bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700",
      textColor: "text-blue-600 dark:text-blue-300",
      borderColor: "border-blue-200/60 dark:border-blue-700/60",
      hoverBorder: "hover:border-blue-300/80 dark:hover:border-blue-500/80",
      glowColor: "shadow-blue-500/25 dark:shadow-blue-400/25",
      features: [
        "AI Interview Practice",
        "Skill Assessment",
        "Performance Analytics",
        "Career Guidance",
      ],
    },
    {
      title: "College/University",
      subtitle: "Enhance placement success",
      description:
        "Streamline campus placements with AI-powered recruitment automation",
      icon: <School className="w-8 h-8" />,
      route: "/register/institution",
      gradient: "from-emerald-500 via-green-600 to-teal-500",
      bgGradient:
        "from-emerald-50/90 to-teal-50/90 dark:from-emerald-900/40 dark:to-teal-900/40",
      iconBg:
        "bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700",
      textColor: "text-emerald-600 dark:text-emerald-300",
      borderColor: "border-emerald-200/60 dark:border-emerald-700/60",
      hoverBorder:
        "hover:border-emerald-300/80 dark:hover:border-emerald-500/80",
      glowColor: "shadow-emerald-500/25 dark:shadow-emerald-400/25",
      features: [
        "Automated Screening",
        "Bulk Assessments",
        "Placement Analytics",
        "Industry Partnerships",
      ],
    },
    {
      title: "HR Professional",
      subtitle: "Recruit top talent efficiently",
      description:
        "Find the best candidates faster with AI-driven recruitment tools",
      icon: <Briefcase className="w-8 h-8" />,
      route: "/register/employee",
      gradient: "from-purple-500 via-violet-600 to-pink-500",
      bgGradient:
        "from-purple-50/90 to-pink-50/90 dark:from-purple-900/40 dark:to-pink-900/40",
      iconBg:
        "bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700",
      textColor: "text-purple-600 dark:text-purple-300",
      borderColor: "border-purple-200/60 dark:border-purple-700/60",
      hoverBorder: "hover:border-purple-300/80 dark:hover:border-purple-500/80",
      glowColor: "shadow-purple-500/25 dark:shadow-purple-400/25",
      features: [
        "Smart Candidate Matching",
        "Video Interview Analysis",
        "Skill Verification",
        "Hiring Analytics",
      ],
    },
    {
      title: "Company",
      subtitle: "Scale your hiring process",
      description:
        "Transform recruitment with enterprise-grade AI assessment platform",
      icon: <Building className="w-8 h-8" />,
      route: "/register/company",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      bgGradient:
        "from-orange-50/90 to-red-50/90 dark:from-orange-900/40 dark:to-red-900/40",
      iconBg:
        "bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700",
      textColor: "text-orange-600 dark:text-orange-300",
      borderColor: "border-orange-200/60 dark:border-orange-700/60",
      hoverBorder: "hover:border-orange-300/80 dark:hover:border-orange-500/80",
      glowColor: "shadow-orange-500/25 dark:shadow-orange-400/25",
      features: [
        "Enterprise Solutions",
        "Custom Assessments",
        "Team Management",
        "Advanced Reporting",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/50 transition-all duration-500">
      {/* Navbar */}
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
                  onClick={() => navigate("/")}
                >
                  <Brain className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </motion.div>
                <span
                  onClick={() => navigate("/")}
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
                  <button
                    onClick={toggleTheme}
                    className="group relative p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative w-6 h-6">
                      <Sun
                        className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-300 ${
                          isDark
                            ? "opacity-0 rotate-90 scale-0"
                            : "opacity-100 rotate-0 scale-100"
                        }`}
                      />
                      <Moon
                        className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${
                          isDark
                            ? "opacity-100 rotate-0 scale-100"
                            : "opacity-0 -rotate-90 scale-0"
                        }`}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  </button>
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
                  exit={{ height: 0, opacity: 0, y: 20 }}
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
                        transition={{
                          delay: 0.1,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
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
                      transition={{
                        delay: 0.2,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
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
                      transition={{
                        delay: 0.3,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
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
                      <button
                        onClick={toggleTheme}
                        className="group relative p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105"
                      >
                        <div className="relative w-6 h-6">
                          <Sun
                            className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-300 ${
                              isDark
                                ? "opacity-0 rotate-90 scale-0"
                                : "opacity-100 rotate-0 scale-100"
                            }`}
                          />
                          <Moon
                            className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${
                              isDark
                                ? "opacity-100 rotate-0 scale-100"
                                : "opacity-0 -rotate-90 scale-0"
                            }`}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      </AnimatePresence>

      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-pink-300/30 dark:from-purple-600/20 dark:to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 dark:from-blue-600/20 dark:to-cyan-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 dark:from-emerald-600/20 dark:to-teal-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Floating Sparkles */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-purple-400/60 dark:bg-purple-300/60 rounded-full animate-ping"></div>
        <div
          className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400/60 dark:bg-blue-300/60 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-400/60 dark:bg-pink-300/60 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pt-28">
        <div className="max-w-7xl w-full pt-10">
          {/* Header Section */}
          <div className="text-center mb-16 mt-8">
            {/* Logo/Brand */}
            <div
              className="flex items-center justify-center space-x-3 mb-8 cursor-pointer group"
              onClick={handleLogoClick}
            >
              <div className="relative p-4 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 dark:from-purple-400 dark:via-purple-500 dark:to-indigo-500 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Brain className="w-8 h-8 text-white" />
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
              </div>
              <div className="relative">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 dark:from-purple-300 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Placify
                </span>
                <Sparkles className="absolute -top-1 -right-6 w-4 h-4 text-purple-400 dark:text-purple-300 animate-pulse" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Choose Your Path to
              <span className="block mt-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                Success
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
              Join thousands who are revolutionizing recruitment with AI-powered
              assessments and placements. Your journey to success starts here.
            </p>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 text-sm">
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg px-4 py-3 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  10K+ Active Users
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg px-4 py-3 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  85% Success Rate
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg px-4 py-3 rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Building className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  500+ Companies
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-16">
            {roles.map((role, index) => (
              <div
                key={role.title}
                className={`relative group cursor-pointer backdrop-blur-lg rounded-3xl shadow-xl hover:${role.glowColor} hover:shadow-2xl transition-all duration-500 border ${role.borderColor} ${role.hoverBorder} overflow-hidden transform hover:-translate-y-3 hover:scale-[1.02] bg-gradient-to-br ${role.bgGradient}`}
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative p-6 lg:p-8">
                  {/* Enhanced Icon */}
                  <div
                    className={`${role.iconBg} text-white p-4 rounded-2xl mb-6 inline-flex shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    {role.icon}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                      {role.title}
                    </h3>
                    <p
                      className={`text-sm font-semibold ${role.textColor} mb-3`}
                    >
                      {role.subtitle}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  {/* Enhanced Features List */}
                  <div className="space-y-3 mb-8">
                    {role.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300"
                      >
                        <div className="relative">
                          <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                          <div className="absolute inset-0 bg-green-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        </div>
                        <span className="font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Registration Button */}
                  <div className="flex justify-center">
                    <button
                      className={`w-full bg-gradient-to-r ${role.gradient} text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2`}
                      onClick={(e) => handleRoleNavigation(role.route, e)}
                    >
                      <span>
                        Register as{" "}
                        {role.title === "College/University"
                          ? "Institution"
                          : role.title}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Enhanced Border Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300 pointer-events-none blur-sm`}
                />
              </div>
            ))}
          </div>

          {/* Enhanced Bottom CTA */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Not sure which option is right for you?
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center space-x-3 text-purple-600 dark:text-purple-400 hover:text-white dark:hover:text-white font-semibold transition-all duration-300 bg-white/70 dark:bg-gray-800/70 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 backdrop-blur-lg px-6 py-4 rounded-full border border-purple-200/50 dark:border-purple-700/50 hover:border-transparent shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 dark:hover:shadow-purple-400/25 hover:scale-105 group"
            >
              <span className="text-lg">Contact our team for guidance</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg -z-10"></div>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoleSelectionPage;
