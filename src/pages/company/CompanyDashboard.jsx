import React, { useState, useEffect } from 'react';
import {
  Users, Building2, TrendingUp, MapPin, Mail, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../api/apiClient';

const companyData = {
  name: "TechCorp Solutions",
  logo: "TC",
  totalEmployees: 450,
  departments: 8,
  avgPerformance: 8.2,
  topPerformers: 23,
  growthRate: 12.5,
  employees: [
    { id: 1, name: "Sarah Chen", role: "Senior Software Engineer", department: "Engineering", performance: 8.7, experience: "3.5 years", email: "sarah.chen@techcorp.com" },
    { id: 2, name: "John Smith", role: "Product Manager", department: "Product", performance: 9.1, experience: "5 years", email: "john.smith@techcorp.com" },
    { id: 3, name: "Lisa Wang", role: "UX Designer", department: "Design", performance: 8.9, experience: "4 years", email: "lisa.wang@techcorp.com" },
    { id: 4, name: "Mark Johnson", role: "DevOps Engineer", department: "Engineering", performance: 8.3, experience: "2.5 years", email: "mark.johnson@techcorp.com" },
    { id: 5, name: "Emily Davis", role: "Data Scientist", department: "Analytics", performance: 9.0, experience: "3 years", email: "emily.davis@techcorp.com" }
  ]
};

const notify = (msg) => toast.success(msg);

const CompanyDashboard = () => {
  const [userData, setUserData] = useState(null);

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
          setUserData(data);
        } else {
          console.error(
            "Failed to fetch profile:",
            data?.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }} 
      className="p-6"
    >
      <main className="max-w-7xl mx-auto">
        {/* Company Header Card */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.2 }} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-xl mb-8"
        >
          <div className="flex flex-wrap items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold">
                {userData?.companyName ? userData.companyName.substring(0, 2).toUpperCase() : "TC"}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold">
                {userData?.companyName || userData?.institutionName || "TechCorp Solutions"}
              </h2>
              <p className="text-pink-100 mt-1">Technology Solutions Company</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> San Francisco, CA
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" /> Founded 2018
                </span>
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" /> {userData?.email || "contact@techcorp.com"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{companyData.totalEmployees}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Active workforce</p>
                <div className="flex items-center mt-2 text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+{companyData.growthRate}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Departments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{companyData.departments}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Operational divisions</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Performance</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{companyData.avgPerformance}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Out of 10</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }} 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Performers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{companyData.topPerformers}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">High achievers</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Employees */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Employee Activities</h3>
          <div className="space-y-3">
            {companyData.employees.slice(0, 3).map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{employee.role} • {employee.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Performance: {employee.performance}/10</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{employee.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Placeholder for More Content */}
        <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl min-h-[200px] flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm italic">
          More metrics and charts coming soon...
        </div>
      </main>

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar 
        newestOnTop 
        closeOnClick 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="colored" 
      />
    </motion.div>
  );
};

export default CompanyDashboard;