/**
 * Job Switch Insights Component
 *
 * This component provides comprehensive job market analysis and career switching insights
 * for employees. It includes:
 *
 * Features:
 * - Market demand analysis and salary growth potential
 * - Interactive charts for salary progression and industry trends
 * - Skills gap analysis with radar chart
 * - Top job opportunities with filtering
 * - Market insights and recent industry moves
 * - Detailed opportunities table with comprehensive job data
 *
 * Data Structure:
 * - Uses mock data (mockInsightsData) that can be easily replaced with API calls
 * - State management ready for real-time data updates
 * - Filtering and sorting capabilities built-in
 *
 * Backend Integration Points:
 * - fetchJobInsights() function ready for API integration
 * - Dynamic filtering based on user preferences
 * - Timeframe selection for historical data analysis
 *
 * Styling:
 * - Follows existing dashboard design patterns
 * - Fully responsive design with mobile-first approach
 * - Dark mode support throughout
 * - Consistent with other employee dashboard pages
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Users,
  Calendar,
  Target,
  Star,
  MapPin,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Filter,
  Download,
  Share2,
  Briefcase,
  GraduationCap,
  Award,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Mock data for Job Switch Insights
const mockInsightsData = {
  // Overview metrics
  overview: {
    marketDemand: 78,
    salaryGrowthPotential: 34,
    optimalSwitchTime: 18,
    marketTrend: "up",
    currentMarketValue: 850000,
    industryGrowth: 12.5,
  },

  // Salary progression data
  salaryProgression: [
    { experience: "0-1", current: 350000, market: 380000, potential: 420000 },
    { experience: "1-3", current: 550000, market: 650000, potential: 750000 },
    { experience: "3-5", current: 850000, market: 950000, potential: 1100000 },
    {
      experience: "5-8",
      current: 1200000,
      market: 1400000,
      potential: 1650000,
    },
    { experience: "8+", current: 1800000, market: 2000000, potential: 2300000 },
  ],

  // Industry trends
  industryTrends: [
    {
      month: "Jan",
      techJobs: 1200,
      fintech: 800,
      healthcare: 600,
      ecommerce: 900,
    },
    {
      month: "Feb",
      techJobs: 1350,
      fintech: 850,
      healthcare: 650,
      ecommerce: 950,
    },
    {
      month: "Mar",
      techJobs: 1500,
      fintech: 900,
      healthcare: 700,
      ecommerce: 1000,
    },
    {
      month: "Apr",
      techJobs: 1400,
      fintech: 950,
      healthcare: 750,
      ecommerce: 1100,
    },
    {
      month: "May",
      techJobs: 1600,
      fintech: 1000,
      healthcare: 800,
      ecommerce: 1150,
    },
    {
      month: "Jun",
      techJobs: 1750,
      fintech: 1100,
      healthcare: 850,
      ecommerce: 1200,
    },
  ],

  // Skills demand radar
  skillsDemand: [
    { skill: "React/Frontend", demand: 85, yourLevel: 78 },
    { skill: "Backend APIs", demand: 90, yourLevel: 82 },
    { skill: "Cloud/DevOps", demand: 80, yourLevel: 65 },
    { skill: "Data Analytics", demand: 75, yourLevel: 70 },
    { skill: "Mobile Dev", demand: 70, yourLevel: 55 },
    { skill: "AI/ML", demand: 95, yourLevel: 60 },
  ],

  // Top opportunities
  topOpportunities: [
    {
      company: "Google",
      role: "Senior Software Engineer",
      salaryRange: "₹25-35L",
      location: "Bangalore",
      match: 92,
      requirements: ["React", "Node.js", "AWS"],
      growth: "high",
      culture: "innovation",
    },
    {
      company: "Microsoft",
      role: "Principal Engineer",
      salaryRange: "₹30-40L",
      location: "Hyderabad",
      match: 88,
      requirements: ["Full Stack", "Azure", "Leadership"],
      growth: "high",
      culture: "collaboration",
    },
    {
      company: "Flipkart",
      role: "Tech Lead",
      salaryRange: "₹22-28L",
      location: "Bangalore",
      match: 85,
      requirements: ["System Design", "Java", "Microservices"],
      growth: "medium",
      culture: "startup",
    },
    {
      company: "Razorpay",
      role: "Senior Developer",
      salaryRange: "₹18-25L",
      location: "Bangalore",
      match: 82,
      requirements: ["Node.js", "PostgreSQL", "Payment Systems"],
      growth: "high",
      culture: "fintech",
    },
  ],

  // Market insights
  marketInsights: [
    {
      title: "Best Time to Switch",
      insight: "Q1 and Q3 show highest hiring activity",
      impact: "high",
      recommendation: "Plan your move between Jan-Mar or Jul-Sep",
    },
    {
      title: "Salary Negotiation",
      insight: "Average salary increase for job switches is 30-50%",
      impact: "high",
      recommendation: "Aim for at least 35% increase when switching",
    },
    {
      title: "Skill Gap Analysis",
      insight: "Cloud and AI/ML skills are most in-demand",
      impact: "medium",
      recommendation: "Upskill in AWS/Azure and basic ML concepts",
    },
    {
      title: "Industry Growth",
      insight: "Fintech and HealthTech are growing fastest",
      impact: "medium",
      recommendation: "Consider opportunities in these sectors",
    },
  ],

  // Recent industry moves
  recentMoves: [
    {
      name: "Priya S.",
      from: "TCS",
      to: "Amazon",
      role: "SDE-II",
      salaryJump: 65,
      timeframe: "2 weeks ago",
    },
    {
      name: "Rahul K.",
      from: "Infosys",
      to: "Google",
      role: "Senior SDE",
      salaryJump: 80,
      timeframe: "1 month ago",
    },
    {
      name: "Anita M.",
      from: "Wipro",
      to: "Microsoft",
      role: "Principal Engineer",
      salaryJump: 90,
      timeframe: "3 weeks ago",
    },
  ],
};

const JobSwitchInsights = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("6M");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [insightsData, setInsightsData] = useState(mockInsightsData);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchJobInsights = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Future API integration point:
        // const response = await apiClient.get('/job-insights', {
        //   params: { timeframe: selectedTimeframe, filter: selectedFilter }
        // });
        // setInsightsData(response.data);

        setInsightsData(mockInsightsData);
      } catch (error) {
        console.error("Failed to fetch job insights:", error);
        // Handle error state
      } finally {
        setLoading(false);
      }
    };

    fetchJobInsights();
  }, [selectedTimeframe, selectedFilter]);

  // Filter opportunities based on selected filter
  const filteredOpportunities = useMemo(() => {
    let opportunities = insightsData.topOpportunities;

    switch (selectedFilter) {
      case "high-growth":
        opportunities = opportunities.filter((opp) => opp.growth === "high");
        break;
      case "high-salary":
        opportunities = opportunities.sort((a, b) => {
          const salaryA = parseInt(a.salaryRange.match(/\d+/)[0]);
          const salaryB = parseInt(b.salaryRange.match(/\d+/)[0]);
          return salaryB - salaryA;
        });
        break;
      case "culture-fit":
        opportunities = opportunities.filter((opp) => opp.match >= 85);
        break;
      default:
        break;
    }

    return opportunities;
  }, [insightsData.topOpportunities, selectedFilter]);

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-slate-600 dark:text-slate-300">
            Loading job insights...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-full">
              <BarChart3 className="w-8 h-8 text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Job Switch Insights
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover market trends, salary insights, and optimal career
                opportunities
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Market Status Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-300">
                  Market Outlook: Favorable
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  High demand for your skills •{" "}
                  {insightsData.overview.industryGrowth}% industry growth
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your Market Value
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹
                {(insightsData.overview.currentMarketValue / 100000).toFixed(1)}
                L
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border-t-4 border-blue-500 p-6 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Market Demand
              </h4>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {insightsData.overview.marketDemand}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                High demand for your skills
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
            <TrendingUp className="w-3 h-3 mr-1" /> +5% from last month
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border-t-4 border-green-500 p-6 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Salary Growth
              </h4>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                +{insightsData.overview.salaryGrowthPotential}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Potential increase
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
            <ArrowRight className="w-3 h-3 mr-1" /> Above industry average
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border-t-4 border-orange-500 p-6 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Optimal Switch Time
              </h4>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {insightsData.overview.optimalSwitchTime}M
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Months from now
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-300" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400 text-xs font-medium">
            <Calendar className="w-3 h-3 mr-1" /> Q1 & Q3 are peak seasons
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border-t-4 border-purple-500 p-6 hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Industry Growth
              </h4>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                +{insightsData.overview.industryGrowth}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                YoY growth rate
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
            <Star className="w-3 h-3 mr-1" /> Tech sector leading
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Salary Progression Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Salary Progression Analysis
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Compare your current salary with market rates
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={insightsData.salaryProgression}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="experience" />
              <YAxis
                tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
              />
              <Tooltip
                formatter={(value, name) => [
                  `₹${(value / 100000).toFixed(1)}L`,
                  name,
                ]}
                labelFormatter={(label) => `Experience: ${label} years`}
              />
              <Bar dataKey="current" fill="#ef4444" name="Your Current" />
              <Bar dataKey="market" fill="#3b82f6" name="Market Average" />
              <Bar dataKey="potential" fill="#10b981" name="Potential" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Industry Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Industry Hiring Trends
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Job openings by sector over time
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={insightsData.industryTrends}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="techJobs"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Tech"
              />
              <Line
                type="monotone"
                dataKey="fintech"
                stroke="#10b981"
                strokeWidth={2}
                name="Fintech"
              />
              <Line
                type="monotone"
                dataKey="healthcare"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Healthcare"
              />
              <Line
                type="monotone"
                dataKey="ecommerce"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="E-commerce"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skills Radar and Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Skills Demand Radar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Skills Demand Analysis
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Market demand vs your current level
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={insightsData.skillsDemand}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Market Demand"
                dataKey="demand"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
              />
              <Radar
                name="Your Level"
                dataKey="yourLevel"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Opportunities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Top Opportunities
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Best matches for your profile
              </p>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Briefcase className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="space-y-4">
            {insightsData.topOpportunities
              .slice(0, 3)
              .map((opportunity, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {opportunity.role}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {opportunity.company}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {opportunity.match}% match
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {opportunity.salaryRange}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {opportunity.location}
                      </span>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 hover:underline">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Market Insights and Recent Moves */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Market Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Market Insights
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Key insights for your career planning
              </p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="space-y-4">
            {insightsData.marketInsights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      insight.impact === "high"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {insight.impact} impact
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {insight.insight}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  💡 {insight.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Industry Moves */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Industry Moves
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Success stories from professionals like you
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="space-y-4">
            {insightsData.recentMoves.map((move, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {move.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {move.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {move.from} → {move.to}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      +{move.salaryJump}%
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {move.timeframe}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Role: {move.role}
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    Similar to your profile
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Opportunities Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Detailed Job Opportunities
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Comprehensive analysis of potential career moves
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Companies</option>
              <option value="high-growth">High Growth</option>
              <option value="high-salary">High Salary</option>
              <option value="culture-fit">Culture Fit</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3">Company & Role</th>
                <th className="px-6 py-3">Match Score</th>
                <th className="px-6 py-3">Salary Range</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Requirements</th>
                <th className="px-6 py-3">Growth</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpportunities.map((opportunity, index) => (
                <tr
                  key={index}
                  className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {opportunity.company[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {opportunity.company}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">
                          {opportunity.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${opportunity.match}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {opportunity.match}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {opportunity.salaryRange}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      {opportunity.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {opportunity.requirements.slice(0, 2).map((req, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                        >
                          {req}
                        </span>
                      ))}
                      {opportunity.requirements.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                          +{opportunity.requirements.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        opportunity.growth === "high"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {opportunity.growth}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
                      Apply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Skill Development
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bridge skill gaps
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Take targeted courses to improve your market competitiveness
          </p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Recommendations
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 border border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Network Building
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with industry
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Build connections with professionals in your target companies
          </p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Start Networking
          </button>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl p-6 border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-orange-500 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Portfolio Enhancement
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showcase your work
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Create compelling projects that demonstrate your capabilities
          </p>
          <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Get Started
          </button>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          💡 <strong>Note:</strong> This data is generated from market research
          and industry trends. For personalized advice, consider scheduling a
          career consultation.
        </p>
      </div>
    </div>
  );
};

export default JobSwitchInsights;
