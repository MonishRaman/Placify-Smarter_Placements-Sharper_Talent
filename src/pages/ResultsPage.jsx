import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logger from '../utils/logger';
import {
  ArrowLeft, TrendingUp, Eye, Mic, Brain,
  Award, Target, CheckCircle, AlertTriangle,
  Home, Play, Loader, Clock, User, Calendar,
  BarChart3, PieChart as PieChartIcon, CheckSquare, 
  XSquare, RefreshCw, Zap, Sparkles, ChevronRight
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, 
  Line, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

// Mock interview results (for fallback/placeholder data)
const fallbackInterviewData = {
  totalQuestions: 10,
  correctAnswers: 7,
  timeTaken: '4 mins 10 secs',
  metrics: [
    {
      category: 'Clarity of Voice',
      score: 80,
      badge: 'Good',
      color: 'blue',
      icon: <Mic className="w-5 h-5" />,
      feedback: 'Your vocal clarity was good. Continue practicing clear articulation.'
    },
    {
      category: 'Confidence (Eye Contact)',
      score: 70,
      badge: 'Good',
      color: 'blue',
      icon: <Eye className="w-5 h-5" />,
      feedback: 'Decent eye contact maintained. Try to look directly at the camera more consistently.'
    },
    {
      category: 'Technical Keywords',
      score: 65,
      badge: 'Average',
      color: 'orange',
      icon: <Brain className="w-5 h-5" />,
      feedback: 'Include more industry-specific terminology in your responses.'
    }
  ]
};

// Mock previous sessions data (for fallback)
const fallbackPreviousSessions = [
  { name: 'Session 1', score: 65 },
  { name: 'Session 2', score: 70 },
];

// Dynamic score calculation function
const calculateOverallScore = (correctAnswers, totalQuestions, metrics, timeTaken) => {
  // Base score from correct answers (60% weight)
  const accuracyScore = (correctAnswers / totalQuestions) * 100;
  const accuracyWeight = 0.6;
  
  // Average of all metrics (30% weight)
  const metricsAverage = metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length;
  const metricsWeight = 0.3;
  
  // Time bonus/penalty (10% weight) - assume optimal time is 3-5 minutes
  const timeInMinutes = parseFloat(timeTaken.split(' ')[0]);
  let timeScore = 100;
  if (timeInMinutes < 2) {
    timeScore = 70; // Too fast, might be rushed
  } else if (timeInMinutes > 6) {
    timeScore = 80; // Too slow, might indicate hesitation
  }
  const timeWeight = 0.1;
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    (accuracyScore * accuracyWeight) + 
    (metricsAverage * metricsWeight) + 
    (timeScore * timeWeight)
  );
  
  return Math.min(100, Math.max(0, overallScore)); // Ensure score is between 0-100
};

// Function to get score label and color based on score
const getScoreLabel = (score) => {
  if (score >= 85) return { label: 'Excellent', color: 'bg-emerald-500' };
  if (score >= 75) return { label: 'Good', color: 'bg-blue-500' };
  if (score >= 60) return { label: 'Average', color: 'bg-yellow-500' };
  return { label: 'Needs Improvement', color: 'bg-red-500' };
};

// Function to get performance summary based on score
const getPerformanceSummary = (score, metrics) => {
  const weakestMetric = metrics.reduce((min, metric) => 
    metric.score < min.score ? metric : min
  );
  
  if (score >= 85) {
    return "Outstanding performance! You demonstrated excellent skills across all areas. Keep up the great work!";
  } else if (score >= 75) {
    return `Strong performance overall! Focus on improving your ${weakestMetric.category.toLowerCase()} to reach the next level.`;
  } else if (score >= 60) {
    return `Good foundation with room for improvement. Consider practicing ${weakestMetric.category.toLowerCase()} more frequently.`;
  } else {
    return `There's significant room for improvement. Focus on ${weakestMetric.category.toLowerCase()} and consider additional practice sessions.`;
  }
};

