import React, { useEffect, useState, useCallback } from "react";
import { Briefcase, Pencil, CalendarDays, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PAGE_SIZE = 6; // cards per page

// Dummy job data
// ...existing code...
// Dummy job data
const dummyJobs = [
  {
    _id: "1",
    title: "Frontend Developer",
    type: "Full-time",
    domain: "Web Development",
    location: "Remote",
    status: "Open",
    salary: "₹8–12 LPA",
    description:
      "Build and maintain responsive web applications using React, Tailwind CSS and modern tooling.",
    requirements: ["React", "JavaScript (ES6+)", "Tailwind CSS", "REST APIs", "Git"],
    responsibilities: ["Implement UI components", "Optimize performance", "Collaborate with backend team"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100",
    },
  },
  {
    _id: "2",
    title: "Backend Developer",
    type: "Full-time",
    domain: "Platform Engineering",
    location: "Bangalore",
    status: "Open",
    salary: "₹12–18 LPA",
    description:
      "Develop scalable REST APIs with Node.js, Express and MongoDB. Focus on performance & security.",
    requirements: ["Node.js", "Express", "MongoDB", "JWT", "Docker"],
    responsibilities: ["Design APIs", "Write clean code", "Implement authentication", "Database schema design"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100",
    },
  },
  {
    _id: "3",
    title: "UI/UX Designer",
    type: "Internship",
    domain: "Design",
    location: "Remote",
    status: "Open",
    salary: "₹15K stipend",
    description:
      "Design clean, accessible and modern user interfaces and collaborate with product + frontend teams.",
    requirements: ["Figma", "Wireframing", "Prototyping", "Basic HTML/CSS"],
    responsibilities: ["Create mockups", "Maintain design system", "Research user flows"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100",
    },
  },
  {
    _id: "4",
    title: "DevOps Engineer",
    type: "Full-time",
    domain: "Infrastructure",
    location: "Hyderabad",
    status: "Open",
    salary: "₹14–20 LPA",
    description:
      "Automate deployments, manage CI/CD pipelines and improve system reliability.",
    requirements: ["Linux", "CI/CD", "Docker", "Kubernetes", "Monitoring"],
    responsibilities: ["Manage pipelines", "Infra automation", "Setup monitoring", "Optimize costs"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100",
    },
  },
  {
    _id: "5",
    title: "Data Analyst",
    type: "Part-time",
    domain: "Analytics",
    location: "Remote",
    status: "Open",
    salary: "₹6–9 LPA (pro-rated)",
    description:
      "Analyze product metrics and generate actionable insights for business teams.",
    requirements: ["SQL", "Excel", "Data Visualization", "Statistics"],
    responsibilities: ["Dashboard creation", "Ad-hoc analysis", "Data cleaning"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100",
    },
  },
  {
    _id: "6",
    title: "Security Engineer",
    type: "Full-time",
    domain: "Cybersecurity",
    location: "Delhi",
    status: "Open",
    salary: "₹18–24 LPA",
    description:
      "Own application and infrastructure security posture. Review code and implement safeguards.",
    requirements: ["OWASP", "Threat Modeling", "Node.js basics", "Vulnerability scanning"],
    responsibilities: ["Code reviews", "Security audits", "Patch management"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100",
    },
  },
  {
    _id: "6",
    title: "Security Engineer",
    type: "Full-time",
    domain: "Cybersecurity",
    location: "Delhi",
    status: "Open",
    salary: "₹18–24 LPA",
    description:
      "Own application and infrastructure security posture. Review code and implement safeguards.",
    requirements: ["OWASP", "Threat Modeling", "Node.js basics", "Vulnerability scanning"],
    responsibilities: ["Code reviews", "Security audits", "Patch management"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100",
    },
  },
  {
    _id: "6",
    title: "Security Engineer",
    type: "Full-time",
    domain: "Cybersecurity",
    location: "Delhi",
    status: "Open",
    salary: "₹18–24 LPA",
    description:
      "Own application and infrastructure security posture. Review code and implement safeguards.",
    requirements: ["OWASP", "Threat Modeling", "Node.js basics", "Vulnerability scanning"],
    responsibilities: ["Code reviews", "Security audits", "Patch management"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100",
    },
  },
  {
    _id: "6",
    title: "Security Engineer",
    type: "Full-time",
    domain: "Cybersecurity",
    location: "Delhi",
    status: "Open",
    salary: "₹18–24 LPA",
    description:
      "Own application and infrastructure security posture. Review code and implement safeguards.",
    requirements: ["OWASP", "Threat Modeling", "Node.js basics", "Vulnerability scanning"],
    responsibilities: ["Code reviews", "Security audits", "Patch management"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100",
    },
  },
  {
    _id: "6",
    title: "Security Engineer",
    type: "Full-time",
    domain: "Cybersecurity",
    location: "Delhi",
    status: "Open",
    salary: "₹18–24 LPA",
    description:
      "Own application and infrastructure security posture. Review code and implement safeguards.",
    requirements: ["OWASP", "Threat Modeling", "Node.js basics", "Vulnerability scanning"],
    responsibilities: ["Code reviews", "Security audits", "Patch management"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100",
    },
  },
];

const MyCompanyJobs = () => {
  const [allJobs, setAllJobs] = useState([]); // all (filtered = only this company)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  // Filters per controller: status, title, description, fromDate, toDate
  const [filters, setFilters] = useState({
    status: "",
    title: "",
    description: "",
    fromDate: "",
    toDate: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const companyId = storedUser?._id || storedUser?.userId;

  // Fetch open jobs then keep only this company's; paginate client-side
  const fetchJobs = useCallback(async () => {
    if (!token) {
      setAllJobs(dummyJobs); // token na ho to dummy data
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/jobs?limit=500&page=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Failed to load jobs");
      }
      const data = await res.json();
      const mine = (data.jobs || []).filter((j) => {
        if (!j.company) return false;
        if (typeof j.company === "string") return j.company === companyId;
        return j.company._id === companyId;
      });
      setAllJobs(mine.length > 0 ? mine : dummyJobs); // fallback to dummy
      setPage(1);
    } catch (e) {
      setError(e.message);
      setAllJobs(dummyJobs); // error pe bhi dummy jobs
    } finally {
      setLoading(false);
    }
  }, [token, companyId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Filters apply (client-side, keeping existing data flow)
  const filteredJobs = allJobs.filter((job) => {
    // status
    if (filters.status && job.status !== filters.status) return false;

    // title (case-insensitive includes)
    if (filters.title && !job.title?.toLowerCase().includes(filters.title.toLowerCase()))
      return false;

    // description (case-insensitive includes)
    if (
      filters.description &&
      !job.description?.toLowerCase().includes(filters.description.toLowerCase())
    )
      return false;

    // date range on createdAt (if present)
    if (filters.fromDate || filters.toDate) {
      const created = job.createdAt ? new Date(job.createdAt) : null;
      if (created) {
        if (filters.fromDate && created < new Date(filters.fromDate)) return false;
        if (filters.toDate) {
          const end = new Date(filters.toDate);
          end.setHours(23, 59, 59, 999);
          if (created > end) return false;
        }
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE) || 1;
  const startIdx = (page - 1) * PAGE_SIZE;
  const currentJobs = filteredJobs.slice(startIdx, startIdx + PAGE_SIZE);

  const handleUpdate = (job) => {
    navigate(`/dashboard/company/jobs/${job._id}/edit`, { state: { job } });
  };

  const changePage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      title: "",
      description: "",
      fromDate: "",
      toDate: "",
    });
    setPage(1);
  };

  if (!token) return <div className="p-8 text-gray-600 dark:text-gray-300">Login required.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Briefcase className="text-purple-600 dark:text-purple-400" />
            My Jobs
          </h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Company ke jobs. Update pe click karke edit karein.
          </p>
        </header>

        {/* Filters (match controller fields) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
            <input
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="Search title"
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              name="description"
              value={filters.description}
              onChange={handleFilterChange}
              placeholder="Search description"
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
            >
              Clear
            </button>
            <button
              onClick={fetchJobs}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-14 w-14 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow border border-gray-100 dark:border-slate-700">
            <Briefcase className="w-16 h-16 mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">No jobs found</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Try adjusting filters.</p>
          </div>
        ) : (
          <>
            {/* Job Cards (theme aligned with Student Jobs.jsx) */}
            <div className="grid gap-6 lg:grid-cols-2">
              {currentJobs.map((job) => (
                <div
                  key={job._id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header: Title, Company, Salary */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                          {job.company?.name || "Company"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {job.salary || ""}
                        </p>
                      </div>
                    </div>

                    {/* Meta: Location, Date */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                      {job.description || "No description provided."}
                    </p>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                        {job.type}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        {job.domain}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.status === "Open"
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => handleUpdate(job)}
                      className="w-full flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors duration-300"
                    >
                      <Pencil className="w-4 h-4" />
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => changePage(num)}
                    className={`px-3 py-1.5 text-sm rounded border ${
                      num === page
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}

            <div className="text-center mt-8">
              <button
                onClick={fetchJobs}
                className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Refresh
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCompanyJobs;