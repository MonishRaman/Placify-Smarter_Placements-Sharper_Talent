import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft, Trophy, Clock, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentProgressDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/students/${studentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }
        const data = await response.json();
        setStudent(data);
      } catch (e) {
        setError('Failed to fetch student details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, [studentId]);

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
          <button
            onClick={() => navigate(-1)}
            className="mt-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          {student && (
            <>
              <h1 className="text-4xl font-extrabold mb-2">{student.name}</h1>
              <p className="text-xl text-gray-600 dark:text-slate-400">{student.email}</p>
            </>
          )}
        </motion.div>

        {student && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Progress and Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Trophy size={24} className="text-yellow-500" /> Overall Score</h2>
              <div className="flex justify-between items-center mb-4">
                <span className="text-6xl font-extrabold text-blue-600 dark:text-blue-400">{student.lastScore}</span>
                <div className="text-right">
                  <p className="text-lg font-semibold">Last Interview</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{student.lastInterview}</p>
                </div>
              </div>
              <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${student.progress}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full ${student.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                ></motion.div>
              </div>
              <p className="mt-2 text-right text-sm text-gray-600 dark:text-slate-300 font-medium">
                {student.progress}% of interviews completed
              </p>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
            >
              <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
              <ul className="space-y-4">
                {student.metrics.map((metric, index) => (
                  <li key={index} className="flex items-center gap-4">
                    <div className="text-purple-600 dark:text-purple-400 flex-shrink-0">
                      {/* Render icons based on the string name */}
                      {metric.icon === 'Zap' && <Zap size={20} />}
                      {metric.icon === 'Star' && <Star size={20} />}
                      {metric.icon === 'Clock' && <Clock size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{metric.name}</p>
                        <span className="text-sm font-bold text-gray-700 dark:text-white">{metric.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 1 }}
                          className="bg-purple-500 h-full rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}

        {student && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-slate-700"
          >
            <h2 className="text-2xl font-bold mb-4">Feedback & Suggestions</h2>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
              "{student.feedback}"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressDetail;
