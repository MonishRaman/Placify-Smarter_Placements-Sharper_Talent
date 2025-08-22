import React, { useState, useEffect } from 'react';
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
  MessageSquare
} from 'lucide-react';

const StudentDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [activeSection, setActiveSection] = useState('overview');

  // Connected data from other pages
  const [dashboardData, setDashboardData] = useState({
    // Aptitude Test Results
    aptitude: {
      totalQuestions: 156,
      correctAnswers: 124,
      accuracy: 79.5,
      streak: 12,
      recentTests: [
        { id: 1, category: 'Quantitative', score: 85, date: '2024-01-15', duration: '45m' },
        { id: 2, category: 'Logical Reasoning', score: 78, date: '2024-01-14', duration: '38m' },
        { id: 3, category: 'Verbal', score: 92, date: '2024-01-13', duration: '32m' },
      ],
      weakAreas: ['Data Interpretation', 'Probability'],
      strongAreas: ['Arithmetic', 'Reading Comprehension'],
      weeklyProgress: 34,
      weeklyGoal: 50
    },
    
    // Interview Assistant Results  
    interviews: {
      totalSessions: 8,
      avgScore: 7.2,
      lastScore: 7.5,
      improvement: '+0.8',
      scheduledSessions: [
        { id: 1, date: '2024-01-20', time: '14:00', type: 'Technical' },
        { id: 2, date: '2024-01-22', time: '10:00', type: 'Behavioral' },
      ],
      strengths: ['Technical Knowledge', 'Communication', 'Problem Solving'],
      improvements: ['Specific Examples', 'Enthusiasm', 'Follow-up Questions'],
      recentFeedback: [
        { session: 'Technical Interview', score: 7.5, date: '2024-01-15' },
        { session: 'HR Round', score: 8.2, date: '2024-01-12' },
        { session: 'Behavioral', score: 6.8, date: '2024-01-10' },
      ]
    },
    
    // ATS Resume Results
    resume: {
      lastScore: 75,
      previousScore: 68,
      totalScans: 12,
      lastUpdated: '2024-01-15',
      issues: [
        'Add more quantifiable achievements',
        'Include industry keywords',
        'Improve section formatting'
      ],
      strengths: [
        'Good contact information',
        'Clear work experience',
        'Relevant skills listed'
      ],
      keywordMatch: 65,
      atsCompatibility: 85
    }
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Calculate overall performance metrics
  const overallMetrics = {
    studyScore: Math.round((dashboardData.aptitude.accuracy + dashboardData.interviews.avgScore * 10 + dashboardData.resume.lastScore) / 3),
    weeklyActivity: dashboardData.aptitude.weeklyProgress + dashboardData.interviews.totalSessions,
    improvementTrend: '+12%',
    ranking: 'Advanced'
  };

  const themeClasses = isDarkMode 
    ? 'dark bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      {/* Theme Toggle */}
      {/*<div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border dark:border-gray-700"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>*/}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Track your learning progress</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
             <div className="relative">
             <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-purple-600" />
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
  </div>
  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
    <RefreshCw className="w-4 h-4" />
    Sync Data
  </button>

  {/* Theme Toggle */}
  <button
    onClick={toggleTheme}
    className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border dark:border-gray-700"
  >
    {isDarkMode ? (
      <Sun className="w-5 h-5 text-yellow-500" />
    ) : (
      <Moon className="w-5 h-5 text-gray-700" />
    )}
  </button>
</div>

            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
              <RefreshCw className="w-4 h-4" />
              Sync Data
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'aptitude', label: 'Aptitude Tests', icon: Brain },
                { id: 'interviews', label: 'Mock Interviews', icon: Users },
                { id: 'resume', label: 'Resume Analysis', icon: FileText },
                { id: 'goals', label: 'Goals & Progress', icon: Target },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id 
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Trophy className="w-8 h-8" />
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUp className="w-4 h-4" />
                      {overallMetrics.improvementTrend}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{overallMetrics.studyScore}/100</h3>
                  <p className="text-blue-100">Overall Score</p>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="w-8 h-8" />
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUp className="w-4 h-4" />
                      +15%
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{overallMetrics.weeklyActivity}</h3>
                  <p className="text-green-100">Weekly Activity</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Star className="w-8 h-8" />
                    <div className="text-sm">Rank #47</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{overallMetrics.ranking}</h3>
                  <p className="text-purple-100">Current Level</p>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8" />
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUp className="w-4 h-4" />
                      +5 pts
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{dashboardData.resume.lastScore}%</h3>
                  <p className="text-orange-100">ATS Score</p>
                </div>
              </div>

              {/* Recent Activity & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Recent Activity</h3>
                    <select 
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="px-3 py-2 border rounded-lg bg-transparent text-sm"
                    >
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Completed Verbal Reasoning Test</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Scored 92% - Your best performance yet!</p>
                      </div>
                      <span className="text-sm text-gray-500">2h ago</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Mock Interview Session</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Technical interview practice - Score: 7.5/10</p>
                      </div>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Resume Analysis Complete</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">ATS compatibility improved to 85%</p>
                      </div>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>
                  <div className="space-y-4">
                    {dashboardData.interviews.scheduledSessions.map(session => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div>
                          <p className="font-medium">{session.type} Interview</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{session.date} at {session.time}</p>
                        </div>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          Join
                        </button>
                      </div>
                    ))}
                    
                    <button className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors">
                      + Schedule New Session
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4">Performance Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-3">Strengths</h4>
                    <div className="space-y-2">
                      {dashboardData.interviews.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-3">Areas for Improvement</h4>
                    <div className="space-y-2">
                      {dashboardData.interviews.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span>{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'resume' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Resume Analysis</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Upload className="w-4 h-4" />
                  Upload New Resume
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Gauge className="w-6 h-6 text-purple-500" />
                    <h3 className="font-semibold">ATS Score</h3>
                  </div>
                  <p className="text-3xl font-bold mb-2">{dashboardData.resume.lastScore}%</p>
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 text-sm">
                      +{dashboardData.resume.lastScore - dashboardData.resume.previousScore} from last scan
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold">Keyword Match</h3>
                  </div>
                  <p className="text-3xl font-bold mb-2">{dashboardData.resume.keywordMatch}%</p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">industry relevance</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <h3 className="font-semibold">ATS Compatible</h3>
                  </div>
                  <p className="text-3xl font-bold mb-2">{dashboardData.resume.atsCompatibility}%</p>
                  <p className="text-green-600 dark:text-green-400 text-sm">format score</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                    <h3 className="text-xl font-semibold">Issues to Address</h3>
                  </div>
                  <div className="space-y-3">
                    {dashboardData.resume.issues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <h3 className="text-xl font-semibold">Strong Points</h3>
                  </div>
                  <div className="space-y-3">
                    {dashboardData.resume.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4">Score History</h3>
                <div className="h-32 flex items-end justify-between gap-2">
                  {[45, 52, 58, 63, 68, 75].map((score, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-12 bg-gradient-to-t from-purple-500 to-pink-600 rounded-t"
                        style={{ height: `${(score / 100) * 100}px` }}
                      ></div>
                      <span className="text-xs text-gray-500">Scan {index + 1}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Last updated: {dashboardData.resume.lastUpdated}
                </p>
              </div>
            </div>
          )}

          {activeSection === 'goals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Goals & Progress</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add New Goal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Weekly Practice Goal</h3>
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span>Questions Solved</span>
                      <span className="font-semibold">{dashboardData.aptitude.weeklyProgress}/{dashboardData.aptitude.weeklyGoal}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(dashboardData.aptitude.weeklyProgress / dashboardData.aptitude.weeklyGoal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {dashboardData.aptitude.weeklyGoal - dashboardData.aptitude.weeklyProgress} questions to go
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Interview Readiness</h3>
                    <span className="text-2xl">💼</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span>Target Score</span>
                      <span className="font-semibold">8.0/10</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
                        style={{ width: `${(dashboardData.interviews.avgScore / 8) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current: {dashboardData.interviews.avgScore}/10
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4">Achievement Milestones</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">First 100 Questions Completed</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completed on Jan 10, 2024</p>
                    </div>
                    <Award className="w-6 h-6 text-yellow-500" />
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Week-long Study Streak</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Achieved 7-day consistency</p>
                    </div>
                    <Award className="w-6 h-6 text-yellow-500" />
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Resume ATS Score 70+</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Optimized for applicant tracking systems</p>
                    </div>
                    <Award className="w-6 h-6 text-yellow-500" />
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg opacity-60">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Interview Score 8.0+</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Target: 8.0/10 average score</p>
                    </div>
                    <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Analytics & Insights</h2>
                <div className="flex items-center gap-2">
                  <select className="px-3 py-2 border rounded-lg bg-transparent text-sm">
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Study Time</h3>
                  <p className="text-3xl font-bold">24.5h</p>
                  <p className="text-blue-100 text-sm">+2.3h from last week</p>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Accuracy Rate</h3>
                  <p className="text-3xl font-bold">{dashboardData.aptitude.accuracy}%</p>
                  <p className="text-green-100 text-sm">+3.2% improvement</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Focus Score</h3>
                  <p className="text-3xl font-bold">8.7/10</p>
                  <p className="text-purple-100 text-sm">Excellent focus</p>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Consistency</h3>
                  <p className="text-3xl font-bold">{dashboardData.aptitude.streak} days</p>
                  <p className="text-orange-100 text-sm">Current streak</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold mb-4">Weekly Performance</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const height = [80, 65, 90, 75, 85, 70, 95][index];
                      return (
                        <div key={day} className="flex flex-col items-center gap-2">
                          <div 
                            className="w-8 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t transition-all duration-500"
                            style={{ height: `${height}px` }}
                          ></div>
                          <span className="text-xs text-gray-500">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                  <h3 className="text-xl font-semibold mb-4">Subject Proficiency</h3>
                  <div className="space-y-4">
                    {[
                      { subject: 'Quantitative Aptitude', score: 85, color: 'blue' },
                      { subject: 'Verbal Reasoning', score: 92, color: 'green' },
                      { subject: 'Logical Reasoning', score: 78, color: 'yellow' },
                      { subject: 'Data Interpretation', score: 68, color: 'red' },
                      { subject: 'General Awareness', score: 73, color: 'purple' }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{item.subject}</span>
                          <span className="text-sm font-semibold">{item.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-2">
                      <Lightbulb className="w-5 h-5 text-blue-500" />
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300">Study Suggestion</h4>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Focus more on Data Interpretation practice. Your current score of 68% can be improved with targeted practice.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-green-700 dark:text-green-300">Achievement Unlock</h4>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      You're close to unlocking the "Consistency Champion" badge! Complete 3 more days of practice.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <h4 className="font-semibold text-purple-700 dark:text-purple-300">Schedule Optimization</h4>
                    </div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Your peak performance time is between 2-4 PM. Consider scheduling important practice sessions then.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      <h4 className="font-semibold text-orange-700 dark:text-orange-300">Interview Prep</h4>
                    </div>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Book more behavioral interview sessions to reach your target score of 8.0/10 average.
                    </p>
                  </div>
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