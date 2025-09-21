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
  Briefcase,
  X
} from "lucide-react";

const CompanySidebar = ({ isExpanded, setIsExpanded }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
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

  const toggleSidebar = () => setIsExpanded(prev => !prev);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  // Load and persist theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved === "dark";
    setIsDarkMode(dark);
    document.documentElement.classList.toggle("dark", dark);
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
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/company", type: "link" },
    { icon: User, label: "Profile", path: "/dashboard/company/profile", type: "link" },
    { icon: Briefcase, label: "My Jobs", path: "/dashboard/company/my-jobs", type: "link" },
    { icon: Plus, label: "Post New Job", path: "/dashboard/company/post-job", type: "link" },
    { icon: UserCheck, label: "Applicants Tracker", path: "/dashboard/company/applicants", type: "link" },
    { icon: Users, label: "Employee Directory", path: "/dashboard/company/employees", type: "link" },
    { icon: BarChart3, label: "Employee Performance Reports", path: "/dashboard/company/performance", type: "link" },
    { icon: TrendingUp, label: "Company Insights", path: "/dashboard/company/insights", type: "link" },
    { icon: Building2, label: "Institution Collaboration", path: "/dashboard/company/collaboration", type: "link" },
    { icon: FileText, label: "Generate Reports", path: "/dashboard/company/reports", type: "link" },
    { icon: Settings, label: "Settings", path: "/dashboard/company/settings", type: "link" },
    { icon: isDarkMode ? Sun : Moon, label: isDarkMode ? "Light Mode" : "Dark Mode", onClick: toggleDarkMode, type: "button" },
    { icon: LogOut, label: "Logout", onClick: handleLogout, type: "button" }
  ];

  const filteredItems = menuItems.filter(m =>
    m.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 shadow-lg border-r border-gray-200 dark:border-slate-700 
          transition-[width,transform] duration-300 ease-out
          ${isMobile
            ? `w-64 ${isExpanded ? "translate-x-0" : "-translate-x-full"}`
            : isExpanded ? "w-64" : "w-20"
          }`}
      >
        {/* Brand & Toggle */}
        <div className="flex items-center justify-between flex-shrink-0 p-4 border-b border-gray-200 dark:border-slate-700">
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
            className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {isMobile ? <X size={20} /> : isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Search */}
        {isExpanded && (
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none text-sm"
              />
            </div>
          </div>
        )}

        {/* Menu - With scrollbar */}
        <nav className="flex-1 overflow-y-auto px-3 pt-3 pb-4 sidebar-scrollbar">
          {filteredItems.map(({ label, icon: Icon, path, onClick, type }) => {
            const content = (
              <>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="text-sm font-medium truncate">
                    {label}
                  </span>
                )}
              </>
            );
            return (
              <div key={label} className="relative group">
                {type === "link" ? (
                  <NavLink
                    to={path}
                    end={path === "/dashboard/company"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                        isActive
                          ? "bg-blue-600 dark:bg-blue-500 text-white"
                          : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                      }`
                    }
                    onClick={() => isMobile && setIsExpanded(false)}
                  >
                    {content}
                  </NavLink>
                ) : (
                  <button
                    onClick={() => {
                      onClick && onClick();
                      if (isMobile) setIsExpanded(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {content}
                  </button>
                )}
                {!isExpanded && !isMobile && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900/90 dark:bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                    {label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default CompanySidebar;