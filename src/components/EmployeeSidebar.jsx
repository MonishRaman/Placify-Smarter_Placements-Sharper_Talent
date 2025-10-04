// EmployeeSidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  LayoutDashboard,
  TrendingUp,
  Target,
  FolderOpen,
  Briefcase,
  MessageSquare,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Moon,
  Sun,
  Search,
} from "lucide-react";

const EmployeeSidebar = ({ isExpanded, setIsExpanded }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [openSections, setOpenSections] = useState({
    overview: true, // Default open for quick access
    performance: false,
    contributions: false,
    learning: false,
    career: false,
  });
  const navigate = useNavigate();

  // Screen resize watcher
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Body scroll control for mobile only
  useEffect(() => {
    if (isMobile && isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isExpanded]);

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
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
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

  // Grouped sidebar structure
  const sidebarStructure = [
    {
      icon: LayoutDashboard,
      label: "Overview & Profile",
      type: "section",
      sectionKey: "overview",
      description: "Dashboard & profile",
      children: [
        {
          icon: User,
          label: "Profile",
          path: "/dashboard/employee/profile",
          type: "link",
        },
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/dashboard/employee",
          type: "link",
        },
      ],
    },
    {
      icon: TrendingUp,
      label: "Performance & Growth",
      type: "section",
      sectionKey: "performance",
      description: "Track performance",
      children: [
        {
          icon: TrendingUp,
          label: "Performance Overview",
          path: "/dashboard/employee/performance",
          type: "link",
        },
        {
          icon: Target,
          label: "Skill Development",
          path: "/dashboard/employee/skills",
          type: "link",
        },
        {
          icon: Briefcase,
          label: "Career Progression",
          path: "/dashboard/employee/career",
          type: "link",
        },
      ],
    },
    {
      icon: FolderOpen,
      label: "Work Contributions",
      type: "section",
      sectionKey: "contributions",
      description: "Projects & feedback",
      children: [
        {
          icon: FolderOpen,
          label: "Project Contributions",
          path: "/dashboard/employee/projects",
          type: "link",
        },
        {
          icon: MessageSquare,
          label: "Company Feedback",
          path: "/dashboard/employee/feedback",
          type: "link",
        },
      ],
    },
    {
      icon: BookOpen,
      label: "Learning & Preparation",
      type: "section",
      sectionKey: "learning",
      description: "Learning resources",
      children: [
        {
          icon: BookOpen,
          label: "Learning Resources",
          path: "/dashboard/employee/learning",
          type: "link",
        },
        {
          icon: Users,
          label: "Interview Practice",
          path: "/dashboard/employee/interview-practice",
          type: "link",
        },
      ],
    },
    {
      icon: BarChart3,
      label: "Career Planning",
      type: "section",
      sectionKey: "career",
      description: "Job insights and planning",
      children: [
        {
          icon: BarChart3,
          label: "Job Switch Insights",
          path: "/dashboard/employee/job-insights",
          type: "link",
        },
      ],
    },
  ];

  return (
    <>
      <style jsx global>{`
        .sidebar-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .sidebar-scrollbar {
          scrollbar-color: #475569 #1e293b;
        }
        .dark .sidebar-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .dark .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>

      {/* Mobile overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        className={`h-screen bg-white dark:bg-slate-900 shadow-lg border-r border-gray-200 dark:border-slate-700 transition-[width,transform] duration-300 ease-out ${
          isMobile
            ? `fixed inset-y-0 left-0 z-50 w-64 ${
                isExpanded ? "translate-x-0" : "-translate-x-full"
              }`
            : `fixed left-0 top-0 z-50 ${isExpanded ? "w-64" : "w-20"}`
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            {isExpanded && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-gray-800 dark:text-white font-semibold text-lg">
                  Placify
                </span>
              </div>
            )}
            {!isExpanded && (
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">P</span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {isMobile ? (
                <ChevronLeft size={20} />
              ) : isExpanded ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isExpanded ? "p-3" : "p-0 h-0"
            }`}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 pt-1 sidebar-scrollbar">
            {sidebarStructure.map((item, index) => {
              if (item.type === "section") {
                const isOpen = openSections[item.sectionKey];
                // Filter children by search
                const filteredChildren = item.children.filter((child) =>
                  child.label.toLowerCase().includes(searchQuery.toLowerCase())
                );
                // Hide section if no children match search
                if (searchQuery && filteredChildren.length === 0) return null;

                return (
                  <div key={item.label} className="mb-1">
                    {/* Section divider - only show if not first item */}
                    {index > 0 && (
                      <div className="mx-2 my-2 border-t border-gray-200 dark:border-slate-700"></div>
                    )}

                    <div className="relative group">
                      <button
                        className={`w-full flex items-center gap-2 py-2 rounded-lg mb-1 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                          isExpanded ? "px-2" : "justify-center"
                        } ${isOpen ? "bg-gray-50 dark:bg-slate-800/50" : ""}`}
                        onClick={() =>
                          setOpenSections((s) => ({
                            ...s,
                            [item.sectionKey]: !s[item.sectionKey],
                          }))
                        }
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${
                          item.label
                        } section`}
                      >
                        <div
                          className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors ${
                            isOpen
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
                          }`}
                        >
                          <item.icon className="w-3.5 h-3.5" />
                        </div>
                        {isExpanded && (
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-xs font-medium truncate">
                              {item.label}
                            </div>
                            {item.description && (
                              <div className="text-xs text-gray-500 dark:text-slate-400 truncate leading-tight">
                                {item.description}
                              </div>
                            )}
                          </div>
                        )}
                        {isExpanded && (
                          <ChevronDown
                            className={`w-3 h-3 ml-auto transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Tooltip for collapsed sidebar */}
                      {!isExpanded && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900/90 dark:bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                          <div className="font-medium">{item.label}</div>
                        </div>
                      )}

                      {/* Collapsible children */}
                      <div
                        className={`ml-1 pl-4 border-l border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                        }`}
                        style={{
                          height: isOpen
                            ? `${filteredChildren.length * 32}px`
                            : "0px",
                        }}
                      >
                        {filteredChildren.map(
                          ({ label, icon: Icon, path, onClick, type }) => (
                            <div key={label}>
                              {type === "link" ? (
                                <NavLink
                                  to={path}
                                  end={path === "/dashboard/employee"}
                                  className={({ isActive }) =>
                                    `flex items-center gap-2 py-1.5 rounded-md mb-0.5 transition-colors px-2 ${
                                      isActive
                                        ? "bg-blue-600 dark:bg-blue-500 text-white shadow-sm"
                                        : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                                    }`
                                  }
                                  onClick={() =>
                                    isMobile && setIsExpanded(false)
                                  }
                                >
                                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="text-xs truncate">
                                    {label}
                                  </span>
                                </NavLink>
                              ) : (
                                <button
                                  onClick={() => {
                                    onClick && onClick();
                                    if (isMobile) setIsExpanded(false);
                                  }}
                                  className="w-full flex items-center gap-2 py-1.5 rounded-md mb-0.5 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors px-2"
                                >
                                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="text-xs truncate">
                                    {label}
                                  </span>
                                </button>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </nav>

          {/* Bottom Section */}
          <div className="px-2 pb-3 border-t border-gray-200 dark:border-slate-700">
            {/* Settings */}
            <div className="relative mb-1 mt-3">
              <NavLink
                to="/dashboard/employee/settings"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  }`
                }
              >
                <Settings className="w-3.5 h-3.5 flex-shrink-0" />
                <span
                  className={`text-xs font-medium transition-all duration-300 ${
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2"
                  }`}
                >
                  Settings
                </span>
              </NavLink>

              {!isExpanded && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-800 text-white dark:text-slate-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-slate-700">
                  Settings
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <div className="relative mb-1">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white group"
              >
                {isDarkMode ? (
                  <Sun className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                  <Moon className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span
                  className={`text-xs font-medium transition-all duration-300 ${
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2"
                  }`}
                >
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </button>

              {!isExpanded && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-800 text-white dark:text-slate-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-slate-700">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </div>
              )}
            </div>

            {/* Logout */}
            <div className="relative">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white group"
              >
                <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                <span
                  className={`text-xs font-medium transition-all duration-300 ${
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2"
                  }`}
                >
                  Logout
                </span>
              </button>

              {!isExpanded && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-800 text-white dark:text-slate-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-slate-700">
                  Logout
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeSidebar;
