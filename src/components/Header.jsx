// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Menu, X, Home, LogIn, UserPlus, Phone, Mail } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for dynamic navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navigationLinks = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Register", href: "/register", icon: <UserPlus className="w-4 h-4" /> },
    { name: "Login", href: "/auth", icon: <LogIn className="w-4 h-4" /> },
  ];

  const isActive = (path) => {
    if (path === "/register") {
      return location.pathname.startsWith("/register");
    }
    return location.pathname === path;
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Placify
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center space-x-1"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                  isActive(link.href)
                    ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </motion.div>

          {/* Right Side - Theme Toggle & Mobile Menu */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center space-x-4"
          >
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
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
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-4 space-y-2">
              {navigationLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;