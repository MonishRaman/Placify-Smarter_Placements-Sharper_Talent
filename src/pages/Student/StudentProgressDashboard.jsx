import React, { useState, useEffect } from "react";
import { Search, BarChart3, UserCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const StudentProgressCard = ({ student }) => {
  const navigate = useNavigate();
  const progressColor =
    student.status === "Completed"
      ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
      : student.progress > 0
      ? "bg-gradient-to-r from-sky-500 to-blue-400"
      : "bg-gradient-to-r from-gray-300 to-gray-200"; // lighter for better contrast

  const statusColor =
    student.status === "Completed"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200"
      : student.status === "In Progress"
      ? "bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-200"
      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";

  const handleClick = () => {
    navigate(`/dashboard/progress/${student.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white w-64 dark:bg-slate-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col gap-4 justify-between border border-gray-100 dark:border-slate-700 cursor-pointer group mb-6 hover:scale-[1.035] overflow-hidden"
      onClick={handleClick}
    >
      {/* Decorative Gradient Blobs */}
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-300 via-blue-200 to-transparent dark:from-purple-900 dark:via-blue-900 dark:to-transparent rounded-full blur-2xl opacity-50 pointer-events-none z-0"></div>
      <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-gradient-to-tr from-emerald-200 via-purple-100 to-transparent dark:from-emerald-900 dark:via-purple-900 dark:to-transparent rounded-full blur-2xl opacity-40 pointer-events-none z-0"></div>
      {/* Avatar & Info */}
      <div className="flex items-center gap-5 z-10 relative">
        <div className="flex items-center justify-center h-12 w-12 bg-gradient-to-br from-blue-200 to-purple-300 dark:from-blue-900 dark:to-purple-900 text-blue-600 dark:text-blue-300 rounded-full shadow-lg group-hover:scale-110 transition-transform border-2 border-white dark:border-slate-800">
          <UserCircle size={38} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white leading-tight truncate drop-shadow">
            {student.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 truncate">
            {student.email}
          </p>
        </div>
      </div>
      {/* Progress & Status */}
      <div className="flex flex-col gap-2 z-10 relative">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold px-3 py-[0.35rem] rounded-full ${statusColor} shadow-sm flex items-center`}
          >
            {student.status}
          </span>
          <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">
            {student.progress}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-slate-600 overflow-hidden shadow-inner relative">
          <div
            style={{ width: `${student.progress}%` }}
            className={`h-full ${progressColor} transition-all duration-500`}
          ></div>
          {/* Subtle shine effect */}
          <div className="absolute left-0 top-0 h-full w-full pointer-events-none">
            <div className="h-full w-1/3 bg-white/30 dark:bg-white/10 rounded-full blur-sm"></div>
          </div>
        </div>
      </div>
      {/* Action Button */}
      <div className="flex justify-end mt-1 z-10 relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white text-xs font-medium shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

const StudentProgressDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/students/progress");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStudents(data);
      } catch (e) {
        setError("Failed to fetch student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let result = students;

    if (filterStatus !== "All") {
      result = result.filter((student) => student.status === filterStatus);
    }

    if (searchTerm) {
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredStudents(result);
  }, [students, searchTerm, filterStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <RefreshCw className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6 min-h-screen overflow-x-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 absolute inset-0"></div>
        {/* Decorative blurred blobs */}
        <div className="absolute top-[-80px] left-[-120px] w-[320px] h-[320px] bg-gradient-to-br from-purple-300 via-blue-200 to-transparent dark:from-purple-900 dark:via-blue-900 dark:to-transparent rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-100px] right-[-120px] w-[280px] h-[280px] bg-gradient-to-tr from-emerald-200 via-purple-100 to-transparent dark:from-emerald-900 dark:via-purple-900 dark:to-transparent rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-purple-100 via-blue-100 to-emerald-100 dark:from-purple-950 dark:via-blue-950 dark:to-emerald-950 rounded-3xl blur-[120px] opacity-20"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BarChart3
              size={32}
              className="text-purple-600 dark:text-purple-400 mr-3 drop-shadow-lg"
            />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow">
              Student Progress Tracker
            </h1>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full md:w-48 pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Not Started">Not Started</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-slate-400">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        {filteredStudents.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {filteredStudents.map((student) => (
              <StudentProgressCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 text-center text-gray-600 dark:text-slate-400">
            <p>No students match your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentProgressDashboard;
