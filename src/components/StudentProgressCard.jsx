import React from 'react';
import { UserCircle } from 'lucide-react';
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

export default StudentProgressCard;