// This function simulates an API call to fetch interview results
const fetchInterviewResults = async (interviewId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const interviewResults = [
    {
      id: '1753311835655',
      totalQuestions: 10,
      correctAnswers: 8,
      timeTaken: '3 mins 45 secs',
      metrics: [
        {
          category: 'Clarity of Voice',
          score: 92,
          badge: 'Excellent',
          color: 'emerald',
          icon: <Mic className="w-5 h-5" />,
          feedback: 'Your articulation and vocal clarity were outstanding throughout the interview.'
        },
        {
          category: 'Confidence (Eye Contact)',
          score: 78,
          badge: 'Good',
          color: 'blue',
          icon: <Eye className="w-5 h-5" />,
          feedback: 'Good eye contact maintained. Try to look directly at the camera more consistently.'
        },
        {
          category: 'Technical Keywords',
          score: 70,
          badge: 'Good',
          color: 'blue',
          icon: <Brain className="w-5 h-5" />,
          feedback: 'Good use of technical terminology. Continue expanding your domain-specific vocabulary.'
        }
      ]
    },
    {
      id: '2',
      totalQuestions: 10,
      correctAnswers: 6,
      timeTaken: '4 mins 20 secs',
      metrics: [
        {
          category: 'Clarity of Voice',
          score: 68,
          badge: 'Average',
          color: 'orange',
          icon: <Mic className="w-5 h-5" />,
          feedback: 'Try to slow down slightly and articulate more clearly.'
        },
        {
          category: 'Confidence (Eye Contact)',
          score: 75,
          badge: 'Good',
          color: 'blue',
          icon: <Eye className="w-5 h-5" />,
          feedback: 'Decent confidence, but consider practicing with a camera.'
        },
        {
          category: 'Technical Keywords',
          score: 55,
          badge: 'Needs Improvement',
          color: 'orange',
          icon: <Brain className="w-5 h-5" />,
          feedback: 'Include more specific technical terms and concepts.'
        }
      ]
    }
  ];

  return interviewResults.find(r => r.id === interviewId) || null;
};

const fetchPreviousSessions = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (userId === '1753311835655') {
    return [
      { name: 'Session 1', score: 60 },
      { name: 'Session 2', score: 72 },
    ];
  } else if (userId === '2') {
    return [
      { name: 'Session 1', score: 55 },
      { name: 'Session 2', score: 65 },
    ];
  }
  
  return [];
};

const ResultsPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);
  const [previousSessions, setPreviousSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallScore, setOverallScore] = useState(0);
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const loadData = async () => {
      try {
        const interviewData = await fetchInterviewResults(interviewId);
        
        if (interviewData) {
          setResult(interviewData);
          
          // Calculate dynamic overall score
          const calculatedScore = calculateOverallScore(
            interviewData.correctAnswers,
            interviewData.totalQuestions,
            interviewData.metrics,
            interviewData.timeTaken
          );
          setOverallScore(calculatedScore);
          
          const sessionsData = await fetchPreviousSessions(interviewId);
          
          if (sessionsData && sessionsData.length > 0) {
            setPreviousSessions(sessionsData);
          } else {
            setPreviousSessions(fallbackPreviousSessions);
          }
        } else {
          const fallbackData = {
            id: interviewId,
            ...fallbackInterviewData
          };
          setResult(fallbackData);
          
          // Calculate score for fallback data
          const calculatedScore = calculateOverallScore(
            fallbackData.correctAnswers,
            fallbackData.totalQuestions,
            fallbackData.metrics,
            fallbackData.timeTaken
          );
          setOverallScore(calculatedScore);
          
          setPreviousSessions(fallbackPreviousSessions);
        }
      } catch (err) {
        logger.error('Error fetching data:', err);
        setError('Failed to load interview results. Please try again.');
        
        const fallbackData = {
          id: interviewId,
          ...fallbackInterviewData
        };
        setResult(fallbackData);
        
        const calculatedScore = calculateOverallScore(
          fallbackData.correctAnswers,
          fallbackData.totalQuestions,
          fallbackData.metrics,
          fallbackData.timeTaken
        );
        setOverallScore(calculatedScore);
        
        setPreviousSessions(fallbackPreviousSessions);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [interviewId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          <div className="animate-spin mb-6">
            <Loader className="w-12 h-12 mx-auto text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading Results
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Analyzing your interview performance...
          </p>
        </div>
      </div>
    );
  }

  if (error && !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Results
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              aria-label="Return to Dashboard"
            >
              <Home className="w-5 h-5" />
              Return to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              aria-label="Try Again"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { metrics: performanceMetrics, totalQuestions, correctAnswers, timeTaken } = result;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(1);
  
  // Get score styling
  const scoreInfo = getScoreLabel(overallScore);
  const performanceSummary = getPerformanceSummary(overallScore, performanceMetrics);

  const pieData = [
    { name: 'Correct', value: correctAnswers, color: '#4ade80' },
    { name: 'Incorrect', value: incorrectAnswers, color: '#f87171' },
  ];

  const COLORS = ['#4ade80', '#f87171'];

  const scoreData = [
    ...previousSessions,
    { name: 'Current Session', score: overallScore },
  ];

  const basicStats = [
    { 
      label: "Total Questions", 
      value: totalQuestions,
      icon: <Target className="w-5 h-5 text-indigo-500" />,
      description: "Questions attempted in this session"
    },
    { 
      label: "Accuracy", 
      value: `${accuracy}%`,
      icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
      description: "Percentage of correct answers"
    },
    { 
      label: "Time Taken", 
      value: timeTaken,
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      description: "Total time spent on interview"
    },
  ];

  const getBadgeStyles = (color) => {
    const styles = {
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-800',
      blue: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800',
      orange: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100 dark:border-orange-800',
      red: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800'
    };
    return styles[color] || styles.blue;
  };

  const getProgressColor = (color) => {
    const colors = {
      emerald: 'bg-emerald-500 dark:bg-emerald-400',
      blue: 'bg-blue-500 dark:bg-blue-400',
      orange: 'bg-orange-500 dark:bg-orange-400',
      red: 'bg-red-500 dark:bg-red-400'
    };
    return colors[color] || colors.blue;
  };

  const getIconBg = (color) => {
    const styles = {
      emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-200',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200',
      red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200'
    };
    return styles[color] || styles.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header with navigation */}
      <div className="bg-white shadow-md border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 sticky top-0 z-10 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900
                        px-4 py-2 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white 
                        dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-full">
              <User className="w-4 h-4" />
              <span className="font-medium">Results for Alex</span>
              <span className="hidden sm:inline-block">|</span>
              <div className="hidden sm:flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{currentDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section with Award Icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900 rounded-full mb-4 transform hover:scale-105 transition-transform duration-200">
            <Award className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
            Interview Performance Results
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Here's your detailed analysis with insights to help improve your future interviews
          </p>
        </div>

        {/* Dynamic Overall Score Card */}
        <div className={`bg-gradient-to-br ${
          overallScore >= 85 ? 'from-emerald-600 to-green-700 dark:from-emerald-700 dark:to-green-800' :
          overallScore >= 75 ? 'from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800' :
          overallScore >= 60 ? 'from-yellow-600 to-orange-700 dark:from-yellow-700 dark:to-orange-800' :
          'from-red-600 to-pink-700 dark:from-red-700 dark:to-pink-800'
        } rounded-2xl p-6 sm:p-8 text-white shadow-lg transform hover:translate-y-[-4px] transition-all duration-300`}>
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-opacity-80 text-white mb-2">Overall Performance Score</h2>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="text-6xl sm:text-7xl font-bold animate-pulse">{overallScore}</div>
                  <div className="absolute top-0 right-0 transform translate-x-full -translate-y-1/4">
                    <div className={`${scoreInfo.color} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg`}>
                      {scoreInfo.label}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-xl text-opacity-80 text-white mt-2">out of 100</div>
            </div>
            
            <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-inner">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <p className="text-lg font-medium">Performance Summary</p>
              </div>
              <p className="text-white text-opacity-90 leading-relaxed">
                {performanceSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts and Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 text-blue-500 mr-2" />
                Key Performance Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {basicStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg 
                              border border-gray-100 dark:border-gray-700 transition-all duration-200 
                              transform hover:translate-y-[-2px]"
                  >
                    <div className="flex flex-col justify-center">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {stat.label}
                        </span>
                        {stat.icon}
                      </div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 text-indigo-500 mr-2" />
                Performance Visualization
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <PieChartIcon className="w-4 h-4 text-blue-500 mr-2" />
                      Correct vs Incorrect
                    </h3>
                  </div>
                  <div className="flex justify-center mb-3">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center px-3">
                        <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={270}>
                    <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <Pie 
                        data={pieData} 
                        dataKey="value" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80} 
                        label={({ name, percent }) => {
                          return (
                            <text 
                              x={0} 
                              y={0} 
                              textAnchor="middle" 
                              fill="#333" 
                              fontSize={10} 
                              fontWeight="normal"
                              dominantBaseline="central"
                            >
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                        labelLine={false}
                        animationDuration={1000}
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            stroke="transparent"
                            className="hover:opacity-80 transition-opacity duration-200"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} questions`, name]}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center items-center mt-2 space-x-6 text-center">
                    <div>
                      <span className="text-sm font-medium block text-emerald-600">Correct</span>
                      <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{correctAnswers}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block text-red-600">Incorrect</span>
                      <span className="text-xl font-bold text-gray-800 dark:text-gray-200">{incorrectAnswers}</span>
                    </div>
                  </div>
                </div>

                {/* Line Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-200">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                    Score Progress
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={scoreData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} points`, 'Score']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                          borderRadius: '8px', 
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        activeDot={{ r: 8, fill: '#4f46e5', stroke: 'white', strokeWidth: 2 }}
                        dot={{ fill: '#6366f1', strokeWidth: 2, stroke: 'white', r: 4 }}
                        animationDuration={1500}
                        name="Performance Score"
                        fill="url(#colorScore)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Performance Metrics Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Target className="w-5 h-5 text-purple-500 mr-2" />
                Detailed Performance Analysis
              </h2>
              
              <div className="space-y-6">
                {performanceMetrics.map((metric, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 
                            hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-850"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getIconBg(metric.color)} transform hover:scale-105 transition-all duration-200`}>
                          {metric.icon}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">{metric.category}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{metric.score}%</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getBadgeStyles(metric.color)}`}>
                          {metric.badge}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${getProgressColor(metric.color)}`}
                        style={{ width: `${metric.score}%`, transition: 'width 1.5s ease-out' }}
                      ></div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-2 pl-2 border-l-2 border-gray-300 dark:border-gray-600">
                      {metric.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Feedback and Recommendations */}
          <div className="space-y-6">
            {/* Behavioral Analysis Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Brain className="w-5 h-5 text-indigo-500 mr-2" />
                Behavioral Indicators
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full">
                    <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">Tone</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                      {overallScore >= 80 ? 'Positive and Engaging' : overallScore >= 60 ? 'Generally Good' : 'Needs Work'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">Energy Level</span>
                    <span className="text-blue-600 dark:text-blue-400 text-sm">
                      {overallScore >= 75 ? 'Appropriate' : 'Could Improve'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                    <TrendingUp className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">Professional Demeanor</span>
                    <span className="text-purple-600 dark:text-purple-400 text-sm">
                      {overallScore >= 70 ? 'Strong' : overallScore >= 50 ? 'Moderate' : 'Developing'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Personalized Feedback Cards */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="w-5 h-5 text-purple-500 mr-2" />
                Personalized Feedback
              </h3>

              <div className="space-y-4">
                {/* Dynamic Positive Feedback */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 dark:bg-emerald-900/30 dark:border-emerald-700 
                               transform hover:translate-y-[-2px] transition-all duration-200 shadow-sm hover:shadow">
                  <div className="flex items-start space-x-3">
                    <div className="bg-emerald-100 dark:bg-emerald-800 p-2 rounded-full mt-0.5">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">What you did well:</h4>
                      <p className="text-emerald-700 dark:text-emerald-200 text-sm mt-2 leading-relaxed">
                        {overallScore >= 85 ? 
                          "Outstanding performance across all metrics! Your responses were clear, confident, and technically sound." :
                          overallScore >= 75 ?
                          "Strong performance with good accuracy and solid communication skills. You maintained professionalism throughout." :
                          overallScore >= 60 ?
                          "You showed good foundational skills and maintained composure during the interview." :
                          "You completed the interview and showed areas of potential that can be developed with practice."
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dynamic Improvement Feedback */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 dark:bg-orange-900/30 dark:border-orange-700 
                               transform hover:translate-y-[-2px] transition-all duration-200 shadow-sm hover:shadow">
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 dark:bg-orange-800 p-2 rounded-full mt-0.5">
                      <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200">Areas for improvement:</h4>
                      <p className="text-orange-700 dark:text-orange-200 text-sm mt-2 leading-relaxed">
                        {(() => {
                          const weakestMetric = performanceMetrics.reduce((min, metric) => 
                            metric.score < min.score ? metric : min
                          );
                          
                          if (overallScore < 60) {
                            return `Focus on improving ${weakestMetric.category.toLowerCase()} and overall accuracy. Consider additional practice sessions to build confidence.`;
                          } else if (overallScore < 75) {
                            return `Work on strengthening your ${weakestMetric.category.toLowerCase()} to reach the next performance level.`;
                          } else {
                            return `Fine-tune your ${weakestMetric.category.toLowerCase()} to achieve excellence in all areas.`;
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div> 

            {/* Dynamic Next Steps */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 
                          dark:from-blue-900/50 dark:to-purple-900/50 dark:border-blue-700 shadow-md 
                          hover:shadow-lg transition-all duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <ChevronRight className="w-5 h-5 text-blue-500 mr-2" />
                Recommended Next Steps
              </h3>
              <div className="space-y-3">
                {(() => {
                  const steps = [];
                  
                  if (overallScore >= 85) {
                    steps.push("Continue maintaining your excellent performance level");
                    steps.push("Consider mentoring others or taking on leadership roles");
                    steps.push("Focus on advanced industry certifications");
                  } else if (overallScore >= 75) {
                    steps.push("Work on the identified weak areas to reach excellence");
                    steps.push("Practice advanced interview scenarios");
                    steps.push("Build deeper technical expertise in your field");
                  } else if (overallScore >= 60) {
                    steps.push("Schedule regular practice sessions to build consistency");
                    steps.push("Focus on improving accuracy and response quality");
                    steps.push("Study common interview questions in your domain");
                  } else {
                    steps.push("Take a comprehensive interview preparation course");
                    steps.push("Practice basic communication and presentation skills");
                    steps.push("Build fundamental knowledge in your target field");
                  }
                  
                  return steps.map((step, i) => (
                    <div key={i} className="flex items-start space-x-3 group">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mt-0.5
                                    group-hover:bg-purple-200 dark:group-hover:bg-purple-700 transition-colors duration-200">
                        <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
                      </div>
                      <span className="text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                        {step}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="lg:sticky lg:top-24 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 
                           dark:border-gray-700 p-5 mt-auto hover:shadow-lg transition-all duration-200">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Ready for your next step?
              </h3>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/interview')}
                  className={`flex items-center justify-center gap-2 text-white px-6 py-3 
                            rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow
                            transform hover:translate-y-[-2px] ${
                              overallScore >= 75 ? 
                              'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600' :
                              'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600'
                            }`}
                  aria-label="Practice Again"
                >
                  <Play className="w-5 h-5" />
                  {overallScore >= 85 ? 'Perfect Your Skills' : overallScore >= 75 ? 'Level Up' : 'Practice Again'}
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 
                            px-6 py-3 rounded-xl font-medium transition-colors duration-200
                            dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                  aria-label="Back to Dashboard"
                >
                  <Home className="w-5 h-5" />
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;