import React from "react";
import { Users, Star, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";

// Dummy employee performance data
const employees = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "SC",
    role: "Senior Software Engineer",
    department: "Engineering",
    score: 8.7,
    lastReview: "2025-08-15",
    trend: [7.5, 8.0, 8.2, 8.7],
  },
  {
    id: 2,
    name: "John Smith",
    avatar: "JS",
    role: "Product Manager",
    department: "Product",
    score: 9.1,
    lastReview: "2025-09-01",
    trend: [8.8, 9.0, 9.2, 9.1],
  },
  {
    id: 3,
    name: "Lisa Wang",
    avatar: "LW",
    role: "UX Designer",
    department: "Design",
    score: 8.9,
    lastReview: "2025-08-28",
    trend: [8.5, 8.7, 8.8, 8.9],
  },
  {
    id: 4,
    name: "Mark Johnson",
    avatar: "MJ",
    role: "DevOps Engineer",
    department: "Engineering",
    score: 8.3,
    lastReview: "2025-09-10",
    trend: [8.0, 8.1, 8.2, 8.3],
  },
  {
    id: 5,
    name: "Emily Davis",
    avatar: "ED",
    role: "Data Scientist",
    department: "Analytics",
    score: 9.0,
    lastReview: "2025-09-05",
    trend: [8.7, 8.9, 9.0, 9.0],
  },
];

const avgScore = (
  employees.reduce((acc, e) => acc + e.score, 0) / employees.length
).toFixed(2);
const topPerformers = employees.filter((e) => e.score >= 9).length;
const recentEvaluations = employees.filter(
  (e) => new Date(e.lastReview) > new Date("2025-08-31")
).length;

const Employees = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-950 dark:to-black p-4 md:p-6"
    >
      <main className="max-w-7xl mx-auto space-y-8">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200/60 dark:border-gray-700/50 flex items-center justify-between"
          >
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                Average Rating
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {avgScore}
              </p>
              <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
                Out of 10
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200/60 dark:border-gray-700/50 flex items-center justify-between"
          >
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                Top Performers
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {topPerformers}
              </p>
              <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
                Score ≥ 9
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-200/60 dark:border-gray-700/50 flex items-center justify-between"
          >
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                Recent Evaluations
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {recentEvaluations}
              </p>
              <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
                Last 30 days
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Performance Table/List */}
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-2 md:p-6 shadow-lg border border-gray-200/60 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Employee Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 px-2 md:px-4 font-medium text-gray-500 dark:text-gray-400">
                    Employee
                  </th>
                  <th className="py-2 px-2 md:px-4 font-medium text-gray-500 dark:text-gray-400">
                    Role / Dept
                  </th>
                  <th className="py-2 px-2 md:px-4 font-medium text-gray-500 dark:text-gray-400">
                    Score
                  </th>
                  <th className="py-2 px-2 md:px-4 font-medium text-gray-500 dark:text-gray-400">
                    Last Review
                  </th>
                  <th className="py-2 px-2 md:px-4 font-medium text-gray-500 dark:text-gray-400">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  >
                    <td className="py-3 px-2 md:px-4 flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                        {emp.avatar}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {emp.name}
                      </span>
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      <span className="text-gray-700 dark:text-gray-300 text-xs md:text-sm">
                        {emp.role}
                      </span>
                      <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                        {emp.department}
                      </span>
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-700 dark:text-blue-400">
                          {emp.score}
                        </span>
                        <div className="w-16 md:w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${emp.score * 10}%` }}
                            className="h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {emp.lastReview}
                      </span>
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      {/* Chart Placeholder */}
                      <div className="flex items-end gap-0.5 md:gap-1 h-8">
                        {emp.trend.map((val, idx) => (
                          <div
                            key={idx}
                            className="w-2 md:w-3 rounded bg-blue-400/70 dark:bg-blue-500/70"
                            style={{ height: `${val * 8}px` }}
                          ></div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Placeholder for future charts/analytics */}
        <div className="bg-white/70 dark:bg-gray-800/80 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl min-h-[120px] md:min-h-[200px] flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs md:text-sm italic shadow-inner mt-8">
          More analytics and charts coming soon...
        </div>
      </main>
    </motion.div>
  );
};

export default Employees;
