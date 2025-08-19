// EmployeeDashboardLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import EmployeeSidebar from "../components/EmployeeSidebar";
import { User, LogOut, ChevronDown } from "lucide-react";
import apiClient from "../api/apiClient";

const EmployeeDashboardLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch employee profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        console.log("Fetching employee profile with token:", token);
    
        // With our new request interceptor, we don't need to explicitly set the token
        const response = await apiClient.get("/auth/profile");

        console.log("Raw Response Status:", response.status);
        console.log("Employee Profile Response Data:", response.data);

        if (response.status === 200) {
          setUserData(response.data);
        } else {
          console.error(
            "Failed to fetch employee profile:",
            response.data?.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching employee profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Page title mapping for employee dashboard
  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap = {
      "/dashboard/employee": "Employee Dashboard",
      "/dashboard/employee/profile": "My Profile",
      "/dashboard/employee/performance": "Performance Overview",
      "/dashboard/employee/skills": "Skill Development Tracker",
      "/dashboard/employee/projects": "Project Contributions",
      "/dashboard/employee/career": "Career Progression",
      "/dashboard/employee/feedback": "Company Feedback & Reviews",
      "/dashboard/employee/learning": "Learning Resources",
      "/dashboard/employee/interview-practice": "Interview Practice Zone",
      "/dashboard/employee/job-insights": "Job Switch Insights",
      "/dashboard/employee/settings": "Settings",
    };
    return titleMap[path] || "Employee Dashboard";
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate("/dashboard/employee/profile");
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <EmployeeSidebar
        isExpanded={sidebarExpanded}
        setIsExpanded={setSidebarExpanded}
      />

      <div
        className={`transition-all duration-300 flex-1 flex flex-col ${
          sidebarExpanded ? "ml-64" : "ml-20"
        }`}
      >
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {userData
                  ? `Welcome back, ${userData.firstName || userData.name || userData.email}!`
                  : "Welcome back! Here's your personal dashboard overview."}
              </p>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-semibold">
                      {userData?.firstName || userData?.name || "Employee"}
                      {userData?.lastName && ` ${userData.lastName}`}
                    </p>
                    <p className="text-xs">{userData?.email || ""}</p>
                    {userData?.role && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">{userData.role}</p>
                    )}
                  </div>
                  <hr className="my-1 border-gray-200 dark:border-slate-600" />
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboardLayout;