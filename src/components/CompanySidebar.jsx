// CompanySidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  LayoutDashboard,
  Users,
  BarChart3,
  Plus,
  UserCheck,
  TrendingUp,
  Building2,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Search,
} from "lucide-react";

const CompanySidebar = ({ isExpanded, setIsExpanded }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 search state
  const navigate = useNavigate();

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const menuItems = [
    { icon: User, label: "Profile", path: "/dashboard/company/profile", type: "link" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/company", type: "link" },
    { icon: Users, label: "Employee Directory", path: "/dashboard/company/employees", type: "link" },
    { icon: BarChart3, label: "Employee Performance Reports", path: "/dashboard/company/performance", type: "link" },
    { icon: Plus, label: "Post New Job", path: "/dashboard/company/post-job", type: "link" },
    { icon: UserCheck, label: "Applicants Tracker", path: "/dashboard/company/applicants", type: "link" },
    { icon: TrendingUp, label: "Company Insights", path: "/dashboard/company/insights", type: "link" },
    { icon: Building2, label: "Institution Collaboration", path: "/dashboard/company/collaboration", type: "link" },
    { icon: FileText, label: "Generate Reports", path: "/dashboard/company/reports", type: "link" },
    { icon: Settings, label: "Settings", path: "/dashboard/company/settings", type: "link" },
    { icon: isDarkMode ? Sun : Moon, label: isDarkMode ? "Light Mode" : "Dark Mode", onClick: toggleDarkMode, type: "button" },
    { icon: LogOut, label: "Logout", onClick: handleLogout, type: "button" },
  ];

  // 🔍 Filtered menu items
  const filteredItems = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`h-screen bg-white dark:bg-slate-900 shadow-lg transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      } fixed left-0 top-0 z-50 border-r border-gray-200 dark:border-slate-700 overflow-x-hidden flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
        {isExpanded ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-gray-800 dark:text-white font-semibold text-lg truncate">
              Placify
            </span>
          </div>
        ) : (
          <div className="w-8 h-8 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">P</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Search Bar */}
      {isExpanded && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // 🔍 search logic
              className="w-full bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none text-sm"
            />
          </div>
        </div>
      )}

      {/* Unified Menu */}
      <nav className="flex-1 overflow-y-auto px-4 overflow-x-hidden pb-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(({ label, icon: Icon, path, onClick, type }) => (
            <div key={label} className="relative">
              {type === "link" ? (
                <NavLink
                  to={path}
                  end={path === "/dashboard/company"}
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
                      isExpanded ? "opacity-100" : "opacity-0 w-0"
                    }`}
                  >
                    {label}
                  </span>
                </NavLink>
              ) : (
                <button
                  onClick={onClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-1 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white group"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className={`text-sm font-medium truncate transition-all duration-300 ${
                      isExpanded ? "opacity-100" : "opacity-0 w-0"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              )}

              {/* Tooltip when collapsed */}
              {!isExpanded && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-slate-700">
                  {label}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 dark:text-slate-500 text-sm mt-4 px-2">No results found</p>
        )}
      </nav>
    </div>
  );
};

export default CompanySidebar;
