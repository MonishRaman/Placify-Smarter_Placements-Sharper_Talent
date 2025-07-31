import React, { useState, useEffect } from 'react';
import {
  Brain,
  Play,
  Calendar,
  Clock,
  TrendingUp,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";

const data = [
  { name: "Jan", interviews: 10, avgScore: 70 },
  { name: "Feb", interviews: 15, avgScore: 75 },
  { name: "Mar", interviews: 8, avgScore: 65 },
  { name: "Apr", interviews: 12, avgScore: 72 },
];

const userName = "John Doe";

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      {/* Welcome Message */}
      <div className="text-center py-8">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Welcome back, <span className="text-blue-600 dark:text-blue-400">{userName}</span> 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Here's a quick summary of your performance</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Total Interviews</h2>
          <p className="text-3xl mt-2 text-blue-600 dark:text-blue-400">45</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Average Score</h2>
          <p className="text-3xl mt-2 text-green-600 dark:text-green-400">78%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Completion Rate</h2>
          <p className="text-3xl mt-2 text-purple-600 dark:text-purple-400">92%</p>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Monthly Interviews</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
              <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#F9FAFB' : '#111827'
                }}
              />
              <Bar dataKey="interviews" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Average Score</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis dataKey="name" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
              <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
              <CartesianGrid stroke={isDarkMode ? "#4B5563" : "#E5E7EB"} strokeDasharray="3 3" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#F9FAFB' : '#111827'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="avgScore" stroke="#facc15" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Start Interview</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Practice now</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Schedule</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Book session</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Achievements</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View badges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}