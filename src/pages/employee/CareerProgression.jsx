import React, { useState } from 'react';
import {
  Target, TrendingUp, Award, BookOpen, Plus, Edit3, Star,
  MapPin, Clock, Users, Building, CheckCircle, Circle,
  ChevronRight, ChevronDown, ChevronUp, Calendar, Briefcase,
  GraduationCap, Trophy, Zap, ArrowRight, Settings, Filter
} from 'lucide-react';

const CareerProgression = () => {
  const [selectedPath, setSelectedPath] = useState(null);
  const [activeTimeline, setActiveTimeline] = useState('current');
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Career paths data
  const careerPaths = [
    {
      id: 1,
      title: "Frontend Specialist",
      description: "Master modern frontend technologies and user experience",
      icon: "💻",
      currentLevel: "Mid-level Developer",
      nextLevel: "Senior Frontend Developer",
      estimatedTime: "12-18 months",
      demand: "High",
      salaryRange: "$80k - $120k",
      skills: ["React", "TypeScript", "CSS/SCSS", "Testing"],
      companies: ["Google", "Meta", "Netflix", "Spotify"],
      milestones: [
        {
          id: 1,
          title: "Master Advanced React",
          description: "Learn hooks, context, performance optimization",
          status: "completed",
          dueDate: "2024-08-15",
          progress: 100,
          tasks: [
            { task: "Complete React hooks course", completed: true },
            { task: "Build 3 advanced projects", completed: true },
            { task: "Learn React performance optimization", completed: true }
          ]
        },
        {
          id: 2,
          title: "TypeScript Proficiency",
          description: "Become proficient in TypeScript for large applications",
          status: "in-progress",
          dueDate: "2024-10-30",
          progress: 65,
          tasks: [
            { task: "Complete TypeScript fundamentals", completed: true },
            { task: "Convert React project to TypeScript", completed: true },
            { task: "Learn advanced TypeScript patterns", completed: false },
            { task: "Build full-stack TypeScript app", completed: false }
          ]
        },
        {
          id: 3,
          title: "Testing & Quality Assurance",
          description: "Master testing frameworks and best practices",
          status: "pending",
          dueDate: "2024-12-15",
          progress: 20,
          tasks: [
            { task: "Learn Jest and React Testing Library", completed: false },
            { task: "Write comprehensive test suites", completed: false },
            { task: "E2E testing with Cypress", completed: false },
            { task: "Set up CI/CD with testing", completed: false }
          ]
        },
        {
          id: 4,
          title: "Team Leadership",
          description: "Develop skills to mentor junior developers",
          status: "pending",
          dueDate: "2025-03-01",
          progress: 0,
          tasks: [
            { task: "Mentor 2 junior developers", completed: false },
            { task: "Lead code review sessions", completed: false },
            { task: "Present technical talks", completed: false }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      description: "Become proficient in both frontend and backend development",
      icon: "🔧",
      currentLevel: "Junior Full Stack",
      nextLevel: "Mid-level Full Stack Engineer",
      estimatedTime: "18-24 months",
      demand: "Very High",
      salaryRange: "$90k - $140k",
      skills: ["React", "Node.js", "Database Design", "DevOps"],
      companies: ["Amazon", "Microsoft", "Uber", "Airbnb"],
      milestones: [
        {
          id: 1,
          title: "Backend API Development",
          description: "Master Node.js and API design patterns",
          status: "in-progress",
          dueDate: "2024-11-01",
          progress: 45,
          tasks: [
            { task: "Learn Node.js fundamentals", completed: true },
            { task: "Build REST APIs", completed: true },
            { task: "Learn GraphQL", completed: false },
            { task: "Implement authentication", completed: false }
          ]
        },
        {
          id: 2,
          title: "Database Management",
          description: "Learn both SQL and NoSQL databases",
          status: "pending",
          dueDate: "2025-01-15",
          progress: 15,
          tasks: [
            { task: "PostgreSQL fundamentals", completed: false },
            { task: "MongoDB basics", completed: false },
            { task: "Database optimization", completed: false }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Product Manager",
      description: "Transition from development to product management",
      icon: "📊",
      currentLevel: "Technical Lead",
      nextLevel: "Associate Product Manager",
      estimatedTime: "24-30 months",
      demand: "High",
      salaryRange: "$100k - $160k",
      skills: ["Strategy", "Analytics", "Communication", "Leadership"],
      companies: ["Apple", "Google", "Stripe", "Figma"],
      milestones: [
        {
          id: 1,
          title: "Product Strategy Fundamentals",
          description: "Learn product strategy and market analysis",
          status: "pending",
          dueDate: "2025-02-01",
          progress: 10,
          tasks: [
            { task: "Complete PM certification", completed: false },
            { task: "Analyze competitor products", completed: false },
            { task: "Create product roadmap", completed: false }
          ]
        }
      ]
    }
  ];

  const achievements = [
    { title: "React Certification", date: "Sep 2024", type: "certification" },
    { title: "Led Team Project", date: "Aug 2024", type: "leadership" },
    { title: "Published Article", date: "Jul 2024", type: "content" },
    { title: "Hackathon Winner", date: "Jun 2024", type: "competition" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <Circle className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'Very High': return 'text-green-600 bg-green-100';
      case 'High': return 'text-blue-600 bg-blue-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const CareerPathCard = ({ path }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{path.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{path.title}</h3>
              <p className="text-gray-600">{path.description}</p>
            </div>
          </div>
          <div className={`px-3 py-1 text-sm font-medium rounded-full ${getDemandColor(path.demand)}`}>
            {path.demand} Demand
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Current Level</div>
            <div className="font-semibold text-gray-900">{path.currentLevel}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Next Level</div>
            <div className="font-semibold text-gray-900">{path.nextLevel}</div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Estimated Time:</span>
            <span className="font-medium">{path.estimatedTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Salary Range:</span>
            <span className="font-medium">{path.salaryRange}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Key Skills</div>
          <div className="flex flex-wrap gap-2">
            {path.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">Top Companies</div>
          <div className="flex flex-wrap gap-2">
            {path.companies.slice(0, 3).map((company, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">
                {company}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setSelectedPath(path.id === selectedPath ? null : path.id)}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {selectedPath === path.id ? 'Hide Roadmap' : 'View Roadmap'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {selectedPath === path.id && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Career Roadmap</h4>
          <div className="space-y-4">
            {path.milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {index < path.milestones.length - 1 && (
                  <div className="absolute left-6 top-12 w-px h-16 bg-gray-300"></div>
                )}
                
                <div className={`flex items-start space-x-4 p-4 rounded-lg border-2 ${getStatusColor(milestone.status)}`}>
                  <div className="flex-shrink-0 p-2 rounded-full">
                    {getStatusIcon(milestone.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">{milestone.title}</h5>
                      <span className="text-sm text-gray-500">{milestone.dueDate}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{milestone.description}</p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            milestone.status === 'completed' ? 'bg-green-500' : 
                            milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedMilestone(expandedMilestone === milestone.id ? null : milestone.id)}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Tasks 
                      {expandedMilestone === milestone.id ? 
                        <ChevronUp className="w-4 h-4 ml-1" /> : 
                        <ChevronDown className="w-4 h-4 ml-1" />
                      }
                    </button>

                    {expandedMilestone === milestone.id && (
                      <div className="mt-4 space-y-2">
                        {milestone.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                            }`}>
                              {task.completed && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                              {task.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Progression</h1>
            <p className="text-gray-600">Plan your career journey and track your professional growth</p>
          </div>
          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Set Goal
          </button>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Current Role</h3>
              <p className="text-xl font-bold text-gray-900">Mid-level Developer</p>
              <p className="text-sm text-blue-600">Frontend Specialist Track</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Next Milestone</h3>
              <p className="text-xl font-bold text-gray-900">TypeScript</p>
              <p className="text-sm text-green-600">65% Complete</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Recent Achievement</h3>
              <p className="text-xl font-bold text-gray-900">React Certified</p>
              <p className="text-sm text-purple-600">Sept 2024</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg min-w-[200px]">
              <div className="flex items-center space-x-2 mb-2">
                {achievement.type === 'certification' && <GraduationCap className="w-4 h-4" />}
                {achievement.type === 'leadership' && <Users className="w-4 h-4" />}
                {achievement.type === 'content' && <BookOpen className="w-4 h-4" />}
                {achievement.type === 'competition' && <Trophy className="w-4 h-4" />}
                <span className="text-sm opacity-80">{achievement.date}</span>
              </div>
              <div className="font-semibold">{achievement.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Paths */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Explore Career Paths</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {careerPaths.map(path => (
            <CareerPathCard key={path.id} path={path} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Ready to Level Up?</h3>
        <p className="mb-6 opacity-90">Take action on your career goals with these recommended steps</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg hover:bg-opacity-30 transition-all">
            <BookOpen className="w-6 h-6 mb-2" />
            <div className="font-semibold">Find Learning Resources</div>
            <div className="text-sm opacity-80">Discover courses and materials</div>
          </button>
          <button className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg hover:bg-opacity-30 transition-all">
            <Users className="w-6 h-6 mb-2" />
            <div className="font-semibold">Network & Mentor</div>
            <div className="text-sm opacity-80">Connect with professionals</div>
          </button>
          <button className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg hover:bg-opacity-30 transition-all">
            <Zap className="w-6 h-6 mb-2" />
            <div className="font-semibold">Practice Skills</div>
            <div className="text-sm opacity-80">Build projects and practice</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerProgression;