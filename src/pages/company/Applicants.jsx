import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaEllipsisV } from "react-icons/fa";

const ApplicantsTracker = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const rowRefs = useRef({}); // ref per row for positioning

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      // if click inside any row container containing the open dropdown, ignore
      const isInside = Object.values(rowRefs.current).some(
        (node) => node && node.contains(e.target)
      );
      if (!isInside) setDropdownOpen(null);
    };
    document.addEventListener("pointerdown", onDocClick, { passive: true });
    return () => document.removeEventListener("pointerdown", onDocClick);
  }, []);

  // DATA
  const stats = [
    { label: "Total Applicants", value: 124, color: "from-blue-500 to-cyan-500" },
    { label: "Shortlisted", value: 58, color: "from-green-500 to-emerald-500" },
    { label: "Interviewed", value: 36, color: "from-purple-500 to-pink-500" },
    { label: "Hired", value: 18, color: "from-orange-500 to-yellow-500" },
  ];

  const applicants = [
    { id: 1, name: "John Doe", role: "Frontend Developer", status: "Shortlisted", date: "2023-06-01" },
    { id: 2, name: "Jane Smith", role: "Backend Developer", status: "Interviewed", date: "2023-06-05" },
    { id: 3, name: "Michael Brown", role: "UI/UX Designer", status: "Hired", date: "2023-06-10" },
    { id: 4, name: "Emily Davis", role: "Fullstack Developer", status: "Shortlisted", date: "2023-06-12" },
  ];

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesStatus = selectedStatus === "All" || applicant.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      applicant.name.toLowerCase().includes(q) || applicant.role.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleAction = (action, applicant) => {
    alert(`${action} clicked for ${applicant.name}`);
    setDropdownOpen(null);
  };

  // Computes dropdown placement (open up if near bottom)
  const getDropdownPlacement = (index) => {
    const node = rowRefs.current[index];
    if (!node) return { openUp: false, maxHeight: 240 };

    const rect = node.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const desiredHeight = 160; // estimated dropdown height
    const openUp = spaceBelow < desiredHeight && spaceAbove > spaceBelow;

    // Cap menu height to available space
    const maxHeight = Math.max(
      120,
      Math.floor((openUp ? spaceAbove - 16 : spaceBelow - 16))
    );

    return { openUp, maxHeight };
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="flex-grow p-4 md:p-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Applicants Tracker
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className={`bg-gradient-to-r ${stat.color} rounded-2xl p-4 shadow-md`}
            >
              <p className="text-white text-sm">{stat.label}</p>
              <h2 className="text-white text-2xl font-bold">{stat.value}</h2>
            </motion.div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 gap-3 flex-wrap">
          {/* Search */}
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>

          {/* Status Buttons */}
          <div className="flex gap-2 flex-wrap">
            {["All", "Shortlisted", "Interviewed", "Hired"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          {/* Ensure horizontal scroll only; avoid vertical overflow that triggers scrollbar growth */}
          <div className="w-full overflow-x-auto overflow-y-visible">
            <table className="w-full min-w-[520px] table-auto border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  {["Name", "Role", "Status", "Applied On", "Actions"].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant, index) => {
                  const isOpen = dropdownOpen === index;
                  const { openUp, maxHeight } = isOpen ? getDropdownPlacement(index) : { openUp: false, maxHeight: 240 };

                  return (
                    <motion.tr
                      key={applicant.id}
                      ref={(el) => (rowRefs.current[index] = el)}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-200 whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
                        {applicant.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap max-w-[240px] overflow-hidden text-ellipsis">
                        {applicant.role}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            applicant.status === "Shortlisted"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : applicant.status === "Interviewed"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                              : applicant.status === "Hired"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {applicant.date}
                      </td>

                      {/* Actions + Dropdown with smart placement */}
                      <td className="px-4 py-3 text-right relative">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setDropdownOpen(isOpen ? null : index)}
                            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                            aria-haspopup="menu"
                            aria-expanded={isOpen}
                          >
                            <FaEllipsisV />
                          </button>

                          {isOpen && (
                            <div
                              role="menu"
                              className={`absolute right-0 ${openUp ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"} w-44
                                          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 whitespace-nowrap
                                          will-change-transform overflow-auto`}
                              style={{
                                transformOrigin: openUp ? "bottom right" : "top right",
                                maxHeight: `${maxHeight}px`,
                              }}
                            >
                              {["Resume", "Profile", "Delete"].map((action) => (
                                <button
                                  key={action}
                                  onClick={() => handleAction(action, applicant)}
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  role="menuitem"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default ApplicantsTracker;
