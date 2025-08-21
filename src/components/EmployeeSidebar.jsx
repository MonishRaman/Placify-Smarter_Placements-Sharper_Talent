// EmployeeSidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  Bot ,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Search
} from 'lucide-react';

const EmployeeSidebar = ({ isExpanded, setIsExpanded }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  
  const toggleSidebar = () => setIsExpanded(!isExpanded);
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Employee dashboard menu items
  const menuItems = [
    { icon: User, label: 'Profile', path: '/dashboard/employee/profile' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/employee' },
    { icon: TrendingUp, label: 'Performance Overview', path: '/dashboard/employee/performance' },
    { icon: Target, label: 'Skill Development Tracker', path: '/dashboard/employee/skills' },
    { icon: FolderOpen, label: 'Project Contributions', path: '/dashboard/employee/projects' },
    { icon: Briefcase, label: 'Career Progression', path: '/dashboard/employee/career' },
    { icon: MessageSquare, label: 'Company Feedback / Reviews', path: '/dashboard/employee/feedback' },
    { icon: BookOpen, label: 'Learning Resources', path: '/dashboard/employee/learning' },
    { icon: Users, label: 'Interview Practice Zone', path: '/dashboard/employee/interview-practice' },
    { icon: BarChart3, label: 'Job Switch Insights', path: '/dashboard/employee/job-insights' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className={`h-screen bg-white dark:bg-slate-900 shadow-lg transition-all duration-300 ${
      isExpanded ? "w-64" : "w-20"
    } fixed left-0 top-0 z-50 border-r border-gray-200 dark:border-slate-700`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
          {isExpanded && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-gray-800 dark:text-white font-semibold text-lg">Placify</span>
            </div>
          )}
          {!isExpanded && (
            <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">P</span>
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className={`text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors ${!isExpanded ? 'absolute right-2' : ''}`}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Search Bar */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'p-4' : 'p-0 h-0'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-4">
          {menuItems.map(({ label, icon: Icon, path }) => (
            <div key={path} className="relative">
              <NavLink
                to={path}
                end={path === '/dashboard/employee'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-1 group relative ${
                    isActive 
                      ? "bg-blue-600 dark:bg-blue-500 text-white" 
                      : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`text-sm font-medium truncate transition-all duration-300 ${
                  isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}>
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
              {isDarkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
              <span className={`text-sm font-medium transition-all duration-300 ${
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
            
            {!isExpanded && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-800 text-white dark:text-slate-100 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-slate-700">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative mb-1">
            <NavLink
              to="/dashboard/employee/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-600 dark:bg-blue-500 text-white" 
                    : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm font-medium transition-all duration-300 ${
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
                Settings
              </span>
            </NavLink>
            
            {!isExpanded && (

              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-800 text-white dark:text-slate-100 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-slate-700">
                Settings
              </div>
            )}
          </div>
          
          <div className="relative mb-1">
            <NavLink
              to="/dashboard/employee/Ai_Interview"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-600 dark:bg-blue-500 text-white" 
                    : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              <Bot  className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm font-medium transition-all duration-300 ${
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
                Roast Your Resume
              </span>
            </NavLink>
            
            {!isExpanded && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 dark:bg-slate-800 text-white dark:text-slate-100 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-600 dark:border-slate-700">
                Roast Your Resume
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="relative">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white group"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm font-medium transition-all duration-300 ${
                isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}>
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

export default EmployeeSidebar;