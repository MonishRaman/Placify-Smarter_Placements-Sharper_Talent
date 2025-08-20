// src/components/ThemeToggle.jsx
import React from 'react';
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <motion.button
      onClick={() => setDarkMode(!darkMode)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md will-change-transform"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: darkMode ? 0 : 360,
          scale: darkMode ? 0.8 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="w-5 h-5"
      >
        {darkMode ? (
          <Moon className="w-5 h-5 text-blue-400" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
      </motion.div>

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-20 transition-opacity duration-200"
        style={{
          background: darkMode
            ? "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)",
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;