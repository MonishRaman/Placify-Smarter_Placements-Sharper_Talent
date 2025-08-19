import React, { useState, useEffect } from 'react';
import { Search, BarChart3, UserCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StudentProgressCard = ({ student }) => {
  const navigate = useNavigate();
  const progressColor =
    student.status === 'Completed'
      ? 'bg-emerald-500'
      : student.progress > 0
      ? 'bg-sky-500'
      : 'bg-gray-400';

  const handleClick = () => {
    navigate(`/dashboard/progress/${student.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-6 flex flex-col justify-between transform hover:-translate-y-1 border border-gray-200 dark:border-slate-700 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full mr-4">
          <UserCircle size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{student.name}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">{student.email}</p>
        </div>
      </div>
      <div className="w-full mb-3">
        <p className="text-sm font-semibold text-gray-600 dark:text-slate-300 mb-1">
          Interview Progress
        </p>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${progressColor} text-white`}>
                {student.status}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-gray-600 dark:text-slate-300">
                {student.progress}%
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-slate-700">
              <div
                style={{ width: `${student.progress}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progressColor}`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StudentProgressDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/students/progress'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStudents(data);
      } catch (e) {
        setError('Failed to fetch student data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    let result = students;

    if (filterStatus !== 'All') {
      result = result.filter(student => student.status === filterStatus);
    }

    if (searchTerm) {
      result = result.filter(student =>
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
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <BarChart3 size={32} className="text-purple-600 dark:text-purple-400 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Progress Tracker</h1>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full md:w-48 pl-4 pr-10 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map(student => (
            <StudentProgressCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center p-12 text-center text-gray-600 dark:text-slate-400">
          <p>No students match your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};
export default StudentProgressDashboard;
