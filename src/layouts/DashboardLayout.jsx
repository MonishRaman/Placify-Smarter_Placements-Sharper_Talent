// DashboardLayout.jsx
import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBarStudent";
import { User, LogOut, ChevronDown } from "lucide-react";
import apiClient from "../api/apiClient";

const DashboardLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null); // <-- Added state for user
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        console.log("Fetching profile with token:", token);
    
        // With our new request interceptor, we don't need to explicitly set the token
        const response = await apiClient.get("/auth/profile");

        console.log("Raw Response Status:", response.status);
        console.log("Profile Response Data:", response.data);

        if (response.status === 200) {
          setUserData(response.data);
        } else {
          console.error(
            "Failed to fetch profile:",
            response.data?.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
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

  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap = {
      "/dashboard/profile": "Home",
      "/dashboard": "Dashboard",
      "/dashboard/resume-builder": "Resume Builder",
      "/dashboard/resume-ats": "Resume ATS Score",
      "/dashboard/jobs": "Jobs",
      "/dashboard/user-jobs": "Jobs Based on User",
      "/dashboard/coding": "Coding",
      "/dashboard/interview-practice": "Interview Practice",
      "/dashboard/aptitude": "Aptitude Questions",
      "/dashboard/interview-experience": "",
      "/dashboard/settings": "Settings",
    };
    return titleMap[path] || "";
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate("/dashboard/profile");
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
      <Sidebar
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
                  ? `Welcome back, ${userData.fullName || userData.institutionName || userData.email}!`
                  : "Welcome back! Here's what's happening."}
              </p>
            </div>

            <div className="relative" >
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
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
                    <p className="font-semibold">{userData?.fullName||userData.institutionName || "User"}</p>
                    <p className="text-xs">{userData?.email || ""}</p>
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

        <main className="flex-1 min-h-screen bg-slate-50 dark:bg-slate-900 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
