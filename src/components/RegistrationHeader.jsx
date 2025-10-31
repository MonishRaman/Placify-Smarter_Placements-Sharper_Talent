import React from "react";
import { motion } from "framer-motion";
import { Brain, ArrowLeft, Clock, Users2, LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const RegistrationHeader = ({
  title,
  subtitle,
  icon,
  color = "purple",
  tagline,
  userType,
}) => {
  const navigate = useNavigate();

  const lightColorVariants = {
    purple: "from-purple-600 to-indigo-600",
    blue: "from-blue-600 to-cyan-600",
    green: "from-green-600 to-emerald-600",
    orange: "from-orange-600 to-red-600",
  };

  const darkColorVariants = {
    purple: "dark:from-purple-800 dark:via-purple-900 dark:to-indigo-950",
    blue: "dark:from-blue-800 dark:via-cyan-900 dark:to-cyan-950",
    green: "dark:from-green-800 dark:via-emerald-900 dark:to-emerald-950",
    orange: "dark:from-orange-800 dark:via-red-900 dark:to-red-950",
  };

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/register");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className={`h-screen sticky top-0 flex flex-col justify-center items-center bg-gradient-to-br ${lightColorVariants[color]} ${darkColorVariants[color]} text-white px-8 relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/10 dark:bg-white/5 animate-pulse"></div>
        <div
          className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-white/15 dark:bg-white/8 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-10 w-32 h-32 rounded-full bg-white/20 dark:bg-white/10"></div>
        <div className="absolute inset-0 opacity-5 dark:opacity-3">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onClick={handleBackNavigation}
        className="absolute left-6 top-6 flex items-center space-x-2 text-white/90 hover:text-white transition-all duration-200 group bg-white/20 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 dark:hover:bg-black/30 shadow-lg hover:shadow-xl border border-white/20 dark:border-white/10"
        aria-label="Go back to previous page"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-medium text-sm">Back</span>
      </motion.button>

      <div className="max-w-xl relative z-10">
        {/* Logo and Brand */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            type: "spring",
            stiffness: 200,
          }}
          className="flex items-center space-x-3 mb-8"
        >
          <div className="p-2 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-xl border border-white/30 dark:border-white/10">
            <Brain className="w-8 h-8 text-white drop-shadow-sm" />
          </div>
          <span className="text-4xl font-bold text-white drop-shadow-sm">
            Placify
          </span>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            type: "spring",
            stiffness: 200,
          }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-white/25 dark:bg-black/25 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/30 dark:border-white/10">
            <div className="text-white drop-shadow-sm">{icon}</div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-sm leading-tight"
        >
          {title}
        </motion.h1>

        {/* Tagline */}
        {tagline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex items-center space-x-2 mb-6 text-white/95"
          >
            <div className="p-1 bg-white/20 dark:bg-black/20 rounded-full">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-sm md:text-base font-medium drop-shadow-sm">
              {tagline}
            </span>
          </motion.div>
        )}

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-base md:text-lg text-white/95 leading-relaxed mb-8 drop-shadow-sm"
        >
          {subtitle}
        </motion.p>

        {/* Login CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mb-8"
        >
          <Link
            to="/auth"
            className="inline-flex items-center space-x-2 text-white/90 hover:text-white transition-all duration-200 bg-white/20 dark:bg-black/20 backdrop-blur-sm px-5 py-2.5 rounded-full hover:bg-white/30 dark:hover:bg-black/30 text-sm font-medium shadow-lg hover:shadow-xl border border-white/20 dark:border-white/10 hover:scale-105 transform"
          >
            <LogIn className="w-4 h-4" />
            <span>Already have an account? Login</span>
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col gap-3 text-sm"
        >
          {[
            { icon: Brain, text: "AI-Powered Assessment" },
            { icon: Clock, text: "Real-time Feedback" },
            { icon: Users2, text: "Smart Analytics" },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              className="bg-white/15 dark:bg-black/15 backdrop-blur-md px-4 py-3 rounded-xl flex items-center space-x-3 shadow-lg border border-white/20 dark:border-white/10 hover:bg-white/25 dark:hover:bg-black/25 transition-all duration-200 hover:translate-x-1 transform"
            >
              <div className="p-1.5 bg-white/20 dark:bg-black/20 rounded-lg">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-white drop-shadow-sm">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegistrationHeader;
