// SideBarStudent.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  UserCircle,
  LayoutDashboard,
  FileText,
  BarChart3,
  Briefcase,
  Code,
  HelpCircle,
  BookOpen,
  MessageSquare,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Home,
  CheckSquare,
  Brain,
  Search,
  Bell,
  Moon,
  Sun,
} from "lucide-react";

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    // Explicitly set or remove dark class instead of toggling
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  React.useEffect(() => {
    // Check if dark mode is already enabled and sync state
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    // Optional: Save preference to localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Save theme preference whenever it changes
  React.useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const menuItems = [
    { icon: User, label: "Home", path: "/" },
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    {
      icon: FileText,
      label: "Resume Builder",
      path: "/dashboard/resume-builder",
    },
    {
      icon: CheckSquare,
      label: "Resume ATS Score",
      path: "/dashboard/resume-ats",
    },
    { icon: Briefcase, label: "Jobs", path: "/dashboard/jobs" },
    { icon: User, label: "Jobs Based on User", path: "/dashboard/user-jobs" },
    { icon: Code, label: "Coding", path: "/dashboard/coding" },
    {
      icon: MessageSquare,
      label: "Interview Practice",
      path: "/dashboard/interview-practice",
    },
    { icon: Brain, label: "Aptitude Questions", path: "/dashboard/aptitude" },
    {
      icon: BookOpen,
      label: "Interview Experience",
      path: "/dashboard/interview-experience",
    },
    // New menu item for the Student Progress Dashboard
    { icon: BarChart3, label: "Progress Tracker", path: "/dashboard/progress" },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem("token");
    window.location.href = "/";
    // Clear tokens, redirect to login, etc.
  };

  return (
    <div
      className={`h-screen bg-white dark:bg-slate-900 shadow-lg transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      } fixed left-0 top-0 z-50 border-r border-gray-200 dark:border-slate-700`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          {isExpanded && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-gray-800 dark:text-white font-semibold text-lg">
                Placify
              </span>
            </div>
          )}
          {!isExpanded && (
            <div className="w-8 h-8 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">P</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={`text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors ${
              !isExpanded ? "absolute right-2" : ""
            }`}
          >
            {isExpanded ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>

        {/* Search Bar */}
        {isExpanded && (
                  <div
          className={`transition-all duration-300  ${
            isExpanded ? "p-4" : "p-0 h-0"
          }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none text-sm"
            />
          </div>
        </div>

        )}


        {/* Main Navigation */}
        <nav className="flex-1 px-4 ">
          {menuItems.map(({ label, icon: Icon, path }) => (
            <div key={path} className="relative">
              
              <NavLink
                to={path}
                end={path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-1 group relative ${
                    isActive
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`text-sm font-medium truncate transition-all duration-300 ${
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2"
                  }`}
                >
                  {label}
                </span>
              </NavLink>

              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-800 text-white dark:text-slate-100 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-slate-700">
                  {label}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-slate-700">
          {/* Dark Mode Toggle */}
          <div className="relative mb-1 mt-4">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white group"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Moon className="w-5 h-5 flex-shrink-0" />
              )}
              <span
                className={`text-sm font-medium transition-all duration-300 ${
                  isExpanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2"
                }`}
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </button>

            {!isExpanded && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-800 text-white dark:text-slate-100 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-slate-700">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </div>
            )}
          </div>

          <div className="relative mb-1">
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                    : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span
                className={`text-sm font-medium transition-all duration-300 ${
                  isExpanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2"
                }`}
              >
                Settings
              </span>
            </NavLink>

            {!isExpanded && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-800 text-white dark:text-slate-100 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-slate-700">
                Settings
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white group"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span
                className={`text-sm font-medium transition-all duration-300 ${
                  isExpanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2"
                }`}
              >
                Logout
              </span>
            </button>

            {!isExpanded && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-800 text-white dark:text-slate-100 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-slate-700">
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
