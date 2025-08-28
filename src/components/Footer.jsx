import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  ArrowUp,
  Users,
  Target,
  MessageSquare,
  Mail,
  Github,
  Linkedin,
  X,
  ExternalLink,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show back to top button when scrolling
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigationLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Practice Interview", href: "/interview" },
    { name: "Register", href: "/register" },
    { name: "Login", href: "/auth" },
  ];

  const userRoles = [
    { name: "For Students", href: "/register/student" },
    { name: "For Companies", href: "/register/company" },
    { name: "For Institutions", href: "/register/institution" },
    { name: "For Employees", href: "/register/employee" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com/MonishRaman/Placify-Smarter_Placements-Sharper_Talent",
      color: "hover:text-gray-800 dark:hover:text-gray-200",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://www.linkedin.com/in/monishr608/",
      color: "hover:text-blue-600",
    },
    {
      name: "X",
      icon: <X className="w-5 h-5" />,
      href: "https://x.com/Monishr_608",
      color: "hover:text-gray-800 dark:hover:text-gray-200",
    },
  ];

  return (
    <>
      <footer className="bg-gradient-to-t from-purple-300 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* About Placify Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-3">
                <Brain className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Placify
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm leading-relaxed max-w-md">
                Empowering careers through AI-powered interview preparation. We
                help students, professionals, and organizations achieve
                placement success with personalized feedback and realistic
                interview experiences.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>Smarter Placements</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Sharper Talent</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Roles */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Join As
              </h3>
              <ul className="space-y-2">
                {userRoles.map((role) => (
                  <li key={role.name}>
                    <Link
                      to={role.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 text-sm flex items-center group"
                    >
                      <span>{role.name}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Social Section */}
          <div className="mt-6 pt-6 border-t border-purple-400 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            {/* Contact Info */}
            <div className="flex items-center space-x-6 text-sm">
              <a
                href="mailto:support@placify.com"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>support@placify.com</span>
              </a>
              <Link
                to="/feedback"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Feedback</span>
              </Link>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-500 dark:text-gray-400 ${social.color} transition-colors duration-200 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-6 pt-4 border-t border-purple-400 dark:border-gray-700 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-sm text-gray-500 dark:text-gray-400">
              <p>© {new Date().getFullYear()} Placify. All rights reserved.</p>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>for better placements</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-4 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </>
  );
};

export default Footer;
