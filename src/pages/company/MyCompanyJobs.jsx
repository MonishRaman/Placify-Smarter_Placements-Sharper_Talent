import React, { useEffect, useState, useCallback, useRef } from "react";
import { Briefcase, Pencil, CalendarDays, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PAGE_SIZE = 6; // cards per page

const MyCompanyJobs = () => {
  const [jobs, setJobs] = useState([]); // current page jobs from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters (backend supported)
  const [filters, setFilters] = useState({
    status: "",
    title: "",
    description: "",
    fromDate: "",
    toDate: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const cancelSourceRef = useRef(null);

  // Build query params
  const buildParams = () => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", PAGE_SIZE);
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    return params.toString();
  };

  const fetchJobs = useCallback(async () => {
    if (!token) {
      setError("Login required.");
      setJobs([]);
      setLoading(false);
      return;
    }
    if (cancelSourceRef.current) {
      cancelSourceRef.current.cancel("Operation canceled due to new request.");
    }
    cancelSourceRef.current = axios.CancelToken.source();

    setLoading(true);
    setError("");

    try {
      const qs = buildParams();
      const res = await axios.get(`${API_BASE}/api/jobs/mine?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: cancelSourceRef.current.token,
      });
      const data = res.data;
      setJobs(data.jobs || []);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      if (axios.isCancel(e)) return;
      setError(e.response?.data?.message || e.message || "Failed to load jobs");
      setJobs([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [token, page, filters]);

  // Fetch on mount + when page/filters change
  useEffect(() => {
    fetchJobs();
    return () => {
      if (cancelSourceRef.current) cancelSourceRef.current.cancel();
    };
  }, [fetchJobs]);

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

  if (!token)
    return (
      <div className="p-8 text-gray-600 dark:text-gray-300">
        Login required.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Filters */}
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

          {/* Filter Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
            >
              Clear
            </button>
            <button
              onClick={() => fetchJobs()}
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
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow border border-gray-100 dark:border-slate-700">
            <Briefcase className="w-16 h-16 mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              No jobs found
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Try adjusting filters.
            </p>
          </div>
        ) : (
          <>
            {/* Job Cards */}
            <div className="grid gap-6 lg:grid-cols-2">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-6">
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

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleDateString()
                          : ""}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                      {job.description || "No description provided."}
                    </p>

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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
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
                  )
                )}
                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyCompanyJobs;
