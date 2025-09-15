import React, { useEffect, useState, useCallback } from "react";
import { Briefcase, Pencil } from "lucide-react";
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
    description: "Build and maintain responsive web applications using React, Tailwind CSS and modern tooling.",
    requirements: ["React", "JavaScript (ES6+)", "Tailwind CSS", "REST APIs", "Git"],
    responsibilities: ["Implement UI components", "Optimize performance", "Collaborate with backend team"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100"
    }
  },
  {
    _id: "2",
    title: "Backend Developer",
    type: "Full-time",
    domain: "Platform Engineering",
    location: "Bangalore",
    status: "Open",
    salary: "₹12–18 LPA",
    description: "Develop scalable REST APIs with Node.js, Express and MongoDB. Focus on performance & security.",
    requirements: ["Node.js", "Express", "MongoDB", "JWT", "Docker"],
    responsibilities: ["Design APIs", "Write clean code", "Implement authentication", "Database schema design"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100"
    }
  },
  {
    _id: "3",
    title: "UI/UX Designer",
    type: "Internship",
    domain: "Design",
    location: "Remote",
    status: "Open",
    salary: "₹15K stipend",
    description: "Design clean, accessible and modern user interfaces and collaborate with product + frontend teams.",
    requirements: ["Figma", "Wireframing", "Prototyping", "Basic HTML/CSS"],
    responsibilities: ["Create mockups", "Maintain design system", "Research user flows"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100"
    }
  },
  {
    _id: "4",
    title: "DevOps Engineer",
    type: "Full-time",
    domain: "Infrastructure",
    location: "Hyderabad",
    status: "Open",
    salary: "₹14–20 LPA",
    description: "Automate deployments, manage CI/CD pipelines and improve system reliability.",
    requirements: ["Linux", "CI/CD", "Docker", "Kubernetes", "Monitoring"],
    responsibilities: ["Manage pipelines", "Infra automation", "Setup monitoring", "Optimize costs"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100"
    }
  },
  {
    _id: "5",
    title: "Data Analyst",
    type: "Part-time",
    domain: "Analytics",
    location: "Remote",
    status: "Open",
    salary: "₹6–9 LPA (pro-rated)",
    description: "Analyze product metrics and generate actionable insights for business teams.",
    requirements: ["SQL", "Excel", "Data Visualization", "Statistics"],
    responsibilities: ["Dashboard creation", "Ad-hoc analysis", "Data cleaning"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100"
    }
  },
  {
    _id: "6",
    title: "Security Engineer",
    type: "Full-time",
    domain: "Cybersecurity",
    location: "Delhi",
    status: "Open",
    salary: "₹18–24 LPA",
    description: "Own application and infrastructure security posture. Review code and implement safeguards.",
    requirements: ["OWASP", "Threat Modeling", "Node.js basics", "Vulnerability scanning"],
    responsibilities: ["Code reviews", "Security audits", "Patch management"],
    company: {
      _id: "c1",
      name: "TechCorp",
      website: "https://techcorp.example.com",
      profileImage: "https://via.placeholder.com/100"
    }
  }
];





const MyCompanyJobs = () => {
  const [allJobs, setAllJobs] = useState([]);      // all (filtered = only this company)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();
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
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const d = await res.json().catch(()=>({}));
        throw new Error(d.message || "Failed to load jobs");
      }
      const data = await res.json();
      const mine = (data.jobs || []).filter(j => {
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

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const totalPages = Math.ceil(allJobs.length / PAGE_SIZE) || 1;
  const startIdx = (page - 1) * PAGE_SIZE;
  const currentJobs = allJobs.slice(startIdx, startIdx + PAGE_SIZE);

  const handleUpdate = (job) => {
    navigate(`/dashboard/company/jobs/${job._id}/edit`, { state: { job } });
  };

  const changePage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            Sirf aapki company ke open jobs (Update karne ke liye button).
          </p>
        </header>

        {error && (
            <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-14 w-14 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : allJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow">
            <Briefcase className="w-16 h-16 mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              No jobs posted
            </h3>
           
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {currentJobs.map(job => (
                <div
                  key={job._id}
                  className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-lg transition-all p-5 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                      {job.company?.profileImage ? (
                        <img
                          src={job.company.profileImage}
                          alt="logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">
                          Logo
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {job.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        {job.company?.name || "Company"}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-3 mb-4">
                    {job.description || "No description provided."}
                  </p>

                 <button
                    onClick={() => handleUpdate(job)}
                    className="mt-auto flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Update
                  </button>
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
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
