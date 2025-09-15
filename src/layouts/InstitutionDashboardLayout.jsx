import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import InstitutionSidebar from '../components/InstitutionSidebar';
import { User, LogOut, ChevronDown } from 'lucide-react';
import CursorToggle from '../components/CursorToggle';

const ProfileDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  }; 

  
  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border py-2 z-50">
          <button
            onClick={() => navigate('/dashboard/institution/profile')}
            className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <hr className="my-1" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const InstitutionDashboardLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const location = useLocation();

  const getPageTitle = () => {
    const titleMap = {
      '/dashboard/institution': 'Dashboard',
      '/dashboard/institution/profile': 'Profile',
      '/dashboard/institution/student-performance': 'Student Performance',
      '/dashboard/institution/department-performance': 'Department Performance',
      '/dashboard/institution/reports': 'Reports',
      '/dashboard/institution/analytics': 'Analytics',
      '/dashboard/institution/settings': 'Settings'
    };
    return titleMap[location.pathname] || 'Institution Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <InstitutionSidebar 
        isExpanded={sidebarExpanded} 
        setIsExpanded={setSidebarExpanded}
      />
      <div className={`transition-all duration-300 flex-1 flex flex-col ${
        sidebarExpanded ? "ml-64" : "ml-20"
      }`}>
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {getPageTitle()}
            </h1>

            <div className="flex items-center space-x-4">
              <CursorToggle />
              <ProfileDropdown />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstitutionDashboardLayout;