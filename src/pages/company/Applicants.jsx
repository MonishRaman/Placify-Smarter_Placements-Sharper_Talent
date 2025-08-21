import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, User, Calendar, Clock, Award, AlertCircle, CheckCircle, XCircle, MoreHorizontal, Edit, Trash2, Mail, FileText, ExternalLink, Briefcase } from 'lucide-react';

const ApplicantsTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [jobRoleFilter, setJobRoleFilter] = useState('all');
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Mock data for applicants with additional fields
  const mockApplicants = [
    {
      id: 'PLC-2025-001',
      name: 'Arjun Sharma',
      email: 'arjun.sharma@college.edu',
      college: 'IIT Delhi',
      branch: 'Computer Science',
      year: '4th Year',
      cgpa: 8.9,
      jobRole: 'Software Engineer',
      status: 'shortlisted',
      appliedDate: '2025-01-15',
      interviewDate: '2025-01-18',
      resumeLink: 'https://example.com/resume/arjun_sharma.pdf',
      profileLink: 'https://linkedin.com/in/arjunsharma',
      aiScore: 87,
      technicalScore: 92,
      behavioralScore: 81,
      communicationScore: 89,
      overallGrade: 'A',
      feedback: 'Excellent technical skills with strong problem-solving approach. Good communication clarity.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun'
    },
    {
      id: 'PLC-2025-002',
      name: 'Priya Patel',
      email: 'priya.patel@college.edu',
      college: 'NIT Warangal',
      branch: 'Electronics & Communication',
      year: '4th Year',
      cgpa: 9.2,
      jobRole: 'Data Analyst',
      status: 'in-progress',
      appliedDate: '2025-01-16',
      interviewDate: '2025-01-20',
      resumeLink: 'https://example.com/resume/priya_patel.pdf',
      profileLink: 'https://linkedin.com/in/priyapatel',
      aiScore: 78,
      technicalScore: 85,
      behavioralScore: 75,
      communicationScore: 74,
      overallGrade: 'B+',
      feedback: 'Strong academic background. Needs improvement in communication confidence.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
    },
    {
      id: 'PLC-2025-003',
      name: 'Rohit Kumar',
      email: 'rohit.kumar@college.edu',
      college: 'BITS Pilani',
      branch: 'Information Technology',
      year: '4th Year',
      cgpa: 8.5,
      jobRole: 'Full Stack Developer',
      status: 'hired',
      appliedDate: '2025-01-14',
      interviewDate: '2025-01-17',
      resumeLink: 'https://example.com/resume/rohit_kumar.pdf',
      profileLink: 'https://linkedin.com/in/rohitkumar',
      aiScore: 94,
      technicalScore: 96,
      behavioralScore: 91,
      communicationScore: 95,
      overallGrade: 'A+',
      feedback: 'Outstanding performance across all parameters. Highly recommended for hire.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit'
    },
    {
      id: 'PLC-2025-004',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@college.edu',
      college: 'IIIT Hyderabad',
      branch: 'Computer Science',
      year: '4th Year',
      cgpa: 9.1,
      jobRole: 'Product Manager',
      status: 'pending',
      appliedDate: '2025-01-19',
      interviewDate: '2025-01-22',
      resumeLink: 'https://example.com/resume/sneha_reddy.pdf',
      profileLink: 'https://linkedin.com/in/snehareddy',
      aiScore: null,
      technicalScore: null,
      behavioralScore: null,
      communicationScore: null,
      overallGrade: null,
      feedback: null,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha'
    },
    {
      id: 'PLC-2025-005',
      name: 'Vikash Singh',
      email: 'vikash.singh@college.edu',
      college: 'IIT Bombay',
      branch: 'Mechanical Engineering',
      year: '4th Year',
      cgpa: 8.1,
      jobRole: 'Software Engineer',
      status: 'rejected',
      appliedDate: '2025-01-13',
      interviewDate: '2025-01-16',
      resumeLink: 'https://example.com/resume/vikash_singh.pdf',
      profileLink: 'https://linkedin.com/in/vikashsingh',
      aiScore: 65,
      technicalScore: 58,
      behavioralScore: 72,
      communicationScore: 65,
      overallGrade: 'C',
      feedback: 'Below expected technical proficiency. Recommend additional training.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikash'
    },
    {
      id: 'PLC-2025-006',
      name: 'Ananya Das',
      email: 'ananya.das@college.edu',
      college: 'VIT Vellore',
      branch: 'Computer Science',
      year: '4th Year',
      cgpa: 8.7,
      jobRole: 'Data Scientist',
      status: 'shortlisted',
      appliedDate: '2025-01-17',
      interviewDate: '2025-01-19',
      resumeLink: 'https://example.com/resume/ananya_das.pdf',
      profileLink: 'https://linkedin.com/in/ananyadas',
      aiScore: 83,
      technicalScore: 88,
      behavioralScore: 79,
      communicationScore: 82,
      overallGrade: 'B+',
      feedback: 'Good technical knowledge with room for improvement in behavioral aspects.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya'
    }
  ];

  // Export function
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Job Role', 'College', 'Branch', 'Year', 'CGPA', 'Status', 'Applied Date', 'Interview Date', 'AI Score', 'Technical Score', 'Behavioral Score', 'Communication Score', 'Overall Grade', 'Resume Link', 'Profile Link'];
    
    const csvContent = [
      headers.join(','),
      ...filteredApplicants.map(applicant => [
        applicant.id,
        `"${applicant.name}"`,
        applicant.email,
        `"${applicant.jobRole}"`,
        `"${applicant.college}"`,
        `"${applicant.branch}"`,
        `"${applicant.year}"`,
        applicant.cgpa,
        applicant.status,
        applicant.appliedDate,
        applicant.interviewDate,
        applicant.aiScore || 'N/A',
        applicant.technicalScore || 'N/A',
        applicant.behavioralScore || 'N/A',
        applicant.communicationScore || 'N/A',
        applicant.overallGrade || 'N/A',
        applicant.resumeLink,
        applicant.profileLink
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applicants_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Action menu functions
  const handleAction = (action, applicant) => {
    setShowActionMenu(null);
    switch(action) {
      case 'edit':
        alert(`Edit functionality for ${applicant.name} would open here`);
        break;
      case 'delete':
        if(confirm(`Are you sure you want to delete ${applicant.name}?`)) {
          alert(`Delete functionality for ${applicant.name} would execute here`);
        }
        break;
      case 'email':
        window.open(`mailto:${applicant.email}?subject=Regarding your application ${applicant.id} for ${applicant.jobRole}`);
        break;
      case 'schedule':
        alert(`Schedule interview for ${applicant.name} would open here`);
        break;
      case 'resume':
        window.open(applicant.resumeLink, '_blank');
        break;
      case 'profile':
        window.open(applicant.profileLink, '_blank');
        break;
    }
  };

  const filteredApplicants = useMemo(() => {
    return mockApplicants.filter(applicant => {
      const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           applicant.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           applicant.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           applicant.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || applicant.status === statusFilter;
      const matchesCollege = collegeFilter === 'all' || applicant.college === collegeFilter;
      const matchesBranch = branchFilter === 'all' || applicant.branch === branchFilter;
      const matchesGrade = gradeFilter === 'all' || applicant.overallGrade === gradeFilter;
      const matchesJobRole = jobRoleFilter === 'all' || applicant.jobRole === jobRoleFilter;
      
      return matchesSearch && matchesStatus && matchesCollege && matchesBranch && matchesGrade && matchesJobRole;
    });
  }, [searchQuery, statusFilter, collegeFilter, branchFilter, gradeFilter, jobRoleFilter]);

  // Get unique values for filters
  const uniqueColleges = [...new Set(mockApplicants.map(a => a.college))];
  const uniqueBranches = [...new Set(mockApplicants.map(a => a.branch))];
  const uniqueGrades = [...new Set(mockApplicants.map(a => a.overallGrade).filter(Boolean))];
  const uniqueJobRoles = [...new Set(mockApplicants.map(a => a.jobRole))];

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'shortlisted': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'hired': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <Clock className="w-4 h-4" />,
      'in-progress': <AlertCircle className="w-4 h-4" />,
      'shortlisted': <CheckCircle className="w-4 h-4" />,
      'hired': <Award className="w-4 h-4" />,
      'rejected': <XCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-400 dark:text-gray-500';
    if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400 font-bold';
    if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400 font-semibold';
    return 'text-orange-600 dark:text-orange-400';
  };

  const stats = {
    total: mockApplicants.length,
    pending: mockApplicants.filter(a => a.status === 'pending').length,
    inProgress: mockApplicants.filter(a => a.status === 'in-progress').length,
    shortlisted: mockApplicants.filter(a => a.status === 'shortlisted').length,
    hired: mockApplicants.filter(a => a.status === 'hired').length,
    rejected: mockApplicants.filter(a => a.status === 'rejected').length
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="p-6 w-full h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Applications</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">In Progress</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600">{stats.shortlisted}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Shortlisted</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Hired</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Rejected</div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, college, job role, or ID..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* More Filters Panel */}
            {showMoreFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Role</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={jobRoleFilter}
                      onChange={(e) => setJobRoleFilter(e.target.value)}
                    >
                      <option value="all">All Job Roles</option>
                      {uniqueJobRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">College</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={collegeFilter}
                      onChange={(e) => setCollegeFilter(e.target.value)}
                    >
                      <option value="all">All Colleges</option>
                      {uniqueColleges.map(college => (
                        <option key={college} value={college}>{college}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={branchFilter}
                      onChange={(e) => setBranchFilter(e.target.value)}
                    >
                      <option value="all">All Branches</option>
                      {uniqueBranches.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={gradeFilter}
                      onChange={(e) => setGradeFilter(e.target.value)}
                    >
                      <option value="all">All Grades</option>
                      {uniqueGrades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Applicants Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto" style={{ minHeight: '600px' }}>
              <table className="w-full min-w-[1400px]">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-[280px]">Applicant</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-[160px]">Job Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-[200px]">College & Branch</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-[80px]">CGPA</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-[120px]">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-[120px]">AI Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-[80px]">Grade</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-[120px]">Applied Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-[120px]">Resume/Profile</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white min-w-[140px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={applicant.avatar}
                            alt={applicant.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{applicant.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{applicant.id}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{applicant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-medium">{applicant.jobRole}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 dark:text-white">{applicant.college}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{applicant.branch}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{applicant.year}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900 dark:text-white">{applicant.cgpa}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                          {getStatusIcon(applicant.status)}
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1).replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {applicant.aiScore ? (
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                                style={{ width: `${applicant.aiScore}%` }}
                              />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">{applicant.aiScore}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-bold ${getGradeColor(applicant.overallGrade)}`}>
                          {applicant.overallGrade || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4" />
                          {new Date(applicant.appliedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction('resume', applicant)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            title="View Resume"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction('profile', applicant)}
                            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedApplicant(applicant)}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button 
                              onClick={() => setShowActionMenu(showActionMenu === applicant.id ? null : applicant.id)}
                              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                              title="More Actions"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {showActionMenu === applicant.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleAction('edit', applicant)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit Applicant
                                  </button>
                                  <button
                                    onClick={() => handleAction('email', applicant)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                                  >
                                    <Mail className="w-4 h-4" />
                                    Send Email
                                  </button>
                                  <button
                                    onClick={() => handleAction('schedule', applicant)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                                  >
                                    <Calendar className="w-4 h-4" />
                                    Schedule Interview
                                  </button>
                                  <button
                                    onClick={() => handleAction('resume', applicant)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                                  >
                                    <FileText className="w-4 h-4" />
                                    View Resume
                                  </button>
                                  <button
                                    onClick={() => handleAction('profile', applicant)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    View Profile
                                  </button>
                                  <button
                                    onClick={() => handleAction('delete', applicant)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Applicant
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredApplicants.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
              <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applicants found</h3>
              <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Click outside to close action menu */}
        {showActionMenu && (
          <div 
            className="fixed inset-0 z-5" 
            onClick={() => setShowActionMenu(null)}
          />
        )}

        {/* Applicant Details Modal */}
        {selectedApplicant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Applicant Details</h2>
                  <button
                    onClick={() => setSelectedApplicant(null)}
                    className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 rounded-lg"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={selectedApplicant.avatar}
                        alt={selectedApplicant.name}
                        className="w-20 h-20 rounded-full"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedApplicant.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{selectedApplicant.id}</p>
                        <p className="text-gray-600 dark:text-gray-300">{selectedApplicant.email}</p>
                        <div className="flex items-center gap-2 mt-1 text-blue-600 dark:text-blue-400">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-medium">{selectedApplicant.jobRole}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">College</label>
                        <p className="text-gray-900 dark:text-white">{selectedApplicant.college}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Branch & Year</label>
                        <p className="text-gray-900 dark:text-white">{selectedApplicant.branch} - {selectedApplicant.year}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CGPA</label>
                        <p className="text-gray-900 dark:text-white font-semibold">{selectedApplicant.cgpa}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Applied Date</label>
                        <p className="text-gray-900 dark:text-white">{new Date(selectedApplicant.appliedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplicant.status)} mt-1`}>
                          {getStatusIcon(selectedApplicant.status)}
                          {selectedApplicant.status.charAt(0).toUpperCase() + selectedApplicant.status.slice(1).replace('-', ' ')}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents</label>
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleAction('resume', selectedApplicant)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            Resume
                          </button>
                          <button
                            onClick={() => handleAction('profile', selectedApplicant)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Assessment Results */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Assessment Results</h4>
                    {selectedApplicant.aiScore ? (
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall AI Score</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{selectedApplicant.aiScore}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                            <div
                              className="h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                              style={{ width: `${selectedApplicant.aiScore}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-300">Technical</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{selectedApplicant.technicalScore}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${selectedApplicant.technicalScore}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-300">Behavioral</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{selectedApplicant.behavioralScore}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="h-2 bg-green-500 rounded-full"
                                style={{ width: `${selectedApplicant.behavioralScore}%` }}
                              />
                            </div>
                          </div>

                          <div className="col-span-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600 dark:text-gray-300">Communication</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{selectedApplicant.communicationScore}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="h-2 bg-purple-500 rounded-full"
                                style={{ width: `${selectedApplicant.communicationScore}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Grade</label>
                          <p className={`text-2xl font-bold ${getGradeColor(selectedApplicant.overallGrade)}`}>
                            {selectedApplicant.overallGrade}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Feedback</label>
                          <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mt-1">
                            {selectedApplicant.feedback}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                        <p>Assessment not completed yet</p>
                      </div>
                    )}
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

export default ApplicantsTracker;