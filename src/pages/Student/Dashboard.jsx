import React, { useState, useEffect } from 'react';
import {
  Brain,
  Play,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Star,
  Trophy,
  Target,
  FileText,
  CheckCircle,
  Zap,
  Crown,
  Medal,
  Shield,
  Flame,
  Users,
  BookOpen,
  Code,
  UserCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const data = [
  { name: "Jan", interviews: 10, avgScore: 70, atsScore: 65 },
  { name: "Feb", interviews: 15, avgScore: 75, atsScore: 72 },
  { name: "Mar", interviews: 8, avgScore: 65, atsScore: 68 },
  { name: "Apr", interviews: 12, avgScore: 72, atsScore: 75 },
  { name: "May", interviews: 18, avgScore: 78, atsScore: 80 },
  { name: "Jun", interviews: 22, avgScore: 82, atsScore: 85 }
];

const skillsData = [
  { name: 'Technical', value: 85, color: '#8B5CF6' },
  { name: 'Communication', value: 78, color: '#06B6D4' },
  { name: 'Problem Solving', value: 92, color: '#10B981' },
  { name: 'Leadership', value: 67, color: '#F59E0B' }
];

// Badge system data
const badges = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first mock interview",
    icon: Play,
    earned: true,
    earnedDate: "2024-01-15",
    category: "interview",
    rarity: "common",
    color: "blue"
  },
  {
    id: 2,
    name: "Resume Master",
    description: "Upload and optimize your resume",
    icon: FileText,
    earned: true,
    earnedDate: "2024-01-20",
    category: "resume",
    rarity: "common",
    color: "green"
  },
  {
    id: 3,
    name: "ATS Champion",
    description: "Achieve ATS score above 80%",
    icon: Target,
    earned: true,
    earnedDate: "2024-02-10",
    category: "ats",
    rarity: "rare",
    color: "purple"
  },
  {
    id: 4,
    name: "Interview Streak",
    description: "Complete 5 interviews in a row",
    icon: Flame,
    earned: true,
    earnedDate: "2024-02-25",
    category: "interview",
    rarity: "rare",
    color: "orange"
  },
  {
    id: 5,
    name: "Code Warrior",
    description: "Excel in coding interviews",
    icon: Code,
    earned: true,
    earnedDate: "2024-03-05",
    category: "coding",
    rarity: "epic",
    color: "indigo"
  },
  {
    id: 6,
    name: "Perfect Score",
    description: "Achieve 100% in any interview",
    icon: Crown,
    earned: false,
    earnedDate: null,
    category: "interview",
    rarity: "legendary",
    color: "yellow"
  },
  {
    id: 7,
    name: "Consistency King",
    description: "Complete interviews 7 days straight",
    icon: CheckCircle,
    earned: false,
    earnedDate: null,
    category: "interview",
    rarity: "epic",
    color: "emerald"
  },
  {
    id: 8,
    name: "Knowledge Seeker",
    description: "Complete aptitude questions practice",
    icon: BookOpen,
    earned: true,
    earnedDate: "2024-03-12",
    category: "aptitude",
    rarity: "common",
    color: "cyan"
  }
];

