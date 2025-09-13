import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Calculator,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  Target,
  BookOpen,
  Search,
  Moon,
  Sun,
  Star,
  Zap,
  Award,
  TrendingUp,
  Users,
  ChevronRight,
  Settings,
  HelpCircle,
  Lightbulb,
  Timer,
  BarChart3,
  PieChart,
  Activity,
  Gauge,
  Play,
  Calendar,
  FileText,
  Upload,
  AlertTriangle,
  User,
  GraduationCap,
  Briefcase,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  ExternalLink,
  RefreshCw,
  Filter,
  Download,
  Share2,
  Bell,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

// NEW: A custom hook to detect clicks outside the notification panel
const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

// NEW: The NotificationPanel component
const NotificationPanel = ({ notifications, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border dark:border-gray-700 z-50"
    >
      <div className="p-4 border-b dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h4>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{notif.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{notif.description}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You're all caught up! 🎉</p>
          </div>
        )}
      </div>
      <div className="p-2 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700 text-center">
        <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">
          View all notifications
        </button>
      </div>
    </motion.div>
  );
};

const StudentDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [activeSection, setActiveSection] = useState("overview");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // NEW: Mock notification data (replace with real data later)
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Resume Score!", description: "Your ATS score improved to 85%. Great job!", time: "2 hours ago" },
    { id: 2, title: "Upcoming Interview", description: "Your technical interview is scheduled for tomorrow at 2 PM.", time: "1 day ago" },
    { id: 3, title: "Weekly Goal Met", description: "You've completed your weekly goal of 50 aptitude questions.", time: "3 days ago" },
  ]);

  // NEW: Ref for the notification area to detect outside clicks
  const notificationRef = useRef();
  useOnClickOutside(notificationRef, () => setIsNotificationsOpen(false));

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) setIsDarkMode(savedTheme === "dark");
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(() => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme && (savedTheme === "dark") !== isDarkMode) {
        setIsDarkMode(savedTheme === "dark");
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [isDarkMode]);

  const dashboardData = {
    aptitude: {
      totalQuestions: 156,
      correctAnswers: 124,
      accuracy: 79.5,
      streak: 12,
      recentTests: [
        { id: 1, category: "Quantitative", score: 85, date: "2024-01-15", duration: "45m" },
        { id: 2, category: "Logical Reasoning", score: 78, date: "2024-01-14", duration: "38m" },
        { id: 3, category: "Verbal", score: 92, date: "2024-01-13", duration: "32m" },
      ],
      weakAreas: ["Data Interpretation", "Probability"],
      strongAreas: ["Arithmetic", "Reading Comprehension"],
      weeklyProgress: 34,
      weeklyGoal: 50,
    },
    interviews: {
      totalSessions: 8,
      avgScore: 7.2,
      lastScore: 7.5,
      improvement: "+0.8",
      scheduledSessions: [
        { id: 1, date: "2024-01-20", time: "14:00", type: "Technical" },
        { id: 2, date: "2024-01-22", time: "10:00", type: "Behavioral" },
      ],
      strengths: ["Technical Knowledge", "Communication", "Problem Solving"],
      improvements: ["Specific Examples", "Enthusiasm", "Follow-up Questions"],
      recentFeedback: [
        { session: "Technical Interview", score: 7.5, date: "2024-01-15" },
        { session: "HR Round", score: 8.2, date: "2024-01-12" },
        { session: "Behavioral", score: 6.8, date: "2024-01-10" },
      ],
    },
    resume: {
      lastScore: 75,
      previousScore: 68,
      totalScans: 12,
      lastUpdated: "2024-01-15",
      issues: [
        "Add more quantifiable achievements",
        "Include industry keywords",
        "Improve section formatting",
      ],
      strengths: [
        "Good contact information",
        "Clear work experience",
        "Relevant skills listed",
      ],
      keywordMatch: 65,
      atsCompatibility: 85,
    },
  };

  const overallMetrics = {
    studyScore: Math.round(
      (dashboardData.aptitude.accuracy + dashboardData.interviews.avgScore * 10 + dashboardData.resume.lastScore) / 3
    ),
    weeklyActivity: dashboardData.aptitude.weeklyProgress + dashboardData.interviews.totalSessions,
    improvementTrend: "+12%",
    ranking: "Advanced",
  };

  const themeClasses = isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses} overflow-x-hidden`}>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar (Menu) */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg z-60 overflow-hidden transform transition-transform duration-300 ease-in-out sm:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Menu</h3>
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-3">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "resume", label: "Resume Analysis", icon: FileText },
            { id: "goals", label: "Goals & Progress", icon: Target },
            { id: "analytics", label: "Analytics", icon: TrendingUp },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Container */}
      <div className="relative z-0 ml-0">
        {/* Navigation Header */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Dashboard</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  Monitor your aptitude, interview, and resume performance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* NEW: Updated Notification Bell section */}
              <div ref={notificationRef} className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  aria-label="Toggle notifications"
                  className="p-1 rounded-full text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                     <div className="absolute -top-0 -right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </button>
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <NotificationPanel notifications={notifications} onClose={() => setIsNotificationsOpen(false)} />
                  )}
                </AnimatePresence>
              </div>
              
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                <RefreshCw className="w-4 h-4" />
                Sync Data
              </button>
              <button
                className="sm:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          <nav className="hidden sm:flex sm:space-x-1">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "resume", label: "Resume Analysis", icon: FileText },
              { id: "goals", label: "Goals & Progress", icon: Target },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 max-w-7xl mx-auto ml-0">
          {activeSection === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Trophy className="w-6 sm:w-8 h-6 sm:h-8" />
                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                      <ArrowUp className="w-4 h-4" />
                      {overallMetrics.improvementTrend}
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">{overallMetrics.studyScore}/100</h3>
                  <p className="text-blue-100 text-xs sm:text-sm">Overall Score</p>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Activity className="w-6 sm:w-8 h-6 sm:h-8" />
                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                      <ArrowUp className="w-4 h-4" />
                      +15%
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">{overallMetrics.weeklyActivity}</h3>
                  <p className="text-green-100 text-xs sm:text-sm">Weekly Activity</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Star className="w-6 sm:w-8 h-6 sm:h-8" />
                    <div className="text-xs sm:text-sm">Rank #47</div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">{overallMetrics.ranking}</h3>
                  <p className="text-purple-100 text-xs sm:text-sm">Current Level</p>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 sm:p-6 text-white">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Target className="w-6 sm:w-8 h-6 sm:h-8" />
                    <div className="flex items-center gap-1 text-xs sm:text-sm">
                      <ArrowUp className="w-4 h-4" />
                      +5 pts
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-1">{dashboardData.resume.lastScore}%</h3>
                  <p className="text-orange-100 text-xs sm:text-sm">ATS Score</p>
                </div>
              </div>

              {/* Recent Activity & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold">Recent Activity</h3>
                    <select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                    </select>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">Completed Verbal Reasoning Test</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Scored 92% - Your best performance yet!
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">2h ago</span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">Mock Interview Session</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Technical interview practice - Score: 7.5/10
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <FileText className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">Resume Analysis Complete</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          ATS compatibility improved to 85%
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Upcoming Sessions</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {dashboardData.interviews.scheduledSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <div>
                          <p className="font-medium text-sm sm:text-base">{session.type} Interview</p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {session.date} at {session.time}
                          </p>
                        </div>
                        <button className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 text-white rounded text-xs sm:text-sm hover:bg-blue-700">
                          Join
                        </button>
                      </div>
                    ))}
                    <button className="w-full p-3 sm:p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs sm:text-sm">
                      + Schedule New Session
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Performance Analysis</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-3 text-sm sm:text-base">Strengths</h4>
                    <div className="space-y-2">
                      {dashboardData.interviews.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs sm:text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-3 text-sm sm:text-base">
                      Areas for Improvement
                    </h4>
                    <div className="space-y-2">
                      {dashboardData.interviews.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span className="text-xs sm:text-sm">{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "resume" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between flex-col sm:flex-row gap-3">
                <h2 className="text-xl sm:text-2xl font-bold">Resume Analysis</h2>
                <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs sm:text-sm">
                  <Upload className="w-4 h-4" />
                  Upload New Resume
                </button>
              </div>
              {/* --- AI Resume-Job Match Section --- */}
              {resumeAnalysis && resumeAnalysis.matchScore !== undefined && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border dark:border-blue-700 mb-6">
                  <h3 className="font-bold text-lg mb-2 text-blue-800 dark:text-blue-300">Resume Match Score</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Your resume matches <span className="font-bold text-blue-700 dark:text-blue-200">{resumeAnalysis.matchScore}%</span> with the selected job description.</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {resumeAnalysis.missingSkills && resumeAnalysis.missingSkills.length > 0 && (
                      <>
                        <span className="font-semibold text-red-700 dark:text-red-300">Missing Skills:</span>
                        {resumeAnalysis.missingSkills.map((skill, idx) => (
                          <span key={idx} className="bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm">{skill}</span>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="mb-2">
                    {resumeAnalysis.suggestions && resumeAnalysis.suggestions.map((tip, idx) => (
                      <div key={idx} className="text-sm text-blue-700 dark:text-blue-200">• {tip}</div>
                    ))}
                  </div>
                  <div className="mb-2">
                    {resumeAnalysis.learningRecommendations && resumeAnalysis.learningRecommendations.map((rec, idx) => (
                      <div key={idx} className="text-sm text-green-700 dark:text-green-200">→ {rec}</div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <Gauge className="w-5 sm:w-6 h-5 sm:h-6 text-purple-500" />
                    <h3 className="font-semibold text-sm sm:text-base">ATS Score</h3>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold mb-2">{dashboardData.resume.lastScore}%</p>
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 text-xs sm:text-sm">
                      +{dashboardData.resume.lastScore - dashboardData.resume.previousScore} from last scan
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <Target className="w-5 sm:w-6 h-5 sm:h-6 text-blue-500" />
                    <h3 className="font-semibold text-sm sm:text-base">Keyword Match</h3>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold mb-2">{dashboardData.resume.keywordMatch}%</p>
                  <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm">industry relevance</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-green-500" />
                    <h3 className="font-semibold text-sm sm:text-base">ATS Compatible</h3>
                  </div>
                  <p className="text-xl sm:text-3xl font-bold mb-2">{dashboardData.resume.atsCompatibility}%</p>
                  <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm">format score</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <AlertTriangle className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500" />
                    <h3 className="text-lg sm:text-xl font-semibold">Issues to Address</h3>
                  </div>
                  <div className="space-y-3">
                    {dashboardData.resume.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                      >
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6 text-green-500" />
                    <h3 className="text-lg sm:text-xl font-semibold">Strong Points</h3>
                  </div>
                  <div className="space-y-3">
                    {dashboardData.resume.strengths.map((strength, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Score History</h3>
                <div className="h-24 sm:h-32 flex items-end justify-between gap-1 sm:gap-2">
                  {[45, 52, 58, 63, 68, 75].map((score, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-pink-600 rounded-t"
                        style={{ height: `${(score / 100) * 80}px` }}
                      ></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Scan {index + 1}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Last updated: {dashboardData.resume.lastUpdated}
                </p>
              </div>
            </div>
          )}

          {activeSection === "goals" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between flex-col sm:flex-row gap-3">
                <h2 className="text-xl sm:text-2xl font-bold">Goals & Progress</h2>
                <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm">
                  <Plus className="w-4 h-4" />
                  Add New Goal
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold">Weekly Practice Goal</h3>
                    <span className="text-xl sm:text-2xl">🎯</span>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs sm:text-sm">Questions Solved</span>
                      <span className="font-semibold text-xs sm:text-sm">
                        {dashboardData.aptitude.weeklyProgress}/{dashboardData.aptitude.weeklyGoal}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${(dashboardData.aptitude.weeklyProgress / dashboardData.aptitude.weeklyGoal) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {dashboardData.aptitude.weeklyGoal - dashboardData.aptitude.weeklyProgress} questions to go
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold">Interview Readiness</h3>
                    <span className="text-xl sm:text-2xl">💼</span>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs sm:text-sm">Target Score</span>
                      <span className="font-semibold text-xs sm:text-sm">8.0/10</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 sm:h-3 rounded-full"
                        style={{ width: `${(dashboardData.interviews.avgScore / 8) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Current: {dashboardData.interviews.avgScore}/10
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Achievement Milestones</h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { title: "First 100 Questions Completed", date: "Jan 10, 2024", color: "green" },
                    { title: "Week-long Study Streak", date: "Achieved 7-day consistency", color: "blue" },
                    { title: "Resume ATS Score 70+", date: "Optimized for applicant tracking systems", color: "purple" },
                    { title: "Interview Score 8.0+", date: "Target: 8.0/10 average score", color: "gray", completed: false },
                  ].map((milestone, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg ${
                        milestone.completed !== false
                          ? `bg-${milestone.color}-50 dark:bg-${milestone.color}-900/20`
                          : "bg-gray-100 dark:bg-gray-700 opacity-60"
                      }`}
                    >
                      <div
                        className={`w-8 sm:w-10 h-8 sm:h-10 bg-${
                          milestone.completed !== false ? milestone.color : "gray"
                        }-500 rounded-full flex items-center justify-center`}
                      >
                        {milestone.completed !== false ? (
                          <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                        ) : (
                          <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">{milestone.title}</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{milestone.date}</p>
                      </div>
                      {milestone.completed !== false && (
                        <Award className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "analytics" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between flex-col sm:flex-row gap-3">
                <h2 className="text-xl sm:text-2xl font-bold">Analytics & Insights</h2>
                <div className="flex items-center gap-2">
                  <select className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                  <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 sm:p-6 text-white">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Study Time</h3>
                  <p className="text-xl sm:text-3xl font-bold">24.5h</p>
                  <p className="text-blue-100 text-xs sm:text-sm">+2.3h from last week</p>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 sm:p-6 text-white">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Accuracy Rate</h3>
                  <p className="text-xl sm:text-3xl font-bold">{dashboardData.aptitude.accuracy}%</p>
                  <p className="text-green-100 text-xs sm:text-sm">+3.2% improvement</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 sm:p-6 text-white">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Focus Score</h3>
                  <p className="text-xl sm:text-3xl font-bold">8.7/10</p>
                  <p className="text-purple-100 text-xs sm:text-sm">Excellent focus</p>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 sm:p-6 text-white">
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Consistency</h3>
                  <p className="text-xl sm:text-3xl font-bold">{dashboardData.aptitude.streak} days</p>
                  <p className="text-orange-100 text-xs sm:text-sm">Current streak</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Weekly Performance</h3>
                  <div className="h-40 sm:h-64 flex items-end justify-between gap-1 sm:gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                      const height = [80, 65, 90, 75, 85, 70, 95][index];
                      return (
                        <div key={day} className="flex flex-col items-center gap-2 flex-1">
                          <div
                            className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t transition-all duration-500"
                            style={{ height: `${(height / 100) * 150}px` }}
                          ></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Subject Proficiency</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { subject: "Quantitative Aptitude", score: 85, colorClass: "bg-gradient-to-r from-blue-500 to-blue-600" },
                      { subject: "Verbal Reasoning", score: 92, colorClass: "bg-gradient-to-r from-green-500 to-green-600" },
                      { subject: "Logical Reasoning", score: 78, colorClass: "bg-gradient-to-r from-yellow-500 to-yellow-600" },
                      { subject: "Data Interpretation", score: 68, colorClass: "bg-gradient-to-r from-red-500 to-red-600" },
                      { subject: "General Awareness", score: 73, colorClass: "bg-gradient-to-r from-purple-500 to-purple-600" },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs sm:text-sm font-medium">{item.subject}</span>
                          <span className="text-xs sm:text-sm font-semibold">{item.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
                          <div
                            className={`${item.colorClass} h-2 sm:h-2.5 rounded-full transition-all duration-500`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Recommendations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    {
                      title: "Study Suggestion",
                      icon: Lightbulb,
                      color: "blue",
                      text: "Focus more on Data Interpretation practice. Your current score of 68% can be improved with targeted practice.",
                    },
                    {
                      title: "Achievement Unlock",
                      icon: Trophy,
                      color: "green",
                      text: "You're close to unlocking the 'Consistency Champion' badge! Complete 3 more days of practice.",
                    },
                    {
                      title: "Schedule Optimization",
                      icon: Calendar,
                      color: "purple",
                      text: "Your peak performance time is between 2-4 PM. Consider scheduling important practice sessions then.",
                    },
                    {
                      title: "Interview Prep",
                      icon: Users,
                      color: "orange",
                      text: "Book more behavioral interview sessions to reach your target score of 8.0/10 average.",
                    },
                  ].map((rec, index) => (
                    <div
                      key={index}
                      className={`p-3 sm:p-4 bg-${rec.color}-50 dark:bg-${rec.color}-900/20 rounded-lg border border-${rec.color}-200 dark:border-${rec.color}-800`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <rec.icon className={`w-4 sm:w-5 h-4 sm:h-5 text-${rec.color}-500`} />
                        <h4 className={`font-semibold text-${rec.color}-700 dark:text-${rec.color}-300 text-xs sm:text-sm`}>
                          {rec.title}
                        </h4>
                      </div>
                      <p className={`text-xs sm:text-sm text-${rec.color}-600 dark:text-${rec.color}-400`}>{rec.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;