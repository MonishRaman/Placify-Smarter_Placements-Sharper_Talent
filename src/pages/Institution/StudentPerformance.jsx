import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const StudentPerformance = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data - Replace with actual API call
  useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        name: "Alice Johnson",
        studentId: "STU2024001",
        email: "alice.johnson@email.com",
        department: "Computer Science",
        interviewStatus: "completed",
        interviewDate: "2024-08-05",
        scheduledDate: "2024-08-05",
        performance: {
          overallScore: 85,
          technicalScore: 90,
          communicationScore: 80,
          problemSolvingScore: 88,
          feedback:
            "Excellent technical skills and good problem-solving approach. Communication can be improved.",
          result: "pass",
          interviewer: "Dr. Smith",
          duration: "45 mins",
        },
        registrationDate: "2024-07-15",
      },
      {
        id: 2,
        name: "Bob Martinez",
        studentId: "STU2024002",
        email: "bob.martinez@email.com",
        department: "Mechanical Engineering",
        interviewStatus: "attending",
        interviewDate: "2024-08-11",
        scheduledDate: "2024-08-11",
        performance: {
          overallScore: null,
          technicalScore: null,
          communicationScore: null,
          problemSolvingScore: null,
          feedback: "Interview in progress",
          result: "pending",
          interviewer: "Prof. Wilson",
          duration: "Ongoing",
        },
        registrationDate: "2024-07-20",
      },
      {
        id: 3,
        name: "Carol Davis",
        studentId: "STU2024003",
        email: "carol.davis@email.com",
        department: "Computer Science",
        interviewStatus: "scheduled",
        interviewDate: "2024-08-15",
        scheduledDate: "2024-08-15",
        performance: {
          overallScore: null,
          technicalScore: null,
          communicationScore: null,
          problemSolvingScore: null,
          feedback: "Interview scheduled for tomorrow",
          result: "pending",
          interviewer: "Dr. Brown",
          duration: "Not started",
        },
        registrationDate: "2024-07-25",
      },
      {
        id: 4,
        name: "David Wilson",
        studentId: "STU2024004",
        email: "david.wilson@email.com",
        department: "Electrical Engineering",
        interviewStatus: "completed",
        interviewDate: "2024-08-08",
        scheduledDate: "2024-08-08",
        performance: {
          overallScore: 65,
          technicalScore: 70,
          communicationScore: 75,
          problemSolvingScore: 50,
          feedback:
            "Good communication skills but needs improvement in problem-solving and technical depth.",
          result: "fail",
          interviewer: "Dr. Johnson",
          duration: "40 mins",
        },
        registrationDate: "2024-07-18",
      },
      {
        id: 5,
        name: "Eva Chen",
        studentId: "STU2024005",
        email: "eva.chen@email.com",
        department: "Computer Science",
        interviewStatus: "completed",
        interviewDate: "2024-08-03",
        scheduledDate: "2024-08-03",
        performance: {
          overallScore: 92,
          technicalScore: 95,
          communicationScore: 88,
          problemSolvingScore: 94,
          feedback:
            "Outstanding performance across all areas. Strong candidate with excellent technical and communication skills.",
          result: "pass",
          interviewer: "Dr. Smith",
          duration: "50 mins",
        },
        registrationDate: "2024-07-10",
      },
    ];

    // Simulate API loading
    setTimeout(() => {
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter students based on search and filters
  useEffect(() => {
    let filtered = students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || student.interviewStatus === statusFilter;
      const matchesDepartment =
        departmentFilter === "all" || student.department === departmentFilter;

      // Simple date filtering
      let matchesDate = true;
      if (dateFilter !== "all") {
        const interviewDate = new Date(student.interviewDate);
        const today = new Date();
        const daysDiff = Math.floor(
          (today - interviewDate) / (1000 * 60 * 60 * 24)
        );

        if (dateFilter === "today") matchesDate = daysDiff === 0;
        else if (dateFilter === "week") matchesDate = daysDiff <= 7;
        else if (dateFilter === "month") matchesDate = daysDiff <= 30;
      }

      return matchesSearch && matchesStatus && matchesDepartment && matchesDate;
    });

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilter, departmentFilter, dateFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Completed",
      },
      attending: {
        color: "bg-blue-100 text-blue-800",
        icon: Clock,
        text: "Attending",
      },
      scheduled: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Calendar,
        text: "Scheduled",
      },
    };

    const config = statusConfig[status] || statusConfig.scheduled;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getResultBadge = (result) => {
    if (result === "pass") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Pass
        </span>
      );
    } else if (result === "fail") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Fail
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setShowModal(false);
  };

  const exportData = () => {
    // Simple CSV export
    const headers = [
      "Student ID",
      "Name",
      "Department",
      "Status",
      "Interview Date",
      "Overall Score",
      "Result",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredStudents.map((student) =>
        [
          student.studentId,
          student.name,
          student.department,
          student.interviewStatus,
          student.interviewDate,
          student.performance.overallScore || "N/A",
          student.performance.result,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_performance.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">
            Loading student performance data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-none">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <p className="text-gray-600 text-sm sm:text-base">
            Monitor and track student interview performance and results
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <User className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
              <div className="ml-3 lg:ml-4 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">
                  Total Students
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {students.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-green-600 flex-shrink-0" />
              <div className="ml-3 lg:ml-4 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">
                  Completed
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {
                    students.filter((s) => s.interviewStatus === "completed")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-600 flex-shrink-0" />
              <div className="ml-3 lg:ml-4 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">
                  Pass Rate
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {Math.round(
                    (students.filter((s) => s.performance.result === "pass")
                      .length /
                      students.filter((s) => s.interviewStatus === "completed")
                        .length) *
                      100
                  ) || 0}
                  %
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <Award className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600 flex-shrink-0" />
              <div className="ml-3 lg:ml-4 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">
                  Avg Score
                </p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">
                  {Math.round(
                    students
                      .filter((s) => s.performance.overallScore)
                      .reduce((acc, s) => acc + s.performance.overallScore, 0) /
                      students.filter((s) => s.performance.overallScore).length
                  ) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-4 lg:mb-6">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <div className="flex flex-col space-y-4 lg:flex-row lg:flex-wrap lg:gap-4 lg:space-y-0">
              {/* Search */}
              <div className="flex-1 min-w-0 lg:min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 lg:space-x-4">
                {/* Status Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm min-w-0 sm:min-w-32"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="attending">Attending</option>
                  <option value="completed">Completed</option>
                </select>

                {/* Department Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm min-w-0 sm:min-w-40"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>
                  <option value="Electrical Engineering">
                    Electrical Engineering
                  </option>
                </select>

                {/* Date Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm min-w-0 sm:min-w-32"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={exportData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2 text-sm min-w-0 sm:min-w-max"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="hidden md:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden sm:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interview Date
                  </th>
                  <th className="hidden lg:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="hidden lg:table-cell px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-3 lg:px-6 py-4">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {student.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {student.studentId}
                        </div>
                        <div className="text-xs text-gray-500 truncate md:hidden">
                          {student.department}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {new Date(student.interviewDate).toLocaleDateString()}
                        </div>
                        {student.performance.overallScore && (
                          <div className="lg:hidden mt-1">
                            <span
                              className={`text-xs font-medium ${getScoreColor(
                                student.performance.overallScore
                              )}`}
                            >
                              {student.performance.overallScore}/100
                            </span>
                            <span className="ml-2">
                              {getResultBadge(student.performance.result)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 lg:px-6 py-4 text-sm text-gray-900">
                      <div className="truncate max-w-32 lg:max-w-none">
                        {student.department}
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4">
                      {getStatusBadge(student.interviewStatus)}
                    </td>
                    <td className="hidden sm:table-cell px-3 lg:px-6 py-4 text-sm text-gray-900">
                      {new Date(student.interviewDate).toLocaleDateString()}
                    </td>
                    <td className="hidden lg:table-cell px-3 lg:px-6 py-4">
                      {student.performance.overallScore ? (
                        <span
                          className={`text-sm font-medium ${getScoreColor(
                            student.performance.overallScore
                          )}`}
                        >
                          {student.performance.overallScore}/100
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-3 lg:px-6 py-4">
                      {getResultBadge(student.performance.result)}
                    </td>
                    <td className="px-3 lg:px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => openModal(student)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 lg:py-12">
              <User className="mx-auto h-8 w-8 lg:h-12 lg:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No students found
              </h3>
              <p className="mt-1 text-xs lg:text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
            <div className="relative top-4 sm:top-8 lg:top-20 mx-auto p-4 lg:p-5 border w-full max-w-xs sm:max-w-lg lg:max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-4 lg:mb-6">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 pr-4">
                    {selectedStudent.name} - Performance Details
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5 lg:w-6 lg:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">
                      Student Information
                    </h4>
                    <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
                      <p>
                        <span className="font-medium">Student ID:</span>{" "}
                        {selectedStudent.studentId}
                      </p>
                      <p className="break-all">
                        <span className="font-medium">Email:</span>{" "}
                        {selectedStudent.email}
                      </p>
                      <p>
                        <span className="font-medium">Department:</span>{" "}
                        {selectedStudent.department}
                      </p>
                      <p>
                        <span className="font-medium">Registration Date:</span>{" "}
                        {new Date(
                          selectedStudent.registrationDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">
                      Interview Information
                    </h4>
                    <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
                      <p className="flex items-center space-x-2">
                        <span className="font-medium">Status:</span>{" "}
                        {getStatusBadge(selectedStudent.interviewStatus)}
                      </p>
                      <p>
                        <span className="font-medium">Scheduled Date:</span>{" "}
                        {new Date(
                          selectedStudent.scheduledDate
                        ).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Interviewer:</span>{" "}
                        {selectedStudent.performance.interviewer}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {selectedStudent.performance.duration}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                {selectedStudent.performance.overallScore && (
                  <div className="mb-4 lg:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">
                      Performance Metrics
                    </h4>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                      <div className="bg-blue-50 p-3 lg:p-4 rounded-lg text-center">
                        <div
                          className={`text-lg lg:text-2xl font-bold ${getScoreColor(
                            selectedStudent.performance.overallScore
                          )}`}
                        >
                          {selectedStudent.performance.overallScore}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-600">
                          Overall Score
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 lg:p-4 rounded-lg text-center">
                        <div
                          className={`text-lg lg:text-2xl font-bold ${getScoreColor(
                            selectedStudent.performance.technicalScore
                          )}`}
                        >
                          {selectedStudent.performance.technicalScore}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-600">
                          Technical
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-3 lg:p-4 rounded-lg text-center">
                        <div
                          className={`text-lg lg:text-2xl font-bold ${getScoreColor(
                            selectedStudent.performance.communicationScore
                          )}`}
                        >
                          {selectedStudent.performance.communicationScore}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-600">
                          Communication
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 lg:p-4 rounded-lg text-center">
                        <div
                          className={`text-lg lg:text-2xl font-bold ${getScoreColor(
                            selectedStudent.performance.problemSolvingScore
                          )}`}
                        >
                          {selectedStudent.performance.problemSolvingScore}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-600">
                          Problem Solving
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Result and Feedback */}
                <div className="mb-4 lg:mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">
                    Result & Feedback
                  </h4>
                  <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                      <span className="font-medium text-sm lg:text-base">
                        Final Result:
                      </span>
                      {getResultBadge(selectedStudent.performance.result)}
                    </div>
                    <div>
                      <span className="font-medium text-sm lg:text-base">
                        Interviewer Feedback:
                      </span>
                      <p className="mt-1 lg:mt-2 text-xs lg:text-sm text-gray-700 break-words">
                        {selectedStudent.performance.feedback}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-3 lg:px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm lg:text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPerformance;
