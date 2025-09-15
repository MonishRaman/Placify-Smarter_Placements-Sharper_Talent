import React, { useState } from 'react';
import {
  Target, TrendingUp, Award, BookOpen, Plus, Edit3, Star,
  Code, Users, Brain, Zap, ChevronDown, ChevronUp, Search,
  Filter, Calendar, BarChart3, PieChart, Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const SkillDevelopmentTracker = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSkill, setExpandedSkill] = useState(null);
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);

  // Static data - later can be moved to API calls
  const skillsData = [
    {
      id: 1,
      name: "React.js",
      category: "Technical",
      currentLevel: 85,
      targetLevel: 95,
      lastUpdated: "2024-09-10",
      trending: "up",
      priority: "high",
      progressHistory: [
        { month: "Jun", level: 70 },
        { month: "Jul", level: 75 },
        { month: "Aug", level: 80 },
        { month: "Sep", level: 85 }
      ],
      resources: [
        { title: "Advanced React Patterns", type: "Course", url: "#", duration: "8 hours" },
        { title: "React Performance Optimization", type: "Article", url: "#", duration: "15 min" }
      ],
      industryAverage: 75,
      timeToTarget: "2 months"
    },
    {
      id: 2,
      name: "Leadership",
      category: "Soft Skills",
      currentLevel: 70,
      targetLevel: 85,
      lastUpdated: "2024-09-05",
      trending: "up",
      priority: "medium",
      progressHistory: [
        { month: "Jun", level: 60 },
        { month: "Jul", level: 65 },
        { month: "Aug", level: 68 },
        { month: "Sep", level: 70 }
      ],
      resources: [
        { title: "Leadership Fundamentals", type: "Course", url: "#", duration: "12 hours" },
        { title: "Effective Team Management", type: "Book", url: "#", duration: "5 hours" }
      ],
      industryAverage: 65,
      timeToTarget: "4 months"
    },
    {
      id: 3,
      name: "Node.js",
      category: "Technical",
      currentLevel: 78,
      targetLevel: 90,
      lastUpdated: "2024-09-08",
      trending: "stable",
      priority: "medium",
      progressHistory: [
        { month: "Jun", level: 75 },
        { month: "Jul", level: 76 },
        { month: "Aug", level: 77 },
        { month: "Sep", level: 78 }
      ],
      resources: [
        { title: "Node.js Advanced Concepts", type: "Course", url: "#", duration: "10 hours" },
        { title: "Microservices with Node.js", type: "Workshop", url: "#", duration: "6 hours" }
      ],
      industryAverage: 70,
      timeToTarget: "3 months"
    },
    {
      id: 4,
      name: "Communication",
      category: "Soft Skills",
      currentLevel: 82,
      targetLevel: 90,
      lastUpdated: "2024-09-12",
      trending: "up",
      priority: "low",
      progressHistory: [
        { month: "Jun", level: 78 },
        { month: "Jul", level: 79 },
        { month: "Aug", level: 81 },
        { month: "Sep", level: 82 }
      ],
      resources: [
        { title: "Public Speaking Mastery", type: "Course", url: "#", duration: "6 hours" },
        { title: "Written Communication", type: "Article", url: "#", duration: "20 min" }
      ],
      industryAverage: 75,
      timeToTarget: "2 months"
    },
    {
      id: 5,
      name: "Python",
      category: "Technical",
      currentLevel: 65,
      targetLevel: 80,
      lastUpdated: "2024-09-01",
      trending: "down",
      priority: "high",
      progressHistory: [
        { month: "Jun", level: 68 },
        { month: "Jul", level: 67 },
        { month: "Aug", level: 66 },
        { month: "Sep", level: 65 }
      ],
      resources: [
        { title: "Python for Data Science", type: "Course", url: "#", duration: "15 hours" },
        { title: "Python Best Practices", type: "Tutorial", url: "#", duration: "3 hours" }
      ],
      industryAverage: 70,
      timeToTarget: "5 months"
    },
    {
      id: 6,
      name: "Problem Solving",
      category: "Domain",
      currentLevel: 88,
      targetLevel: 95,
      lastUpdated: "2024-09-11",
      trending: "up",
      priority: "medium",
      progressHistory: [
        { month: "Jun", level: 82 },
        { month: "Jul", level: 84 },
        { month: "Aug", level: 86 },
        { month: "Sep", level: 88 }
      ],
      resources: [
        { title: "Advanced Problem Solving", type: "Course", url: "#", duration: "8 hours" },
        { title: "Case Study Analysis", type: "Workshop", url: "#", duration: "4 hours" }
      ],
      industryAverage: 80,
      timeToTarget: "2 months"
    }
  ];

  const categories = ['all', 'Technical', 'Soft Skills', 'Domain'];
  
  const categoryIcons = {
    'Technical': Code,
    'Soft Skills': Users,
    'Domain': Brain,
    'all': Target
  };

  const COLORS = {
    high: '#ef4444',
    medium: '#f59e0b', 
    low: '#10b981',
    completed: '#22c55e',
    inProgress: '#3b82f6'
  };

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Filter skills based on category and search
  const filteredSkills = skillsData.filter(skill => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate stats
  const avgSkillLevel = Math.round(skillsData.reduce((sum, skill) => sum + skill.currentLevel, 0) / skillsData.length);
  const skillsAboveAvg = skillsData.filter(skill => skill.currentLevel > 75).length;
  const highPrioritySkills = skillsData.filter(skill => skill.priority === 'high').length;

  // Skill distribution data for pie chart
  const skillDistribution = categories.slice(1).map(category => ({
    name: category,
    value: skillsData.filter(skill => skill.category === category).length
  }));

  // Progress overview data
  const progressOverview = skillsData.map(skill => ({
    name: skill.name,
    current: skill.currentLevel,
    target: skill.targetLevel,
    gap: skill.targetLevel - skill.currentLevel
  }));

  const getSkillColor = (level) => {
    if (level >= 80) return 'text-green-600';
    if (level >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSkillBgColor = (level) => {
    if (level >= 80) return 'bg-green-100 border-green-200';
    if (level >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const SkillCard = ({ skill }) => {
    const isExpanded = expandedSkill === skill.id;
    const Icon = categoryIcons[skill.category];
    
    return (
      <div className={`bg-white rounded-xl shadow-sm border-2 ${getSkillBgColor(skill.currentLevel)} hover:shadow-md transition-all duration-200`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${skill.category === 'Technical' ? 'bg-blue-100' : skill.category === 'Soft Skills' ? 'bg-purple-100' : 'bg-green-100'}`}>
                <Icon className={`w-5 h-5 ${skill.category === 'Technical' ? 'text-blue-600' : skill.category === 'Soft Skills' ? 'text-purple-600' : 'text-green-600'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                <p className="text-sm text-gray-500">{skill.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getTrendIcon(skill.trending)}
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(skill.priority)}`}>
                {skill.priority}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Current Level</span>
              <span className={`text-lg font-bold ${getSkillColor(skill.currentLevel)}`}>
                {skill.currentLevel}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${skill.currentLevel >= 80 ? 'bg-green-500' : skill.currentLevel >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${skill.currentLevel}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Target: {skill.targetLevel}%</span>
              <span>Industry Avg: {skill.industryAverage}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Time to Target:</span> {skill.timeToTarget}
            </div>
            <button
              onClick={() => setExpandedSkill(isExpanded ? null : skill.id)}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Details {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>
          </div>

          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Chart */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Progress Trend</h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={skill.progressHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="level" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Learning Resources */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Recommended Resources</h4>
                  <div className="space-y-2">
                    {skill.resources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                          <p className="text-xs text-gray-500">{resource.type} • {resource.duration}</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Start
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Skills Overview</h1>
            <p className="text-gray-600">Monitor your professional growth and identify learning opportunities</p>
          </div>
          <button
            onClick={() => setShowAddSkillModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Average Skill Level</h3>
              <p className="text-2xl font-bold text-gray-900">{avgSkillLevel}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Skills Above 75%</h3>
              <p className="text-2xl font-bold text-gray-900">{skillsAboveAvg}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">High Priority</h3>
              <p className="text-2xl font-bold text-gray-900">{highPrioritySkills}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Target className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Skills</h3>
              <p className="text-2xl font-bold text-gray-900">{skillsData.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Skill Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  dataKey="value"
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills Gap Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Gap Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressOverview}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#3b82f6" name="Current Level" />
                <Bar dataKey="gap" fill="#ef4444" name="Gap to Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const Icon = categoryIcons[category];
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category === 'all' ? 'All Skills' : category}
                </button>
              );
            })}
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSkills.map(skill => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
          <p className="text-gray-500">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
};

export default SkillDevelopmentTracker;