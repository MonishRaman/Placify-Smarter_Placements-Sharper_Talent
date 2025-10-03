import React, { createContext, useContext, useState,useRef, useEffect } from "react";
import {
  Briefcase,
  CalendarDays,
  MapPin,
  Search,
  Moon,
  Sun,
  Star,
  FileText,
  Filter,
  Users,
  Building2,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import JobCard from "../../components/JobCard";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Theme Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

// Theme Toggle Component
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
};

// Jobs Component
const Jobs = () => {
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableDomains, setAvailableDomains] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
 const [isInitialLoad, setIsInitialLoad] = useState(true);

  const jobsPerPage = 6;
  const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // If path starts with /uploads, prepend API base URL
  if (imagePath.startsWith('/uploads')) {
    return `${API_BASE}${imagePath}`;
  }
  // If it's already a complete URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Default case - prepend API base URL
  return `${API_BASE}/${imagePath}`;
};

  const fetchJobs = async (page = 1, applyFilters = false) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {
        page: page,
        limit: jobsPerPage,
      };

      // Add filters if applying filters or if they exist
      if (
        applyFilters ||
        searchTerm ||
        selectedType !== "All" ||
        selectedDomain !== "All" ||
        selectedLocation !== "All" ||
        selectedStatus !== "All"
      ) {
        if (searchTerm) params.search = searchTerm;
        if (selectedType !== "All") params.type = selectedType;
        if (selectedDomain !== "All") params.domain = selectedDomain;
        if (selectedLocation !== "All") params.location = selectedLocation;
        if (selectedStatus !== "All") params.status = selectedStatus;
      }

      const response = await axios.get(`${API_BASE}/api/jobs`, { params });

      if (response.data.success) {
        setJobsData(response.data.jobs);
        setTotalJobs(response.data.totalJobs);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);

        // Update filter options from backend
        if (response.data.filters?.available) {
          setAvailableTypes(response.data.filters.available.types || []);
          setAvailableDomains(response.data.filters.available.domains || []);
          setAvailableLocations(
            response.data.filters.available.locations || []
          );
        }
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError(error.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // Reset filters function
  const resetFilters = () => {
  setSearchTerm("");
  setSelectedType("All");
  setSelectedDomain("All");
  setSelectedLocation("All");
  setSelectedStatus("All");
  setCurrentPage(1);
  setIsInitialLoad(false);
};
 // Updated useEffect
useEffect(() => {
  // Skip on initial load (handled separately)
  if (isInitialLoad) return;
  
  const delayedSearch = setTimeout(() => {
    const hasActiveFilters = 
      searchTerm !== "" ||
      selectedType !== "All" ||
      selectedDomain !== "All" ||
      selectedLocation !== "All" ||
      selectedStatus !== "All";
    
    if (hasActiveFilters) {
      setCurrentPage(1);
      fetchJobs(1, true);
    }
    else{
      setCurrentPage(1);
      fetchJobs(1, false);
    }
  }, 1000);

  return () => clearTimeout(delayedSearch);
}, [searchTerm, selectedType, selectedDomain, selectedLocation, selectedStatus]);
// Apply filters function
  const applyFilters = () => {
    setCurrentPage(1);
    fetchJobs(1, true);
  };


  // Initial load
  useEffect(() => {
    fetchJobs(1);
    setIsInitialLoad(false);
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchJobs(page, true); // Apply current filters when changing page
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Loading amazing opportunities...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Failed to load jobs
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => fetchJobs(1)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Briefcase className="w-10 h-10" />
              Explore Opportunities
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover your next career move with our curated job listings from
              top companies
            </p>
            <div className="mt-6 flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{totalJobs} Jobs Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Top Companies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-300">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg transition-colors duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-300"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Clear all filters
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top duration-300">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="All">All Types</option>
                {availableTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="All">All Domains</option>
                {availableDomains.map((domain, index) => (
                  <option key={index} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="All">All Locations</option>
                {availableLocations.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {jobsData.length} of {totalJobs} jobs
          </p>
        </div>

         {/* Job Cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {jobsData.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                No opportunities found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Try adjusting your search criteria to find more jobs
              </p>
            </div>
          ) : (
            jobsData.map((job) => (
              <JobCard 
                key={job._id} 
                job={job} 
                getImageUrl={getImageUrl} 
                formatDate={formatDate} 
              />
            ))
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    currentPage === index + 1
                      ? "bg-purple-600 text-white"
                      : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Resume Builder Component
const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    education: "",
    experience: "",
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Resume Data:", formData);
    setPreviewMode(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="text-blue-600 dark:text-blue-400 text-4xl" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Resume Builder
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create a professional resume that stands out to employers
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Enter Your Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Personal Information
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 1234567890"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Professional Summary
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write a brief summary about your professional background and career goals..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript, React, Node.js, Python, MongoDB"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                />
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Education
                </label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g. Bachelor of Technology in Computer Science, XYZ University, 2020-2024"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Work Experience
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows="4"
                  placeholder="e.g. Software Developer Intern at ABC Company (Jun 2023 - Aug 2023): Developed web applications using React and Node.js..."
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Generate Resume
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors duration-300"
                >
                  Preview
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Resume Preview
            </h2>

            {previewMode || formData.name ? (
              <div className="space-y-6 text-sm">
                {/* Header */}
                <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formData.name || "Your Name"}
                  </h1>
                  <div className="mt-2 text-gray-600 dark:text-gray-400">
                    <p>{formData.email || "your.email@example.com"}</p>
                    <p>{formData.phone || "+91 1234567890"}</p>
                  </div>
                </div>

                {/* Summary */}
                {formData.summary && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Professional Summary
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {formData.summary}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {formData.skills && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.split(",").map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {formData.education && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Education
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {formData.education}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {formData.experience && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Work Experience
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {formData.experience}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Fill out the form to see your resume preview
                </p>
              </div>
            )}

            {/* Download Button */}
            {(previewMode || formData.name) && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Interview Experience Component
const InterviewExperience = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const experiences = [
    {
      id: 1,
      company: "Google",
      role: "Software Engineer Intern",
      difficulty: "Hard",
      rating: 4.5,
      date: "March 2024",
      rounds: [
        "Online Assessment",
        "Technical Interview 1",
        "Technical Interview 2",
        "HR Round",
      ],
      content:
        "The process included an online assessment followed by two rounds focused on DSA and system design. Interviewers were supportive and provided hints when needed. The questions were challenging but fair.",
      tips: [
        "Practice data structures and algorithms thoroughly",
        "Be ready to explain your thought process",
        "System design basics are important",
        "Don't panic if you get stuck - ask clarifying questions",
      ],
      color: "from-yellow-400 to-orange-500",
      duration: "3 weeks",
      salary: "₹1,20,000/month",
    },
    {
      id: 2,
      company: "TCS",
      role: "Graduate Trainee",
      difficulty: "Medium",
      rating: 4.0,
      date: "January 2024",
      rounds: ["Aptitude Test", "Technical Interview", "HR Interview"],
      content:
        "Aptitude + technical round with Java and SQL. HR tested communication skills and teamwork scenarios. The process was well-organized and the interviewers were friendly.",
      tips: [
        "Focus on core programming concepts",
        "Prepare for basic SQL queries",
        "Practice aptitude questions",
        "Be confident during HR round",
      ],
      color: "from-green-400 to-teal-500",
      duration: "2 weeks",
      salary: "₹3,50,000/year",
    },
    {
      id: 3,
      company: "Infosys",
      role: "System Engineer",
      difficulty: "Easy",
      rating: 3.8,
      date: "February 2024",
      rounds: ["Online Test", "Technical + HR Interview"],
      content:
        "Online test included verbal and aptitude. Interview revolved around my final year project and basic coding. The overall experience was smooth and stress-free.",
      tips: [
        "Prepare your projects well",
        "Basic coding skills are sufficient",
        "Communication skills matter a lot",
        "Be honest about your knowledge",
      ],
      color: "from-purple-400 to-indigo-500",
      duration: "1 week",
      salary: "₹4,00,000/year",
    },
    {
      id: 4,
      company: "Microsoft",
      role: "Software Developer Intern",
      difficulty: "Hard",
      rating: 4.8,
      date: "April 2024",
      rounds: [
        "Online Assessment",
        "Phone Screen",
        "Virtual Onsite (4 rounds)",
        "HR Discussion",
      ],
      content:
        "Very thorough process with multiple coding rounds and system design. Interviewers were excellent and the questions were thoughtfully designed. Great learning experience overall.",
      tips: [
        "Master leetcode medium/hard problems",
        "System design is crucial",
        "Behavioral questions are important",
        "Be prepared for follow-up questions",
      ],
      color: "from-blue-400 to-cyan-500",
      duration: "4 weeks",
      salary: "₹1,80,000/month",
    },
    {
      id: 5,
      company: "Amazon",
      role: "SDE Intern",
      difficulty: "Hard",
      rating: 4.3,
      date: "February 2024",
      rounds: [
        "Online Assessment",
        "Technical Interview 1",
        "Technical Interview 2",
        "Bar Raiser",
      ],
      content:
        "Focus on leadership principles and problem-solving approach. Heavy emphasis on past experiences and how you handled challenges. Technical rounds were algorithm-heavy.",
      tips: [
        "Know Amazon's leadership principles",
        "Prepare STAR format stories",
        "Practice tree and graph problems",
        "Be ready for behavioral deep dives",
      ],
      color: "from-orange-400 to-red-500",
      duration: "3 weeks",
      salary: "₹1,50,000/month",
    },
    {
      id: 6,
      company: "Flipkart",
      role: "Software Engineer",
      difficulty: "Medium",
      rating: 4.2,
      date: "March 2024",
      rounds: [
        "Machine Test",
        "Technical Interview 1",
        "Technical Interview 2",
        "Hiring Manager Round",
      ],
      content:
        "Good mix of coding and system design questions. Machine test was time-bound with multiple coding problems. Interviewers focused on optimization and scalability.",
      tips: [
        "Practice coding under time pressure",
        "Focus on optimization techniques",
        "Understand database concepts",
        "Be ready to discuss trade-offs",
      ],
      color: "from-indigo-400 to-purple-500",
      duration: "2 weeks",
      salary: "₹18,00,000/year",
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900";
      case "Medium":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900";
      case "Hard":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Users className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Interview Experiences</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Learn from real interview experiences shared by candidates who
            successfully cracked technical and HR rounds at top companies. Get
            insights, tips, and prepare better for your dream job.
          </p>
          <div className="mt-8 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Real Experiences</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <span>Top Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Recent Updates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Experience Cards */}
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              {/* Card Header */}
              <div
                className={`bg-gradient-to-r ${exp.color} p-6 text-white relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold">{exp.company}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      <span className="text-sm font-medium">{exp.rating}</span>
                    </div>
                  </div>
                  <p className="text-lg opacity-90 mb-2">{exp.role}</p>
                  <div className="flex items-center justify-between text-sm opacity-80">
                    <span>{exp.date}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                        exp.difficulty
                      )}`}
                    >
                      {exp.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Duration
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {exp.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Package
                    </span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {exp.salary}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Interview Rounds
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {exp.rounds.map((round, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        {round}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {exp.content}
                </p>

                <button
                  onClick={() =>
                    setSelectedCompany(
                      selectedCompany === exp.id ? null : exp.id
                    )
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {selectedCompany === exp.id
                    ? "Hide Details"
                    : "View Tips & Details"}
                </button>

                {/* Expandable Tips Section */}
                {selectedCompany === exp.id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-in slide-in-from-top duration-300">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Interview Tips
                    </h4>
                    <ul className="space-y-2">
                      {exp.tips.map((tip, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 transition-colors duration-300">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🎯 Ready to Share Your Experience?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Help future candidates by sharing your interview journey. Your
              experience could be the key to someone's success story!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                Share Your Experience
              </button>
              <button className="px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                Browse More Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with Navigation
const App = () => {
  const [currentPage, setCurrentPage] = useState("jobs");

  const navigation = [
    { id: "jobs", label: "Jobs", icon: Briefcase },
    //{ id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: "interviews", label: "Interview Experience", icon: Users },
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "jobs":
        return <Jobs />;
      case "resume":
        return <ResumeBuilder />;
      case "interviews":
        return <InterviewExperience />;
      default:
        return <Jobs />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <ThemeToggle />

        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    CareerPortal
                  </span>
                </div>

                <div className="hidden md:flex items-center gap-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                          currentPage === item.id
                            ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden pb-4">
              <div className="flex gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg font-medium transition-colors duration-300 ${
                        currentPage === item.id
                          ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        {renderCurrentPage()}
      </div>
    </ThemeProvider>
  );
};

export default App;
