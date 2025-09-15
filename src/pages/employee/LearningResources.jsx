import React, { useState } from 'react';
import {
  BookOpen, Play, FileText, Award, Clock, Star, Search, Filter, 
  Bookmark, BookmarkCheck, TrendingUp, Users, Calendar, ChevronRight,
  PlayCircle, Download, ExternalLink, Target, Brain, Code, Zap,
  CheckCircle, RotateCcw, PlusCircle, Eye, Heart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const LearningResources = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');

  // Static learning data
  const learningData = {
    stats: {
      totalCourses: 156,
      completedCourses: 23,
      inProgressCourses: 5,
      bookmarkedItems: 18,
      learningHours: 145,
      certificationsEarned: 7
    },
    learningPaths: [
      {
        id: 1,
        title: "Full Stack Developer Path",
        description: "Complete journey from frontend to backend development",
        progress: 65,
        totalCourses: 12,
        completedCourses: 8,
        estimatedTime: "120 hours",
        difficulty: "Intermediate",
        skills: ["React", "Node.js", "MongoDB", "AWS"],
        color: "blue"
      },
      {
        id: 2,
        title: "Leadership Excellence",
        description: "Build essential leadership and management skills",
        progress: 30,
        totalCourses: 8,
        completedCourses: 2,
        estimatedTime: "80 hours",
        difficulty: "Beginner",
        skills: ["Leadership", "Communication", "Team Management"],
        color: "purple"
      },
      {
        id: 3,
        title: "Data Science Fundamentals",
        description: "Learn data analysis, machine learning basics",
        progress: 15,
        totalCourses: 10,
        completedCourses: 1,
        estimatedTime: "160 hours",
        difficulty: "Advanced",
        skills: ["Python", "Machine Learning", "Statistics"],
        color: "green"
      }
    ],
    resources: [
      {
        id: 1,
        title: "Advanced React Patterns and Best Practices",
        type: "Course",
        category: "Technical",
        provider: "TechLearning Pro",
        duration: "8 hours",
        rating: 4.8,
        reviews: 2341,
        difficulty: "Advanced",
        price: "Free",
        thumbnail: "🚀",
        isBookmarked: true,
        isCompleted: false,
        inProgress: true,
        progress: 45,
        skills: ["React.js", "JavaScript", "Frontend"],
        description: "Master advanced React concepts including hooks, context, performance optimization, and modern patterns."
      },
      {
        id: 2,
        title: "Leadership Communication Strategies",
        type: "Article",
        category: "Soft Skills",
        provider: "Business Insights",
        duration: "15 min",
        rating: 4.6,
        reviews: 856,
        difficulty: "Beginner",
        price: "Free",
        thumbnail: "💼",
        isBookmarked: false,
        isCompleted: true,
        inProgress: false,
        progress: 100,
        skills: ["Leadership", "Communication"],
        description: "Essential communication techniques for effective leadership and team management."
      },
      {
        id: 3,
        title: "Node.js Microservices Architecture",
        type: "Video",
        category: "Technical",
        provider: "CodeMaster",
        duration: "12 hours",
        rating: 4.9,
        reviews: 1876,
        difficulty: "Advanced",
        price: "$49",
        thumbnail: "⚙️",
        isBookmarked: true,
        isCompleted: false,
        inProgress: false,
        progress: 0,
        skills: ["Node.js", "Microservices", "Backend"],
        description: "Build scalable microservices using Node.js, Docker, and modern deployment strategies."
      },
      {
        id: 4,
        title: "Python for Data Analysis",
        type: "Course",
        category: "Technical",
        provider: "DataScience Hub",
        duration: "20 hours",
        rating: 4.7,
        reviews: 3245,
        difficulty: "Intermediate",
        price: "$29",
        thumbnail: "🐍",
        isBookmarked: false,
        isCompleted: false,
        inProgress: true,
        progress: 25,
        skills: ["Python", "Data Analysis", "Pandas"],
        description: "Learn data manipulation, visualization, and analysis using Python and popular libraries."
      },
      {
        id: 5,
        title: "Effective Team Management",
        type: "Book",
        category: "Soft Skills",
        provider: "Business Books",
        duration: "6 hours",
        rating: 4.5,
        reviews: 567,
        difficulty: "Beginner",
        price: "$19",
        thumbnail: "📚",
        isBookmarked: true,
        isCompleted: false,
        inProgress: false,
        progress: 0,
        skills: ["Management", "Leadership", "Team Building"],
        description: "Comprehensive guide to building and managing high-performing teams in modern workplaces."
      },
      {
        id: 6,
        title: "AWS Cloud Fundamentals",
        type: "Workshop",
        category: "Technical",
        provider: "Cloud Academy",
        duration: "16 hours",
        rating: 4.8,
        reviews: 2190,
        difficulty: "Intermediate",
        price: "$99",
        thumbnail: "☁️",
        isBookmarked: false,
        isCompleted: false,
        inProgress: false,
        progress: 0,
        skills: ["AWS", "Cloud Computing", "DevOps"],
        description: "Hands-on workshop covering AWS services, deployment, and cloud architecture best practices."
      }
    ]
  };

  const categories = ['all', 'Technical', 'Soft Skills', 'Domain'];
  const types = ['all', 'Course', 'Video', 'Article', 'Book', 'Workshop'];

  // Filter resources
  const filteredResources = learningData.resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBookmark = !showBookmarked || resource.isBookmarked;
    
    return matchesCategory && matchesType && matchesSearch && matchesBookmark;
  });

  // Learning progress data for chart
  const progressData = [
    { month: 'Jan', hours: 12, courses: 2 },
    { month: 'Feb', hours: 18, courses: 3 },
    { month: 'Mar', hours: 25, courses: 4 },
    { month: 'Apr', hours: 22, courses: 3 },
    { month: 'May', hours: 30, courses: 5 },
    { month: 'Jun', hours: 28, courses: 4 },
    { month: 'Jul', hours: 35, courses: 6 }
  ];

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Course': return <BookOpen className="w-4 h-4" />;
      case 'Video': return <Play className="w-4 h-4" />;
      case 'Article': return <FileText className="w-4 h-4" />;
      case 'Book': return <BookOpen className="w-4 h-4" />;
      case 'Workshop': return <Users className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ResourceCard = ({ resource }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{resource.thumbnail}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{resource.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500">{resource.provider}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500">{resource.duration}</span>
            </div>
          </div>
        </div>
        <button 
          className={`p-2 rounded-full transition-colors ${
            resource.isBookmarked 
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          {resource.isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {getTypeIcon(resource.type)}
            <span className="text-sm text-gray-600">{resource.type}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-900 font-medium">{resource.rating}</span>
            <span className="text-sm text-gray-500">({resource.reviews})</span>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(resource.difficulty)}`}>
          {resource.difficulty}
        </span>
      </div>

      {resource.inProgress && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-blue-600">{resource.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${resource.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {resource.skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
            {skill}
          </span>
        ))}
        {resource.skills.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
            +{resource.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {resource.isCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : resource.inProgress ? (
            <RotateCcw className="w-5 h-5 text-blue-500" />
          ) : (
            <PlusCircle className="w-5 h-5 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-900">
            {resource.price}
          </span>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          {resource.isCompleted ? 'Review' : resource.inProgress ? 'Continue' : 'Start Learning'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );

  const LearningPathCard = ({ path }) => (
    <div className={`bg-gradient-to-r from-${path.color}-500 to-${path.color}-600 rounded-xl text-white p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">{path.title}</h3>
          <p className="text-${path.color}-100 text-sm">{path.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{path.progress}%</div>
          <div className="text-xs text-${path.color}-200">Complete</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${path.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4 text-sm text-${path.color}-100">
          <span>{path.completedCourses}/{path.totalCourses} courses</span>
          <span>•</span>
          <span>{path.estimatedTime}</span>
          <span>•</span>
          <span>{path.difficulty}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {path.skills.map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-white bg-opacity-20 text-xs rounded-md">
            {skill}
          </span>
        ))}
      </div>

      <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 rounded-lg transition-colors">
        Continue Learning Path
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Resources Hub</h1>
            <p className="text-gray-600">Discover courses, track progress, and accelerate your professional growth</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{learningData.stats.learningHours}</div>
              <div className="text-xs text-gray-500">Learning Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{learningData.stats.certificationsEarned}</div>
              <div className="text-xs text-gray-500">Certificates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{learningData.stats.totalCourses}</p>
              <p className="text-xs text-gray-500">Available Courses</p>
            </div>
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{learningData.stats.completedCourses}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{learningData.stats.inProgressCourses}</p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
            <RotateCcw className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600">{learningData.stats.bookmarkedItems}</p>
              <p className="text-xs text-gray-500">Bookmarked</p>
            </div>
            <Bookmark className="w-6 h-6 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-600">{learningData.stats.learningHours}</p>
              <p className="text-xs text-gray-500">Total Hours</p>
            </div>
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600">{learningData.stats.certificationsEarned}</p>
              <p className="text-xs text-gray-500">Certificates</p>
            </div>
            <Award className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
        <div className="flex space-x-8 mb-6">
          <button
            onClick={() => setActiveTab('discover')}
            className={`pb-2 font-medium transition-colors ${
              activeTab === 'discover'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Discover Resources
          </button>
          <button
            onClick={() => setActiveTab('paths')}
            className={`pb-2 font-medium transition-colors ${
              activeTab === 'paths'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Learning Paths
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`pb-2 font-medium transition-colors ${
              activeTab === 'progress'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Progress
          </button>
        </div>

        {activeTab === 'discover' && (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowBookmarked(!showBookmarked)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  showBookmarked 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                {showBookmarked ? 'Show All' : 'Bookmarked Only'}
              </button>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'paths' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {learningData.learningPaths.map(path => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} name="Hours" />
                    <Line type="monotone" dataKey="courses" stroke="#10b981" strokeWidth={2} name="Courses" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Completed "Leadership Communication Strategies"</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Play className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Started "Python for Data Analysis"</p>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Bookmark className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Bookmarked "Node.js Microservices Architecture"</p>
                    <p className="text-sm text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningResources;