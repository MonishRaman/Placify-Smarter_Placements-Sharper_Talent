import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  Building2,
  BadgeCheck,
  ArrowLeft,
  Clock,
  Users,
  DollarSign,
  Briefcase,
  GraduationCap,
  Star,
  Share2,
  Bookmark,
  Send,
  CheckCircle,
  AlertCircle,
  X,
  Globe,
  Mail,
  Phone
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const JobDetailsPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId } = useParams();
  
  // Get job data from navigation state
  const { job } = location.state || {};
  
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(!job);
  const [jobData, setJobData] = useState(job);

  // Recreate utility functions
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('/uploads')) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days ago
  const getDaysAgo = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  };

  // Fetch job data if not available from navigation state
  useEffect(() => {
    if (!jobData && jobId) {
      fetchJobData();
    }
  }, [jobId, jobData]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${jobId}`);
      const data = await response.json();
      
      if (data.success) {
        setJobData(data.job);
      } else {
        console.error('Failed to fetch job data');
      }
    } catch (error) {
      console.error('Error fetching job data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async () => {
    if (isApplied) return;
    
    setIsApplying(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${jobData._id || jobData.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsApplied(true);
        toast.success('Application submitted successfully!');
      } else {
        toast.error(data.message || 'Failed to apply for job');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to apply for job');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Job removed from saved' : 'Job saved successfully');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: jobData?.title || 'Job Opportunity',
        text: `Check out this job opportunity at ${jobData?.company?.name || 'this company'}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-blue-300/20 dark:from-purple-800/10 dark:to-blue-800/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 dark:from-blue-800/10 dark:to-indigo-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Jobs
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleSaveJob}
              className={`p-3 backdrop-blur-xl rounded-xl shadow-lg border transition-all duration-300 ${
                isSaved
                  ? 'bg-yellow-500/20 border-yellow-300/50 text-yellow-600 dark:text-yellow-400'
                  : 'bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
              } hover:shadow-xl`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Job Header Card */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
              <div className="flex items-start gap-6">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center border border-white/50 dark:border-slate-600/50 shadow-lg overflow-hidden">
                    {/* Use pre-processed URL or recreate it */}
                    {(jobData.companyLogoUrl || getImageUrl(jobData.company?.profileImage)) ? (
                      <img
                        src={jobData.companyLogoUrl || getImageUrl(jobData.company.profileImage)}
                        alt={`${jobData.company?.name || 'Company'} logo`}
                        className="w-20 h-20 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`${
                        (jobData.companyLogoUrl || getImageUrl(jobData.company?.profileImage)) ? 'hidden' : 'flex'
                      } items-center justify-center w-16 h-16`}
                    >
                      <Building2 className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {jobData.title || "Job Title"}
                  </h1>
                  <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {jobData.company?.name || "Company Name"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Posted {jobData.formattedDate || getDaysAgo(jobData.createdAt)}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="px-4 py-2 rounded-full font-medium bg-blue-50 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300 border border-blue-200/60 dark:border-blue-600/40 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {jobData.location || "Remote"}
                    </span>
                    <span className="px-4 py-2 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-700/20 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-600/40 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {jobData.type || "Full-time"}
                    </span>
                    <span className="px-4 py-2 rounded-full font-medium bg-purple-50 text-purple-700 dark:bg-purple-700/20 dark:text-purple-300 border border-purple-200/60 dark:border-purple-600/40">
                      {jobData.domain || "Technology"}
                    </span>
                    <span
                      className={`px-4 py-2 rounded-full font-medium border ${
                        jobData.status === "Open"
                          ? "bg-green-50 text-green-700 dark:bg-green-700/20 dark:text-green-300 border-green-200/60 dark:border-green-600/40"
                          : "bg-red-50 text-red-700 dark:bg-red-700/20 dark:text-red-300 border-red-200/60 dark:border-red-600/40"
                      }`}
                    >
                      {jobData.status || "Open"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                Job Description
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                  {jobData.description || "No description available for this position."}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {jobData.requirements && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  Requirements
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                    {jobData.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Skills */}
            {jobData.skills && jobData.skills.length > 0 && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-3">
                  {jobData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium border border-purple-200/60 dark:border-purple-600/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Apply Card */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {jobData.salary || "Salary not disclosed"}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {jobData.salary && jobData.salary !== "Not disclosed" ? "per year" : ""}
                </p>
              </div>

              <button
                onClick={handleApplyJob}
                disabled={isApplying || isApplied}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  isApplied
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : isApplying
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transform'
                }`}
              >
                {isApplying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Applying...
                  </>
                ) : isApplied ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Applied Successfully
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Apply Now
                  </>
                )}
              </button>

              {isApplied && (
                <p className="text-center text-sm text-green-600 dark:text-green-400 mt-3">
                  Your application has been submitted successfully!
                </p>
              )}
            </div>

            {/* Job Stats */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Job Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Posted
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {jobData.formattedDate || formatDate(jobData.createdAt)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Type
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {jobData.type || "Full-time"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Experience
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {jobData.experience || "Not specified"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Salary
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {jobData.salary || "Not disclosed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            {jobData.company && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">About Company</h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 flex items-center justify-center overflow-hidden">
                    {(jobData.companyLogoUrl || getImageUrl(jobData.company.profileImage)) ? (
                      <img
                        src={jobData.companyLogoUrl || getImageUrl(jobData.company.profileImage)}
                        alt={`${jobData.company.name} logo`}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {jobData.company.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {jobData.company.industry || "Technology"}
                    </p>
                  </div>
                </div>
                
                {jobData.company.description && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {jobData.company.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;