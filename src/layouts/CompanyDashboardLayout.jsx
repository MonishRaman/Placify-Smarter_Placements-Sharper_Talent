import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CompanySidebar from "../components/CompanySidebar";
import { User, LogOut, ChevronDown, Menu } from "lucide-react";
import apiClient from "../api/apiClient";
import CursorToggle from "../components/CursorToggle";

const CompanyDashboardLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth >= 1024);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarExpanded(true);
      } else {
        setSidebarExpanded(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await apiClient.get("/auth/profile");
        if (res.status === 200) setUserData(res.data);
      } catch {}
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (/^\/dashboard\/company\/jobs\/[^/]+\/edit$/.test(path)) return "Edit Job";
    const titleMap = {
      "/dashboard/company": "Company Dashboard",
      "/dashboard/company/profile": "Company Profile",
      "/dashboard/company/employees": "Employee Directory",
      "/dashboard/company/performance": "Employee Performance Reports",
      "/dashboard/company/post-job": "Post New Job",
      "/dashboard/company/applicants": "Applicants Tracker",
      "/dashboard/company/my-jobs": "Posted Jobs",
      "/dashboard/company/insights": "Company Insights",
      "/dashboard/company/collaboration": "Institution Collaboration",
      "/dashboard/company/reports": "Generate Reports",
      "/dashboard/company/settings": "Settings"
    };
    return titleMap[path] || "Company Dashboard";
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <>
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar {
          scrollbar-color: #475569 #1e293b;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
      
      <div className="flex h-screen bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <CompanySidebar
          isExpanded={sidebarExpanded}
          setIsExpanded={setSidebarExpanded}
        />

        <div
          className={`flex flex-col flex-1 min-h-0 w-full transition-[margin] duration-300 ease-out ${
            !isMobile ? (sidebarExpanded ? "ml-64" : "ml-20") : "ml-0"
          }`}
        >
          <header className="sticky top-0 z-20 bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex-shrink-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center min-w-0 flex-1 mr-4">
                {isMobile && (
                  <button
                    onClick={() => setSidebarExpanded(true)}
                    className="mr-2 sm:mr-3 p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex-shrink-0"
                    aria-label="Open sidebar"
                  >
                    <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-slate-800 dark:text-white truncate">
                    {getPageTitle()}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 truncate hidden xs:block">
                    {userData
                      ? `Welcome back, ${
                          userData.companyName ||
                          userData.institutionName ||
                          userData.email
                        }!`
                      : "Welcome back!"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
                <div className="hidden sm:block">
                  <CursorToggle />
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-300 transition-transform hidden sm:block ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 py-2 z-50">
                      <div className="px-4 pb-2 text-sm text-slate-700 dark:text-slate-300">
                        <p className="font-semibold truncate">
                          {userData?.companyName || "Company"}
                        </p>
                        <p className="text-xs truncate">{userData?.email || ""}</p>
                      </div>
                      <hr className="border-slate-200 dark:border-slate-700 my-1" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/dashboard/company/profile");
                        }}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition rounded-md"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition rounded-md"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 bg-slate-50 dark:bg-slate-900 custom-scrollbar">
            <div className="w-full max-w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default CompanyDashboardLayout;