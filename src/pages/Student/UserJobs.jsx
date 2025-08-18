import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, 
  MapPin, 
  CalendarDays, 
  Search, 
  Filter,
  Star,
  TrendingUp,
  Clock,
  Building,
  GraduationCap,
  Moon,
  Sun,
  Heart,
  ExternalLink,
  Zap,
  Target,
  Award
} from 'lucide-react';

const UserJobs = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [jobsData, setJobsData] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState(new Set());
  
  const jobsPerPage = 6;

  // Mock user profile - in real app, fetch from API/localStorage
  const mockUserProfile = {
    name: "John Doe",
    major: "Computer Science",
    education: "Bachelor's",
    university: "MIT",
    skills: ["JavaScript", "React", "Python", "Machine Learning"],
    experience: "Entry Level"
  };

  // Comprehensive jobs database with major mapping
  const allJobsData = [
    // Computer Science Jobs
    {
      id: "cs1",
      title: "Frontend Developer",
      company: "TechFlow Solutions",
      type: "Full-Time",
      domain: "Web Development",
      location: "San Francisco, CA",
      salary: "$85,000 - $120,000",
      status: "Open",
      date: "2025-08-20",
      relevantMajors: ["Computer Science", "Software Engineering", "Information Technology"],
      description: "Build responsive web applications using React, TypeScript, and modern CSS frameworks.",
      requirements: ["React.js", "JavaScript", "HTML/CSS", "Git"],
      matchScore: 95,
      isHot: true,
      companyLogo: "🚀",
      experience: "Entry Level"
    },
    {
      id: "cs2",
      title: "Machine Learning Engineer",
      company: "AI Innovations",
      type: "Full-Time",
      domain: "AI/ML",
      location: "Seattle, WA",
      salary: "$110,000 - $160,000",
      status: "Open",
      date: "2025-08-18",
      relevantMajors: ["Computer Science", "Data Science", "Mathematics"],
      description: "Develop and deploy ML models for real-world applications.",
      requirements: ["Python", "TensorFlow", "PyTorch", "Statistics"],
      matchScore: 92,
      isHot: true,
      companyLogo: "🤖",
      experience: "Mid Level"
    },
    {
      id: "cs3",
      title: "Software Development Intern",
      company: "StartupHub",
      type: "Internship",
      domain: "Software Development",
      location: "Remote",
      salary: "$20 - $25/hour",
      status: "Open",
      date: "2025-08-25",
      relevantMajors: ["Computer Science", "Software Engineering"],
      description: "Join our dynamic team to build scalable software solutions.",
      requirements: ["Programming fundamentals", "Git", "Problem solving"],
      matchScore: 88,
      isHot: false,
      companyLogo: "💻",
      experience: "Entry Level"
    },
    {
      id: "cs4",
      title: "DevOps Engineer",
      company: "CloudTech Corp",
      type: "Full-Time",
      domain: "DevOps",
      location: "Austin, TX",
      salary: "$95,000 - $140,000",
      status: "Open",
      date: "2025-08-22",
      relevantMajors: ["Computer Science", "Information Systems"],
      description: "Manage CI/CD pipelines and cloud infrastructure.",
      requirements: ["AWS", "Docker", "Kubernetes", "Linux"],
      matchScore: 85,
      isHot: false,
      companyLogo: "☁️",
      experience: "Mid Level"
    },
    // Business Administration Jobs
    {
      id: "ba1",
      title: "Business Analyst",
      company: "Corporate Dynamics",
      type: "Full-Time",
      domain: "Business Analysis",
      location: "New York, NY",
      salary: "$70,000 - $95,000",
      status: "Open",
      date: "2025-08-19",
      relevantMajors: ["Business Administration", "Economics", "Finance"],
      description: "Analyze business processes and identify improvement opportunities.",
      requirements: ["Excel", "SQL", "Business Intelligence", "Communication"],
      matchScore: 90,
      isHot: true,
      companyLogo: "📊",
      experience: "Entry Level"
    },
    {
      id: "ba2",
      title: "Project Manager Intern",
      company: "ManagePro",
      type: "Internship",
      domain: "Project Management",
      location: "Chicago, IL",
      salary: "$18 - $22/hour",
      status: "Open",
      date: "2025-08-24",
      relevantMajors: ["Business Administration", "Management"],
      description: "Support project teams in planning and execution.",
      requirements: ["Organization", "Communication", "Microsoft Office"],
      matchScore: 82,
      isHot: false,
      companyLogo: "📋",
      experience: "Entry Level"
    },
    // Marketing Jobs
    {
      id: "mk1",
      title: "Digital Marketing Specialist",
      company: "BrandBoost",
      type: "Full-Time",
      domain: "Digital Marketing",
      location: "Los Angeles, CA",
      salary: "$55,000 - $75,000",
      status: "Open",
      date: "2025-08-21",
      relevantMajors: ["Marketing", "Communications", "Business Administration"],
      description: "Create and manage digital marketing campaigns across platforms.",
      requirements: ["Google Analytics", "Social Media", "SEO", "Content Creation"],
      matchScore: 87,
      isHot: true,
      companyLogo: "📱",
      experience: "Entry Level"
    },
    // Data Science Jobs
    {
      id: "ds1",
      title: "Data Scientist",
      company: "DataWorks Analytics",
      type: "Full-Time",
      domain: "Data Science",
      location: "Boston, MA",
      salary: "$100,000 - $135,000",
      status: "Open",
      date: "2025-08-17",
      relevantMajors: ["Data Science", "Statistics", "Computer Science", "Mathematics"],
      description: "Extract insights from complex datasets to drive business decisions.",
      requirements: ["Python", "R", "SQL", "Machine Learning", "Statistics"],
      matchScore: 93,
      isHot: true,
      companyLogo: "📈",
      experience: "Mid Level"
    },
    // Mechanical Engineering Jobs
    {
      id: "me1",
      title: "Mechanical Design Engineer",
      company: "Engineering Solutions Inc",
      type: "Full-Time",
      domain: "Mechanical Engineering",
      location: "Detroit, MI",
      salary: "$75,000 - $100,000",
      status: "Open",
      date: "2025-08-23",
      relevantMajors: ["Mechanical Engineering", "Aerospace Engineering"],
      description: "Design and develop mechanical systems and components.",
      requirements: ["CAD Software", "SolidWorks", "Engineering Principles"],
      matchScore: 91,
      isHot: false,
      companyLogo: "⚙️",
      experience: "Entry Level"
    }
  ];

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUserProfile(mockUserProfile);
        setJobsData(allJobsData);
        
        // Load saved jobs from localStorage
        const saved = localStorage.getItem('savedJobs');
        if (saved) {
          setSavedJobs(new Set(JSON.parse(saved)));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Filter jobs based on user's major and preferences
  const relevantJobs = useMemo(() => {
    if (!userProfile) return [];

    return jobsData.filter(job => 
      job.relevantMajors.includes(userProfile.major) ||
      job.requirements.some(req => userProfile.skills.includes(req))
    );
  }, [jobsData, userProfile]);

  // Apply additional filters
  const filteredJobs = useMemo(() => {
    let filtered = relevantJobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.domain.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === "All" || job.type === selectedType;
      const matchesLocation = selectedLocation === "All" || job.location.includes(selectedLocation);

      return matchesSearch && matchesType && matchesLocation;
    });

    // Sort jobs
    switch (sortBy) {
      case 'relevance':
        filtered = filtered.sort((a, b) => b.matchScore - a.matchScore);
        break;
      case 'date':
        filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'salary':
        filtered = filtered.sort((a, b) => {
          const aMax = parseInt(a.salary.match(/\$(\d+,?\d*)/g)?.[1]?.replace(',', '') || '0');
          const bMax = parseInt(b.salary.match(/\$(\d+,?\d*)/g)?.[1]?.replace(',', '') || '0');
          return bMax - aMax;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [relevantJobs, searchTerm, selectedType, selectedLocation, sortBy]);

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify([...newSavedJobs]));
  };

  const getMatchBadgeColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    if (score >= 80) return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
  };

  const themeClasses = isDarkMode 
    ? 'dark bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Finding Perfect Jobs for You</h3>
          <p className="text-gray-600 dark:text-gray-400">Analyzing your profile and matching opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-10">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border dark:border-gray-700"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Header */}
      <div className="pt-8 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userProfile?.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {userProfile?.name}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                  <GraduationCap className="w-4 h-4" />
                  {userProfile?.major} • {userProfile?.education} • {userProfile?.university}
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredJobs.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Matched Jobs</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: <Target className="w-5 h-5" />, title: "Match Rate", value: "92%", color: "text-green-600" },
              { icon: <TrendingUp className="w-5 h-5" />, title: "New Today", value: "12", color: "text-blue-600" },
              { icon: <Heart className="w-5 h-5" />, title: "Saved Jobs", value: savedJobs.size, color: "text-red-600" },
              { icon: <Award className="w-5 h-5" />, title: "Applications", value: "8", color: "text-purple-600" }
            ].map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filters:</span>
              </div>
              
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="All">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
                <option value="Part-Time">Part-Time</option>
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="All">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="San Francisco">San Francisco</option>
                <option value="New York">New York</option>
                <option value="Seattle">Seattle</option>
                <option value="Austin">Austin</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="relevance">Best Match</option>
                <option value="date">Latest</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {currentJobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters to see more opportunities</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeIn overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{job.companyLogo}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {job.title}
                            {job.isHot && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 text-xs font-medium rounded-full">
                                <Zap className="w-3 h-3" />
                                Hot
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.company}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            savedJobs.has(job.id)
                              ? 'text-red-500 fill-red-500'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Match Score */}
                    <div className="mb-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getMatchBadgeColor(job.matchScore)}`}>
                        <Star className="w-4 h-4" />
                        {job.matchScore}% Match
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <CalendarDays className="w-4 h-4" />
                        Posted {new Date(job.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                        <span>💰</span>
                        {job.salary}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-lg">
                        {job.type}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs rounded-lg">
                        {job.domain}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs rounded-lg">
                        {job.experience}
                      </span>
                    </div>

                    {/* Requirements */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.slice(0, 3).map((req, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 text-xs rounded ${
                              userProfile?.skills.includes(req)
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                            +{job.requirements.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                        Apply Now
                      </button>
                      <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default UserJobs;