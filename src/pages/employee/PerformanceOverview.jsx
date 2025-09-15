import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, TrendingDown, Target, CheckCircle, Calendar, Award, AlertCircle, Download, Share2, Filter } from 'lucide-react';

const PerformanceOverviewDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock performance data
  const performanceData = {
    overallScore: 87,
    tasksCompleted: 142,
    tasksAssigned: 158,
    projectsOnTime: 12,
    totalProjects: 15,
    goalsCompleted: 8,
    totalGoals: 10,
    trend: 'up'
  };

  const monthlyPerformance = [
    { month: 'Jan', score: 78, tasks: 24, projects: 2, goals: 1 },
    { month: 'Feb', score: 82, tasks: 28, projects: 3, goals: 2 },
    { month: 'Mar', score: 85, tasks: 32, projects: 2, goals: 1 },
    { month: 'Apr', score: 81, tasks: 26, projects: 3, goals: 2 },
    { month: 'May', score: 89, tasks: 35, projects: 3, goals: 1 },
    { month: 'Jun', score: 87, tasks: 31, projects: 2, goals: 1 }
  ];

  const skillsData = [
    { name: 'Technical Skills', value: 92, color: '#8B5CF6' },
    { name: 'Communication', value: 85, color: '#06B6D4' },
    { name: 'Leadership', value: 78, color: '#10B981' },
    { name: 'Problem Solving', value: 90, color: '#F59E0B' },
    { name: 'Time Management', value: 82, color: '#EF4444' }
  ];

  const achievementsData = [
    { category: 'Projects', completed: 12, total: 15 },
    { category: 'Tasks', completed: 142, total: 158 },
    { category: 'Goals', completed: 8, total: 10 },
    { category: 'Training', completed: 6, total: 8 }
  ];

  const recentAchievements = [
    { title: 'Project Alpha Delivered Early', date: '2024-09-10', impact: 'High' },
    { title: 'Team Leadership Recognition', date: '2024-09-08', impact: 'Medium' },
    { title: 'Client Satisfaction Score: 4.9/5', date: '2024-09-05', impact: 'High' },
    { title: 'Code Review Excellence', date: '2024-09-02', impact: 'Medium' }
  ];

  const improvementAreas = [
    { area: 'Meeting Deadlines', priority: 'High', suggestion: 'Use time-blocking techniques and set buffer time' },
    { area: 'Documentation', priority: 'Medium', suggestion: 'Implement daily documentation routine' },
    { area: 'Stakeholder Updates', priority: 'Low', suggestion: 'Schedule weekly status meetings' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-50';
    if (score >= 75) return 'bg-blue-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const exportData = (format) => {
    if (format === 'PDF') {
      alert('PDF export functionality would be implemented with a PDF generation library');
    } else if (format === 'CSV') {
      const csvData = monthlyPerformance.map(item => 
        `${item.month},${item.score},${item.tasks},${item.projects},${item.goals}`
      );
      const csvContent = `Month,Score,Tasks,Projects,Goals\n${csvData.join('\n')}`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'performance-data.csv';
      a.click();
    }
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1,2].map(i => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Insights Dashboard</h1>
          <p className="text-gray-600">Track your progress, achievements, and growth opportunities</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1M">Last Month</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="1Y">Last Year</option>
          </select>
          <div className="flex space-x-2">
            <button 
              onClick={() => exportData('PDF')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
            <button 
              onClick={() => exportData('CSV')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'achievements', label: 'Achievements' },
          { id: 'insights', label: 'Insights' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`bg-white rounded-lg p-6 shadow-sm ${getScoreBgColor(performanceData.overallScore)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Performance</p>
                  <p className={`text-3xl font-bold ${getScoreColor(performanceData.overallScore)}`}>
                    {performanceData.overallScore}%
                  </p>
                </div>
                <div className={`p-3 rounded-full ${performanceData.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {performanceData.trend === 'up' ? 
                    <TrendingUp className="w-6 h-6 text-green-600" /> : 
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  }
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className={`w-full bg-gray-200 rounded-full h-2`}>
                  <div 
                    className={`h-2 rounded-full ${performanceData.overallScore >= 90 ? 'bg-green-500' : performanceData.overallScore >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                    style={{ width: `${performanceData.overallScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Task Completion</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {Math.round((performanceData.tasksCompleted / performanceData.tasksAssigned) * 100)}%
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {performanceData.tasksCompleted} of {performanceData.tasksAssigned} tasks completed
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Project Delivery</p>
                  <p className="text-3xl font-bold text-green-600">
                    {Math.round((performanceData.projectsOnTime / performanceData.totalProjects) * 100)}%
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {performanceData.projectsOnTime} of {performanceData.totalProjects} on time
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Goals Achievement</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {Math.round((performanceData.goalsCompleted / performanceData.totalGoals) * 100)}%
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {performanceData.goalsCompleted} of {performanceData.totalGoals} goals achieved
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[70, 95]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                    formatter={(value, name) => [`${value}%`, 'Performance Score']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Assessment</h3>
              <div className="space-y-4">
                {skillsData.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: skill.color }}
                        ></div>
                        <span className="font-medium text-gray-700">{skill.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{skill.value}%</span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${skill.value}%`, 
                            backgroundColor: skill.color,
                            boxShadow: `0 0 10px ${skill.color}40`
                          }}
                        ></div>
                      </div>
                      <div 
                        className="absolute top-0 h-3 bg-white rounded-full opacity-30"
                        style={{ 
                          width: `${skill.value}%`,
                          background: `linear-gradient(90deg, transparent 0%, ${skill.color}30 50%, transparent 100%)`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {Math.round(skillsData.reduce((acc, skill) => acc + skill.value, 0) / skillsData.length)}%
                  </div>
                  <div className="text-xs text-purple-700">Average Score</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {skillsData.find(s => s.value === Math.max(...skillsData.map(skill => skill.value)))?.name.split(' ')[0] || 'Technical'}
                  </div>
                  <div className="text-xs text-green-700">Top Skill</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {skillsData.filter(skill => skill.value >= 85).length}
                  </div>
                  <div className="text-xs text-orange-700">High Proficiency</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tasks" 
                    stackId="1" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="projects" 
                    stackId="1" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rates</h3>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={achievementsData.map((item, index) => ({
                        name: item.category,
                        value: Math.round((item.completed / item.total) * 100),
                        completed: item.completed,
                        total: item.total,
                        fill: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index]
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {achievementsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value}% (${props.payload.completed}/${props.payload.total})`,
                        props.payload.name
                      ]}
                      contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="grid grid-cols-2 gap-3 mt-4 w-full">
                  {achievementsData.map((item, index) => {
                    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];
                    const percentage = Math.round((item.completed / item.total) * 100);
                    return (
                      <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: colors[index] }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-700 truncate">{item.category}</div>
                          <div className="text-xs text-gray-500">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(achievementsData.reduce((acc, item) => acc + (item.completed / item.total * 100), 0) / achievementsData.length)}%
                    </div>
                    <div className="text-xs text-green-700">Average Completion</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {achievementsData.reduce((acc, item) => acc + item.completed, 0)}
                    </div>
                    <div className="text-xs text-blue-700">Total Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Achievements
            </h3>
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    achievement.impact === 'High' ? 'bg-green-500' : 
                    achievement.impact === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">{achievement.date}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        achievement.impact === 'High' ? 'bg-green-100 text-green-800' :
                        achievement.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {achievement.impact} Impact
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Progress</h3>
            <div className="space-y-4">
              {achievementsData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm text-gray-500">
                      {item.completed}/{item.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                      style={{ width: `${(item.completed / item.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-sm font-medium text-gray-700">
                    {Math.round((item.completed / item.total) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Strength</h4>
                <p className="text-sm text-green-700 mt-1">
                  Consistent high performance in technical tasks with 92% skill rating
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Trending Up</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Project delivery has improved by 15% over the last quarter
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800">Recognition</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Received 4 team recognition awards this month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
              Improvement Opportunities
            </h3>
            <div className="space-y-4">
              {improvementAreas.map((area, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{area.area}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          area.priority === 'High' ? 'bg-red-100 text-red-800' :
                          area.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {area.priority} Priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{area.suggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-medium text-blue-800">Focus Area</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Improve time management skills through training programs
                </p>
              </div>
              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h4 className="font-medium text-green-800">Leverage Strength</h4>
                <p className="text-sm text-green-700 mt-1">
                  Consider mentoring junior developers in technical skills
                </p>
              </div>
              <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                <h4 className="font-medium text-purple-800">Growth Opportunity</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Take on leadership role in upcoming cross-functional project
                </p>
              </div>
              <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                <h4 className="font-medium text-orange-800">Skill Development</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Enroll in communication skills workshop next quarter
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PerformanceOverviewDashboard;