const achievements = [
  { title: "Interviews Completed", value: 45, target: 50, icon: Users, color: "blue" },
  { title: "Average Score", value: 78, target: 80, icon: TrendingUp, color: "green" },
  { title: "ATS Score", value: 85, target: 90, icon: FileText, color: "purple" },
  { title: "Coding Problems", value: 32, target: 50, icon: Code, color: "indigo" }
];

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "John Smith",
    email: "john.smith@university.edu",
    role: "Student",
    university: "Stanford University",
    major: "Computer Science"
  });

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage?.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const earnedBadges = badges.filter(badge => badge.earned);
  const totalBadges = badges.length;

  const getRarityColor = (rarity, isDark = false) => {
    const colors = {
      common: isDark ? 'text-gray-300 border-gray-600' : 'text-gray-600 border-gray-300',
      rare: isDark ? 'text-blue-400 border-blue-500' : 'text-blue-600 border-blue-400',
      epic: isDark ? 'text-purple-400 border-purple-500' : 'text-purple-600 border-purple-400',
      legendary: isDark ? 'text-yellow-400 border-yellow-500' : 'text-yellow-600 border-yellow-400'
    };
    return colors[rarity] || colors.common;
  };

  const getBadgeIcon = (badge) => {
    const IconComponent = badge.icon;
    return <IconComponent className="w-8 h-8" />;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header Section */}
      <div className="text-center py-8 mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">{userData?.fullName || "User"}</span> 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Ready to ace your next interview?</p>
          </div>
        </div>
      </div>

      {/* Achievements Progress */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <Target className="w-7 h-7 mr-3 text-purple-600 dark:text-purple-400" />
          Your Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            const progress = (achievement.value / achievement.target) * 100;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-${achievement.color}-100 dark:bg-${achievement.color}-900 rounded-xl`}>
                    <IconComponent className={`w-6 h-6 text-${achievement.color}-600 dark:text-${achievement.color}-400`} />
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {achievement.value}/{achievement.target}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{achievement.title}</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r from-${achievement.color}-500 to-${achievement.color}-600 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{progress.toFixed(0)}% Complete</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Achievement System */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Award className="w-7 h-7 mr-3 text-yellow-600 dark:text-yellow-400" />
            Achievement Badges
          </h2>
          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {earnedBadges.length}/{totalBadges} Earned
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          {badges.map((badge) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={badge.id}
                className={`
                  relative group cursor-pointer transition-all duration-300 hover:scale-110
                  ${badge.earned 
                    ? 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-100 dark:bg-gray-800 opacity-60 hover:opacity-80'
                  }
                  p-4 rounded-2xl border-2 ${getRarityColor(badge.rarity, isDarkMode)}
                `}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`
                    p-3 rounded-full transition-all duration-300
                    ${badge.earned 
                      ? `bg-${badge.color}-100 dark:bg-${badge.color}-900 text-${badge.color}-600 dark:text-${badge.color}-400` 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    }
                  `}>
                    {getBadgeIcon(badge)}
                  </div>
                  <h4 className="font-semibold text-xs text-gray-900 dark:text-gray-100">{badge.name}</h4>
                  {badge.earned && (
                    <div className="absolute top-1 right-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                  <div className="font-semibold">{badge.name}</div>
                  <div className="text-gray-300">{badge.description}</div>
                  {badge.earned && (
                    <div className="text-green-400 text-xs mt-1">
                      Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                    </div>
                  )}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Total Interviews</h2>
              <p className="text-3xl mt-2 font-bold">45</p>
              <p className="text-blue-100 text-sm mt-1">+5 this month</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Average Score</h2>
              <p className="text-3xl mt-2 font-bold">78%</p>
              <p className="text-green-100 text-sm mt-1">+3% improvement</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">ATS Score</h2>
              <p className="text-3xl mt-2 font-bold">85%</p>
              <p className="text-purple-100 text-sm mt-1">Excellent match</p>
            </div>
            <FileText className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Completion Rate</h2>
              <p className="text-3xl mt-2 font-bold">92%</p>
              <p className="text-orange-100 text-sm mt-1">Outstanding!</p>
            </div>
            <CheckCircle className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
            Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="name" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
              <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
              <CartesianGrid stroke={isDarkMode ? "#4B5563" : "#E5E7EB"} strokeDasharray="3 3" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'}`,
                  borderRadius: '12px',
                  color: isDarkMode ? '#F9FAFB' : '#111827'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" strokeWidth={3} name="Interview Score" />
              <Line type="monotone" dataKey="atsScore" stroke="#8B5CF6" strokeWidth={3} name="ATS Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
            Skills Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={skillsData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {skillsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  color: isDarkMode ? '#F9FAFB' : '#111827'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {skillsData.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: skill.color }}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{skill.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{skill.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <Zap className="w-7 h-7 mr-3 text-yellow-600 dark:text-yellow-400" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Start Interview</h3>
                <p className="text-gray-600 dark:text-gray-400">Begin practice session</p>
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">Schedule Session</h3>
                <p className="text-gray-600 dark:text-gray-400">Book guided practice</p>
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">View Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">Detailed insights</p>
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl group-hover:from-yellow-600 group-hover:to-yellow-700 transition-all duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">All Badges</h3>
                <p className="text-gray-600 dark:text-gray-400">View achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
          <Clock className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { action: "Completed Technical Interview", time: "2 hours ago", score: "85%", type: "interview" },
            { action: "Earned 'ATS Champion' badge", time: "1 day ago", score: "New Badge!", type: "badge" },
            { action: "Updated Resume", time: "2 days ago", score: "ATS: 85%", type: "resume" },
            { action: "Coding Practice Session", time: "3 days ago", score: "92%", type: "coding" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'interview' ? 'bg-blue-100 dark:bg-blue-900' :
                  activity.type === 'badge' ? 'bg-yellow-100 dark:bg-yellow-900' :
                  activity.type === 'resume' ? 'bg-green-100 dark:bg-green-900' :
                  'bg-purple-100 dark:bg-purple-900'
                }`}>
                  {activity.type === 'interview' && <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  {activity.type === 'badge' && <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                  {activity.type === 'resume' && <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />}
                  {activity.type === 'coding' && <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{activity.action}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{activity.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}