import React from 'react';
import {
  CalendarDays,
  MapPin,
  Building2,
  BadgeCheck,
} from "lucide-react";

const JobCard = ({ job, getImageUrl, formatDate }) => {
  if (!job) return null;

  return (
    <div className="group bg-white/90 dark:bg-slate-800/80 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-slate-700 overflow-hidden transform hover:-translate-y-2">
      <div className="p-8">
        {/* Top Section */}
        <div className="flex items-start gap-6 mb-6">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center border border-white/50 dark:border-slate-600/50 shadow-md overflow-hidden">
              {getImageUrl && getImageUrl(job.company?.profileImage) ? (
                <img
                  src={getImageUrl(job.company.profileImage)}
                  alt={`${job.company.name} logo`}
                  className="w-14 h-14 rounded-xl object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`${
                  getImageUrl && getImageUrl(job.company?.profileImage) ? 'hidden' : 'flex'
                } items-center justify-center w-12 h-12`}
              >
                <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 truncate">
              {job.title || "Job Title"}
            </h3>
            <p className="text-base font-semibold text-gray-600 dark:text-gray-400 mb-2 truncate">
              {job.company?.name || "Company Name"}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
              {job.description || "No description available"}
            </p>
          </div>
        </div>

        {/* Job Meta Info as Clean Tags */}
        <div className="flex flex-wrap gap-3 mb-6 text-sm">
          <span className="px-3 py-1 rounded-full font-medium bg-blue-50 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300 border border-blue-200/60 dark:border-blue-600/40 flex items-center gap-1 shadow-sm">
            <MapPin className="w-4 h-4" />
            {job.location || "Remote"}
          </span>

          <span className="px-3 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-700/20 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-600/40 flex items-center gap-1 shadow-sm">
            <CalendarDays className="w-4 h-4" />
            {formatDate ? formatDate(job.createdAt) : "N/A"}
          </span>

          <span className="px-3 py-1 rounded-full font-medium bg-rose-50 text-rose-700 dark:bg-rose-700/20 dark:text-rose-300 border border-rose-200/60 dark:border-rose-600/40 flex items-center gap-1 shadow-sm">
            💸 {job.salary || "Not disclosed"}
          </span>

          <span className="px-3 py-1 rounded-full font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-700/20 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-600/40 shadow-sm">
            {job.type || "Full-time"}
          </span>

          <span className="px-3 py-1 rounded-full font-medium bg-pink-50 text-pink-700 dark:bg-pink-700/20 dark:text-pink-300 border border-pink-200/60 dark:border-pink-600/40 shadow-sm">
            {job.domain || "Technology"}
          </span>

          <span
            className={`px-3 py-1 rounded-full font-medium shadow-sm border ${
              job.status === "Open"
                ? "bg-green-50 text-green-700 dark:bg-green-700/20 dark:text-green-300 border-green-200/60 dark:border-green-600/40"
                : "bg-red-50 text-red-700 dark:bg-red-700/20 dark:text-red-300 border-red-200/60 dark:border-red-600/40"
            }`}
          >
            {job.status || "Status"}
          </span>
        </div>

        {/* Apply Button */}
        <div className="flex">
          <button className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-transform transform hover:scale-[1.02] active:scale-[0.98] shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-900">
            <span className="inline-flex items-center gap-2">
              Apply Now
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
