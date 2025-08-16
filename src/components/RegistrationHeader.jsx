import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft, Clock, Users2, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const RegistrationHeader = ({ title, subtitle, icon, color = "purple", tagline, userType }) => {
  const navigate = useNavigate();

  const colorVariants = {
    purple: "from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500",
    blue: "from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500", 
    green: "from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500",
    orange: "from-orange-600 to-red-600 dark:from-orange-500 dark:to-red-500"
  };

  const handleBackNavigation = () => {
    // Navigate to role selection page if coming from registration flow
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/register');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r ${colorVariants[color]} text-white py-20 px-4 relative overflow-hidden transition-all duration-300`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-15">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white dark:bg-gray-200"></div>
        <div className="absolute top-20 -left-10 w-32 h-32 rounded-full bg-white dark:bg-gray-200"></div>
        <div className="absolute bottom-10 right-20 w-24 h-24 rounded-full bg-white dark:bg-gray-200"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button - Enhanced */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={handleBackNavigation}
          className="mb-8 flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-200 group bg-white/10 dark:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 dark:hover:bg-white/30"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back</span>
        </motion.button>

        {/* Header Content */}
        <div className="text-center">
          {/* Logo and Brand */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center space-x-3 mb-6"
          >
            <Brain className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">Placify</span>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-20 h-20 bg-white/20 dark:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center">
              {icon}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            {title}
          </motion.h1>

          {/* Tagline */}
          {tagline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex items-center justify-center space-x-2 mb-4 text-white/90"
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{tagline}</span>
            </motion.div>
          )}

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-6"
          >
            {subtitle}
          </motion.p>

          {/* Login CTA for existing users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mb-8"
          >
            <Link
              to="/auth"
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 bg-white/10 dark:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 dark:hover:bg-white/30 text-sm font-medium"
            >
              <LogIn className="w-4 h-4" />
              <span>Already have an account? Login here</span>
            </Link>
          </motion.div>

          {/* Features or Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4 text-sm"
          >
            <div className="bg-white/20 dark:bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>AI-Powered Assessment</span>
            </div>
            <div className="bg-white/20 dark:bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Real-time Feedback</span>
            </div>
            <div className="bg-white/20 dark:bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
              <Users2 className="w-4 h-4" />
              <span>Smart Analytics</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegistrationHeader;