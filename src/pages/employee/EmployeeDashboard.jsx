import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Calendar,
  Award,
  Target,
  BarChart3,
  CheckCircle,
  Briefcase,
  Activity,
  Users,
  ChevronRight,
  MapPin,
} from "lucide-react";
import apiClient from "../../api/apiClient";

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color = "green",
  trend,
}) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border-t-4 border-${color}-500 p-5 hover:scale-[1.02] transition-transform`}
  >
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
          {title}
        </h4>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <div
        className={`p-2 bg-${color}-100 dark:bg-${color}-900/20 rounded-full`}
      >
        <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-300`} />
      </div>
    </div>
    {trend && (
      <div className="mt-2 flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
        <TrendingUp className="w-3 h-3 mr-1" /> {trend}
      </div>
    )}
  </div>
);

const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  color = "blue",
  onClick,
  path,
}) => {
  // Using a button element for accessibility & keyboard navigation.
  return (
    <button
      type="button"
      onClick={onClick}
      data-path={path}
      className={`group w-full text-left bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-${color}-500/60 hover:shadow-md active:scale-[0.98]`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`p-3 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg group-hover:scale-110 transition-transform`}
        >
          <Icon
            className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
          <div
            className={`mt-3 flex items-center text-${color}-600 dark:text-${color}-400 text-sm font-medium`}
          >
            <span>Get Started</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </button>
  );
};

const RecentActivity = ({ activities }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Recent Activities
    </h3>
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div
            className={`p-2 bg-${activity.color}-100 dark:bg-${activity.color}-900/20 rounded-full`}
          >
            <activity.icon
              className={`w-4 h-4 text-${activity.color}-600 dark:text-${activity.color}-400`}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {activity.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

import employeeQuickActions from "./quickActionsConfig";
// Quick Actions are driven by `employeeQuickActions` config.
// To add a new action: append an object with { key, icon, title, description, color, path }
// in quickActionsConfig.js – it will render automatically here.

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null); // normalized /api/dashboard response

  // Placeholder performance data (until backend provides metrics)
  const performance = {
    overallRating: 4.5,
    currentQuarter: {
      tasksCompleted: 42,
      projectsDelivered: 8,
      efficiency: 94,
      teamCollaboration: 4.8,
    },
    goals: { completed: 7, inProgress: 3, upcoming: 2 },
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/dashboard");
        setProfile(res.data);
      } catch (e) {
        console.error("Dashboard fetch failed", e);
        setError(e.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const recentActivities = [
    {
      title: "Completed React Advanced Course",
      time: "2 hours ago",
      icon: Award,
      color: "green",
    },
    {
      title: "Submitted Q2 Performance Review",
      time: "1 day ago",
      icon: BarChart3,
      color: "blue",
    },
    {
      title: "Updated Skills Profile",
      time: "3 days ago",
      icon: Target,
      color: "purple",
    },
    {
      title: "Attended Team Meeting",
      time: "1 week ago",
      icon: Users,
      color: "orange",
    },
  ];

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-slate-600 dark:text-slate-300 animate-pulse">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  // Derive display fields
  const name = profile?.name || "Employee";
  const position = profile?.additionalData?.jobTitle || "—";
  const department = profile?.department || "—";
  const location = profile?.additionalData?.workLocation || "—";
  const joinDate = "—"; // Not stored yet
  const avatarText = name
    ?.split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {profile?.additionalData?.sample && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 px-4 py-3 rounded-lg text-sm">
          Your profile has limited data. Update your profile to unlock
          personalized performance insights.
        </div>
      )}

      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-3xl font-bold text-blue-700 dark:text-blue-300">
            {avatarText}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {name}!
            </h1>
            <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">
              {position}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {location}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Joined {joinDate}
              </span>
              <span className="flex items-center">Dept: {department}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {performance.overallRating}/5.0
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Overall Rating (placeholder)
            </p>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={CheckCircle}
          title="Tasks Completed"
          value={performance.currentQuarter.tasksCompleted}
          subtitle="This Quarter"
          trend="+12%"
          color="green"
        />
        <StatCard
          icon={Briefcase}
          title="Projects Delivered"
          value={performance.currentQuarter.projectsDelivered}
          subtitle="This Quarter"
          trend="+20%"
          color="blue"
        />
        <StatCard
          icon={Activity}
          title="Efficiency Score"
          value={`${performance.currentQuarter.efficiency}%`}
          subtitle="Above Average"
          color="purple"
        />
        <StatCard
          icon={Users}
          title="Team Rating"
          value={performance.currentQuarter.teamCollaboration}
          subtitle="Out of 5.0"
          color="orange"
        />
      </div>

      {/* Quick Actions and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4">
            {employeeQuickActions.map((qa) => (
              <QuickActionCard
                key={qa.key}
                icon={qa.icon}
                title={qa.title}
                description={qa.description}
                color={qa.color}
                path={qa.path}
                onClick={() => navigate(qa.path)}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activities
          </h2>
          <RecentActivity activities={recentActivities} />
        </div>
      </div>

      {/* Goals Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Goal Progress (Placeholder)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {performance.goals.completed}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Completed Goals
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {performance.goals.inProgress}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              In Progress
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {performance.goals.upcoming}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upcoming Goals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
