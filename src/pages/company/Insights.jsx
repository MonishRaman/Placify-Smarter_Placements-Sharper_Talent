import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  Clock,
  Target,
  Award,
  Building,
  GraduationCap,
  Briefcase,
  Download,
  FileDown,
} from "lucide-react";
import ExportModal from "../../components/ExportModal";
import { useInsightsExport } from "../../hooks/useInsightsExport";

const Insights = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("3M");

  // Mock data for different time ranges
  const allTimeRangeData = {
    "1M": {
      monthlyInterviews: [
        { month: "Week 1", interviews: 125, placements: 98, success_rate: 78 },
        { month: "Week 2", interviews: 143, placements: 117, success_rate: 82 },
        { month: "Week 3", interviews: 156, placements: 122, success_rate: 78 },
        { month: "Week 4", interviews: 134, placements: 109, success_rate: 81 },
      ],
      totalInterviews: "558",
      totalPlacements: "446",
      avgScore: "8.2/10",
      partnerCompanies: "89",
      growth: { interviews: 8.5, placements: 12.3, score: 3.8, companies: 5.2 },
    },
    "3M": {
      monthlyInterviews: [
        { month: "Jan", interviews: 245, placements: 189, success_rate: 77 },
        { month: "Feb", interviews: 312, placements: 234, success_rate: 75 },
        { month: "Mar", interviews: 428, placements: 356, success_rate: 83 },
      ],
      totalInterviews: "985",
      totalPlacements: "779",
      avgScore: "8.0/10",
      partnerCompanies: "127",
      growth: {
        interviews: 15.3,
        placements: 12.8,
        score: 5.2,
        companies: 8.9,
      },
    },
    "6M": {
      monthlyInterviews: [
        { month: "Jan", interviews: 245, placements: 189, success_rate: 77 },
        { month: "Feb", interviews: 312, placements: 234, success_rate: 75 },
        { month: "Mar", interviews: 428, placements: 356, success_rate: 83 },
        { month: "Apr", interviews: 389, placements: 298, success_rate: 77 },
        { month: "May", interviews: 502, placements: 421, success_rate: 84 },
        { month: "Jun", interviews: 467, placements: 378, success_rate: 81 },
      ],
      totalInterviews: "2,343",
      totalPlacements: "1,876",
      avgScore: "8.1/10",
      partnerCompanies: "167",
      growth: {
        interviews: 22.1,
        placements: 18.7,
        score: 7.3,
        companies: 12.4,
      },
    },
    "1Y": {
      monthlyInterviews: [
        { month: "Q1", interviews: 985, placements: 779, success_rate: 79 },
        { month: "Q2", interviews: 1358, placements: 1097, success_rate: 81 },
        { month: "Q3", interviews: 1542, placements: 1234, success_rate: 80 },
        { month: "Q4", interviews: 1689, placements: 1377, success_rate: 82 },
      ],
      totalInterviews: "5,574",
      totalPlacements: "4,487",
      avgScore: "7.9/10",
      partnerCompanies: "234",
      growth: {
        interviews: 34.6,
        placements: 28.9,
        score: 12.1,
        companies: 24.8,
      },
    },
  };

  const currentData = useMemo(
    () => allTimeRangeData[selectedTimeRange],
    [selectedTimeRange]
  );

  // Initialize export functionality with current data
  const {
    isExporting,
    exportModalOpen,
    setExportModalOpen,
    handleExport,
    quickExportPDF,
  } = useInsightsExport(currentData, selectedTimeRange);

  const skillDistribution = [
    { name: "Full Stack", value: 28, count: 142 },
    { name: "Data Science", value: 22, count: 111 },
    { name: "Frontend", value: 18, count: 91 },
    { name: "Backend", value: 15, count: 76 },
    { name: "DevOps", value: 10, count: 51 },
    { name: "Mobile Dev", value: 7, count: 35 },
  ];

  const collegePerformance = [
    { college: "IIT Delhi", students: 89, placed: 82, avg_score: 8.7 },
    { college: "NIT Trichy", students: 76, placed: 68, avg_score: 8.3 },
    { college: "BITS Pilani", students: 64, placed: 58, avg_score: 8.1 },
    { college: "VIT Vellore", students: 95, placed: 79, avg_score: 7.9 },
    { college: "SRM Chennai", students: 102, placed: 81, avg_score: 7.6 },
    { college: "Manipal", students: 58, placed: 44, avg_score: 7.4 },
  ];

  const interviewMetrics = [
    { category: "Technical", avg_score: 7.8 },
    { category: "Communication", avg_score: 8.2 },
    { category: "Problem Solving", avg_score: 7.5 },
    { category: "Confidence", avg_score: 8.0 },
    { category: "Body Language", avg_score: 7.9 },
  ];

  const dailyActivity = [
    { day: "Mon", interviews: 45, feedback_given: 42 },
    { day: "Tue", interviews: 52, feedback_given: 48 },
    { day: "Wed", interviews: 38, feedback_given: 36 },
    { day: "Thu", interviews: 61, feedback_given: 58 },
    { day: "Fri", interviews: 49, feedback_given: 45 },
    { day: "Sat", interviews: 28, feedback_given: 26 },
    { day: "Sun", interviews: 15, feedback_given: 14 },
  ];

  const COLORS = [
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#6366f1",
  ];

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </p>
          <p
            className={`text-sm flex items-center ${
              change >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            {change >= 0 ? "+" : ""}
            {change}% vs last month
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="p-6 w-full h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Company Insights</h1> */}
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive analytics for your placement ecosystem
              </p>
            </div>

            {/* Export Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => quickExportPDF("Your Company")}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown className="h-4 w-4" />
                <span>
                  {isExporting ? "Generating..." : "Quick Export PDF"}
                </span>
              </button>

              <button
                onClick={() => setExportModalOpen(true)}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                <span>Custom Export</span>
              </button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="mb-6 flex space-x-2">
            {["1M", "3M", "6M", "1Y"].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedTimeRange === range
                    ? "bg-purple-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Interviews"
              value={currentData.totalInterviews}
              change={currentData.growth.interviews}
              icon={Users}
              color="bg-purple-600"
            />
            <StatCard
              title="Successful Placements"
              value={currentData.totalPlacements}
              change={currentData.growth.placements}
              icon={Award}
              color="bg-green-600"
            />
            <StatCard
              title="Average Score"
              value={currentData.avgScore}
              change={currentData.growth.score}
              icon={Target}
              color="bg-blue-600"
            />
            <StatCard
              title="Partner Companies"
              value={currentData.partnerCompanies}
              change={currentData.growth.companies}
              icon={Building}
              color="bg-orange-600"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trends */}
            <div
              id="interview-trends-chart"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Interview & Placement Trends ({selectedTimeRange})
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={currentData.monthlyInterviews}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.3}
                  />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="interviews"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="placements"
                    stroke="#10b981"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Skill Distribution */}
            <div
              id="skills-distribution-chart"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Skills in Demand
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value}%)`}
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* College Performance */}
            <div
              id="college-performance-chart"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Top Performing Colleges
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={collegePerformance}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="college"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="placed" fill="#8b5cf6" />
                  <Bar dataKey="students" fill="#e0e7ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Interview Categories Performance */}
            <div
              id="performance-categories-chart"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Performance by Category
              </h3>
              <div className="space-y-4">
                {interviewMetrics.map((metric, index) => (
                  <div key={metric.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {metric.category}
                      </span>
                      <span className="text-sm font-bold">
                        {metric.avg_score}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0
                            ? "bg-purple-500"
                            : index === 1
                            ? "bg-blue-500"
                            : index === 2
                            ? "bg-green-500"
                            : index === 3
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${(metric.avg_score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Weekly Activity and Success Rate */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Activity */}
            <div
              id="weekly-activity-chart"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Weekly Interview Activity
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dailyActivity}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.3}
                  />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="interviews"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="feedback_given"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Success Rate Trend */}
            <div
              id="success-rate-chart"
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Placement Success Rate ({selectedTimeRange})
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={currentData.monthlyInterviews}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.3}
                  />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis domain={[70, 90]} stroke="#6B7280" />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Success Rate"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="success_rate"
                    stroke="#10b981"
                    strokeWidth={4}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            id="quick-stats-section"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
              <Clock className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-2">
                Average Interview Time
              </h4>
              <p className="text-3xl font-bold text-purple-600">18 mins</p>
              <p className="text-sm">3 mins faster than traditional</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
              <GraduationCap className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-2">
                Student Satisfaction
              </h4>
              <p className="text-3xl font-bold text-green-600">4.7/5</p>
              <p className="text-sm">Based on 1,234 feedbacks</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
              <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-2">Recruiter NPS</h4>
              <p className="text-3xl font-bold text-blue-600">+68</p>
              <p className="text-sm">Excellent recommendation rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
        isExporting={isExporting}
      />
    </div>
  );
};

export default Insights;
