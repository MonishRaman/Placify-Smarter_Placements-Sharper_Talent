import apiClient from "../../api/apiClient";
import { Briefcase, CalendarDays, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";

const Jobs = () => {
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const jobsPerPage = 5;
  const today = new Date();

  const defaultStaticJobs = [
    { id: "static1", title: "Frontend Developer Intern", company: "Tech Studio", type: "Internship", domain: "Web Development", location: "Remote", status: "Open", date: "2025-08-10" },
    { id: "static2", title: "Machine Learning Trainee", company: "AIWorks", type: "Full-Time", domain: "AI/ML", location: "Bangalore", status: "Open", date: "2025-08-15" },
    { id: "static3", title: "UI/UX Intern", company: "DesignHive", type: "Internship", domain: "UI/UX", location: "Delhi", status: "Open", date: "2025-08-20" },
    { id: "static4", title: "Backend Developer", company: "CodeNest", type: "Full-Time", domain: "Web Development", location: "Mumbai", status: "Open", date: "2025-08-18" },
    { id: "static5", title: "Cybersecurity Analyst Intern", company: "SecureNet", type: "Internship", domain: "Cybersecurity", location: "Hyderabad", status: "Open", date: "2025-08-12" },
    { id: "static6", title: "Cloud DevOps Engineer", company: "CloudOps Tech", type: "Full-Time", domain: "DevOps", location: "Chennai", status: "Open", date: "2025-08-14" },
    { id: "static7", title: "NLP Research Intern", company: "DeepLang AI", type: "Internship", domain: "AI/ML", location: "Remote", status: "Open", date: "2025-08-21" },
    { id: "static8", title: "Mobile App Developer", company: "AppSpark", type: "Full-Time", domain: "Web Development", location: "Delhi", status: "Open", date: "2025-08-16" },
    { id: "static9", title: "Data Analyst Intern", company: "InsightData", type: "Internship", domain: "Data Science", location: "Bangalore", status: "Open", date: "2025-08-17" },
    { id: "static10", title: "React.js Developer", company: "FrontendHub", type: "Full-Time", domain: "Web Development", location: "Remote", status: "Open", date: "2025-08-22" },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiClient.get("/jobs");
        const apiJobs = response.data || [];
        const mergedJobs = [...defaultStaticJobs, ...apiJobs];
        setJobsData(mergedJobs);
      } catch (err) {
        setError("Failed to fetch jobs.");
        setJobsData(defaultStaticJobs);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const defaultDomains = ["Web Development", "Data Science", "AI/ML", "DevOps", "UI/UX", "Cybersecurity"];
  const defaultLocations = ["Remote", "Bangalore", "Hyderabad", "Delhi", "Mumbai", "Chennai"];

  const domains = Array.from(new Set([...defaultDomains, ...jobsData.map((job) => job.domain)]));
  const locations = Array.from(new Set([...defaultLocations, ...jobsData.map((job) => job.location)]));
  const statuses = ["Open", "Applied", "Selected", "Rejected"];

  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || job.type === selectedType;
    const matchesDomain = selectedDomain === "All" || job.domain === selectedDomain;
    const matchesLocation = selectedLocation === "All" || job.location === selectedLocation;
    const matchesStatus = selectedStatus === "All" || job.status === selectedStatus;

    const jobDate = new Date(job.date);
    const matchesDate =
      dateFilter === "All" ||
      (dateFilter === "Upcoming" && jobDate >= today) ||
      (dateFilter === "Past" && jobDate < today);

    return (
      matchesSearch &&
      matchesType &&
      matchesDomain &&
      matchesLocation &&
      matchesStatus &&
      matchesDate
    );
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const selectClass =
    "px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 " +
    "bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 " +
    "shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 " +
    "hover:border-blue-400 dark:hover:border-blue-500 " +
    "transition-colors duration-200";

  if (loading) {
    return (
      <div className="min-h-screen w-full p-6 bg-gray-50 dark:bg-slate-900">
        <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">Jobs</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Welcome back! Here's what's happening.</p>
        <div className="text-center mt-20 text-lg text-gray-700 dark:text-gray-300">
          Loading Jobs Page... Please wait.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-8 bg-gray-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Explore Opportunities</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Find internships and full-time roles across domains.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300 px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Search className="absolute left-3 top-3 text-gray-500 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search title or company..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                         bg-white border-gray-300 text-gray-900
                         dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select value={selectedType} onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }} className={selectClass}>
            <option value="All">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-Time">Full-Time</option>
          </select>

          <select value={selectedDomain} onChange={(e) => { setSelectedDomain(e.target.value); setCurrentPage(1); }} className={selectClass}>
            <option value="All">All Domains</option>
            {domains.map((domain, index) => (
              <option key={index} value={domain}>
                {domain}
              </option>
            ))}
          </select>

          <select value={selectedLocation} onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }} className={selectClass}>
            <option value="All">All Locations</option>
            {locations.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }} className={selectClass}>
            <option value="All">Status</option>
            {statuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
            <option value="All">All Drives</option>
            <option value="Upcoming">Upcoming Drives</option>
            <option value="Past">Past Drives</option>
          </select>
        </div>

        <ul className="space-y-5">
          {currentJobs.length === 0 && (
            <li className="text-center text-gray-500 dark:text-gray-400">No jobs found.</li>
          )}

          {currentJobs.map((job) => (
            <li key={job.id} className="group bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800
                         rounded-2xl p-5 shadow-lg hover:shadow-2xl dark:hover:shadow-lg
                         transition-all duration-300 border border-gray-200 dark:border-slate-700
                         hover:scale-[1.02] cursor-default">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    {job.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{job.company}</p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {job.type}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-200">
                  {job.domain}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300">
                  {job.status}
                </span>
                <span className="px-2.5 py-1 rounded-full flex items-center gap-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                  <CalendarDays className="w-3 h-3" />
                  {job.date}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg disabled:opacity-50
                         bg-gray-200 text-gray-900
                         dark:bg-slate-700 dark:text-gray-100">
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button key={index} onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded-lg transition
                  ${currentPage === index + 1
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-gray-200 text-gray-900 dark:bg-slate-700 dark:text-gray-100"}`}>
                {index + 1}
              </button>
            ))}

            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg disabled:opacity-50
                         bg-gray-200 text-gray-900
                         dark:bg-slate-700 dark:text-gray-100">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
