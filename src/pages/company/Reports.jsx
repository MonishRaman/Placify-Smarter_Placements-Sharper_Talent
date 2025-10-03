import React, { useState, useEffect } from "react";
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  Filter,
  Users,
  TrendingUp,
  Building2,
  RefreshCw,
  Search,
  ChevronDown,
  Plus,
  Eye,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("last-30-days");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Mock data for demonstration
  const mockReports = [
    {
      id: 1,
      name: "Employee Performance Q4 2024",
      type: "Performance",
      status: "completed",
      createdDate: "2024-01-15",
      size: "2.4 MB",
      format: "PDF",
      department: "Engineering",
      generatedBy: "Sarah Chen",
      downloadCount: 23,
    },
    {
      id: 2,
      name: "Hiring Analytics December",
      type: "Recruitment",
      status: "completed",
      createdDate: "2024-01-10",
      size: "1.8 MB",
      format: "Excel",
      department: "HR",
      generatedBy: "John Smith",
      downloadCount: 15,
    },
    {
      id: 3,
      name: "Department Productivity Report",
      type: "Productivity",
      status: "processing",
      createdDate: "2024-01-12",
      size: "-",
      format: "PDF",
      department: "Operations",
      generatedBy: "Emily Davis",
      downloadCount: 0,
    },
    {
      id: 4,
      name: "Annual Compensation Analysis",
      type: "Financial",
      status: "failed",
      createdDate: "2024-01-08",
      size: "-",
      format: "Excel",
      department: "Finance",
      generatedBy: "Mark Johnson",
      downloadCount: 0,
    },
    {
      id: 5,
      name: "Team Collaboration Metrics",
      type: "Collaboration",
      status: "completed",
      createdDate: "2024-01-05",
      size: "3.1 MB",
      format: "PDF",
      department: "Product",
      generatedBy: "Lisa Wang",
      downloadCount: 31,
    },
  ];

  useEffect(() => {
    setReports(mockReports);
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || report.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || report.status === selectedStatus;
    const matchesDepartment =
      selectedDepartment === "all" || report.department === selectedDepartment;

    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleGenerateReport = () => {
    setLoading(true);
    // Simulate report generation
    setTimeout(() => {
      setLoading(false);
      // Add new report to the list
      const newReport = {
        id: reports.length + 1,
        name: `Custom Report ${new Date().toLocaleDateString()}`,
        type: "Custom",
        status: "processing",
        createdDate: new Date().toISOString().split("T")[0],
        size: "-",
        format: "PDF",
        department: "All",
        generatedBy: "Current User",
        downloadCount: 0,
      };
      setReports([newReport, ...reports]);
    }, 2000);
  };

  const handleDownload = (report) => {
    if (report.status === "completed") {
      // Simulate download
      console.log(`Downloading ${report.name}`);
      // Update download count
      setReports(
        reports.map((r) =>
          r.id === report.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
        )
      );
    }
  };

  const handleAction = (action, report) => {
    switch (action) {
      case "download":
        handleDownload(report);
        break;
      case "view":
        console.log(`Viewing ${report.name}`);
        break;
      case "share":
        console.log(`Sharing ${report.name}`);
        break;
      case "delete":
        setReports(reports.filter((r) => r.id !== report.id));
        break;
      default:
        break;
    }
    setDropdownOpen(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reports Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Generate, manage, and download company reports
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Generate New Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Reports",
              value: reports.length,
              icon: FileText,
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-100 dark:bg-blue-900/30",
            },
            {
              title: "Completed",
              value: reports.filter((r) => r.status === "completed").length,
              icon: CheckCircle,
              color: "from-green-500 to-green-600",
              bgColor: "bg-green-100 dark:bg-green-900/30",
            },
            {
              title: "Processing",
              value: reports.filter((r) => r.status === "processing").length,
              icon: Clock,
              color: "from-yellow-500 to-yellow-600",
              bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            },
            {
              title: "Total Downloads",
              value: reports.reduce((sum, r) => sum + r.downloadCount, 0),
              icon: Download,
              color: "from-purple-500 to-purple-600",
              bgColor: "bg-purple-100 dark:bg-purple-900/30",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`${stat.bgColor} rounded-2xl p-6 shadow-lg border border-gray-200/60 dark:border-gray-700/50`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports or departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="Performance">Performance</option>
                <option value="Recruitment">Recruitment</option>
                <option value="Productivity">Productivity</option>
                <option value="Financial">Financial</option>
                <option value="Collaboration">Collaboration</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>

              {/* Department Filter */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="Product">Product</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Reports Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generated Reports ({filteredReports.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No reports found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {searchTerm ||
                selectedType !== "all" ||
                selectedStatus !== "all" ||
                selectedDepartment !== "all"
                  ? "Try adjusting your filters or search terms."
                  : "Get started by generating your first report."}
              </p>
              <button
                onClick={handleGenerateReport}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                Generate Report
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Report Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredReports.map((report, index) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {report.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {report.format} • {report.size}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(report.status)}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              report.status
                            )}`}
                          >
                            {report.status.charAt(0).toUpperCase() +
                              report.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {report.department}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(report.createdDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {report.downloadCount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setDropdownOpen(
                                dropdownOpen === report.id ? null : report.id
                              )
                            }
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>

                          {dropdownOpen === report.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 py-2 z-50">
                              {report.status === "completed" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAction("download", report)
                                    }
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </button>
                                  <button
                                    onClick={() => handleAction("view", report)}
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAction("share", report)
                                    }
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleAction("delete", report)}
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Report Activity
          </h3>
          <div className="space-y-3">
            {reports.slice(0, 3).map((report) => (
              <div
                key={`activity-${report.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(report.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {report.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Generated by {report.generatedBy} •{" "}
                      {new Date(report.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {report.status === "completed" && (
                  <button
                    onClick={() => handleDownload(report)}
                    className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;
