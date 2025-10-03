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
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

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

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast("Please enter your email address", "error");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real application, you would make an API call here
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // For demo purposes, we'll assume it was successful
      showToast("Successfully subscribed to our newsletter!", "success");
      setEmail("");
    } catch (error) {
      showToast("Failed to subscribe. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* About Placify Section */}
            <div className="sm:col-span-2 lg:col-span-2">
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
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
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

            {/* Newsletter Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Stay Updated
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Subscribe to our newsletter for the latest updates and tips on
                interview preparation.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>

          {/* Contact & Social Section */}
          <div className="mt-6 pt-6 border-t border-purple-400 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
              <a
                href="mailto:support@placify.com"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-center sm:text-left">support@placify.com</span>
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
            <div className="flex items-center space-x-3 sm:space-x-4">
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


      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto flex items-center space-x-2 p-3 sm:p-4 rounded-lg shadow-lg z-40 ${
              toast.type === "error"
                ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
            }`}
          >
            {toast.type === "error" ? (
              <XCircle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
