import React, { useState, useEffect } from 'react';
import {
  Users, Building2, TrendingUp, MapPin, Mail, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
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

//const notify = (msg) => toast.success(msg);

const CompanyDashboard = () => {
  const [userData, setUserData] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await apiClient.get("/auth/profile");
        if (response.status === 200) {
          setUserData(response.data);
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
      className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 
                 dark:from-gray-900 dark:via-gray-950 dark:to-black p-6"
    >
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Company Header Card */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl shadow-lg"
        >
          <div className="flex flex-wrap items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Employees", value: companyData.totalEmployees, desc: "Active workforce", icon: <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />, bg: "bg-purple-100 dark:bg-purple-900/30" },
            { label: "Departments", value: companyData.departments, desc: "Operational divisions", icon: <Building2 className="w-6 h-6 text-pink-600 dark:text-pink-400" />, bg: "bg-pink-100 dark:bg-pink-900/30" },
            { label: "Average Performance", value: companyData.avgPerformance, desc: "Out of 10", icon: <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-100 dark:bg-blue-900/30" },
            { label: "Top Performers", value: companyData.topPerformers, desc: "High achievers", icon: <Users className="w-6 h-6 text-green-600 dark:text-green-400" />, bg: "bg-green-100 dark:bg-green-900/30" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 shadow-lg border border-gray-200/60 dark:border-gray-700/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">{stat.desc}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Employees */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 shadow-lg border border-gray-200/60 dark:border-gray-700/50 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Employee Activities</h3>
          <div className="space-y-3">
            {companyData.employees.slice(0, 3).map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/80 rounded-lg shadow-sm">
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

        {/* Placeholder */}
        <div className="bg-white/70 dark:bg-gray-800/80 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl min-h-[200px] flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm italic shadow-inner">
          More metrics and charts coming soon...
        </div>
      </main>

      
    </motion.div>
  );
};

export default CompanyDashboard;
