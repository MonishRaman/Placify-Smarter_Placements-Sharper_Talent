import React, { useEffect, useState, useCallback } from "react";
import { FaBriefcase, FaTrashAlt, FaSave, FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyJob = {
  _id: "",
  title: "",
  type: "",
  domain: "",
  location: "",
  status: "Open",
  salary: "",
  description: "",
  requirements: [],
  responsibilities: [],
  company: { name: "Company Name", website: "", _id: "" }
};

const EditJob = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const passedJob = location.state?.job;

  const [job, setJob] = useState(emptyJob);
  const [originalJob, setOriginalJob] = useState(emptyJob); // for change detection
  const [requirementsInput, setRequirementsInput] = useState("");
  const [responsibilitiesInput, setResponsibilitiesInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!passedJob);
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("token");

  const normalizeJob = (data) => ({
    _id: data._id || id,
    title: data.title || "",
    type: data.type || "",
    domain: data.domain || "",
    location: data.location || "",
    status: data.status || "Open",
    salary: data.salary || "",
    description: data.description || "",
    requirements: Array.isArray(data.requirements) ? data.requirements : [],
    responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities : [],
    company: data.company || emptyJob.company
  });

  const fillJob = (data) => {
    const normalized = normalizeJob(data);
    setJob(normalized);
    setOriginalJob(normalized);
    setRequirementsInput(normalized.requirements.join(", "));
    setResponsibilitiesInput(normalized.responsibilities.join(", "));
  };

  // Prefill from navigation state
  useEffect(() => {
    if (passedJob) {
      fillJob(passedJob);
      setInitialLoading(false);
    }
  }, [passedJob, id]);

  // Fetch job if page opened directly
  const fetchJob = useCallback(async () => {
    if (passedJob) return;
    if (!token) {
      setErrorMsg("Not authenticated");
      setInitialLoading(false);
      return;
    }
    try {
      setInitialLoading(true);
      setErrorMsg("");
      const res = await axios.get(`${API_BASE}/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fillJob(res.data.job || res.data);
    } catch (e) {
      setErrorMsg(e.response?.data?.message || "Failed to load job.");
    } finally {
      setInitialLoading(false);
    }
  }, [id, passedJob, token]);

  useEffect(() => {
    if (!passedJob) fetchJob();
  }, [fetchJob, passedJob]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const parseList = (val) =>
    val
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

  const buildPayload = () => ({
    title: job.title,
    type: job.type,
    domain: job.domain,
    location: job.location,
    status: job.status,
    salary: job.salary,
    description: job.description,
    requirements: parseList(requirementsInput),
    responsibilities: parseList(responsibilitiesInput)
  });

  const buildOriginalComparable = () => ({
    title: originalJob.title,
    type: originalJob.type,
    domain: originalJob.domain,
    location: originalJob.location,
    status: originalJob.status,
    salary: originalJob.salary,
    description: originalJob.description,
    requirements: originalJob.requirements,
    responsibilities: originalJob.responsibilities
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg("Not authenticated.");
      return;
    }

    const payload = buildPayload();
    const originalComparable = buildOriginalComparable();

    const hasChanged = JSON.stringify(payload) !== JSON.stringify(originalComparable);
    if (!hasChanged) {
      toast.info("No changes detected", { autoClose: 2000 });
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      await axios.patch(`${API_BASE}/api/jobs/${job._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Job updated", { autoClose: 2000 });
      navigate("/dashboard/company/my-jobs");
    } catch (e2) {
      setErrorMsg(e2.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token) {
      setErrorMsg("Not authenticated.");
      return;
    }
    if (!window.confirm("Delete this job permanently?")) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      await axios.delete(`${API_BASE}/api/jobs/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.info("Job deleted", { autoClose: 2000 });
      navigate("/dashboard/company/my-jobs");
    } catch (e) {
      setErrorMsg(e.response?.data?.message || "Delete failed.");
      setDeleting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-950 dark:to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-gray-700 dark:text-gray-300 text-sm">Loading job...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-950 dark:to-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <FaBriefcase className="text-blue-600 dark:text-blue-400 text-3xl" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                Edit Job
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update job details. Company info read-only.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <FaArrowLeft className="text-xs" />
              Back
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow disabled:opacity-50 transition"
            >
              <FaTrashAlt className="text-xs" />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 text-sm px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company readonly */}
            <div className="grid gap-4 sm:grid-cols-2 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Company
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {job.company?.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Website
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 truncate">
                  {job.company?.website || "—"}
                </p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={job.title}
                onChange={handleChange}
                required
                placeholder="Software Engineer"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Domain & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Domain
                </label>
                <input
                  type="text"
                  name="domain"
                  value={job.domain}
                  onChange={handleChange}
                  required
                  placeholder="Web Development"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={job.location}
                  onChange={handleChange}
                  required
                  placeholder="Remote / City"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Type & Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Job Type
                </label>
                <select
                  name="type"
                  value={job.type}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100"
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Salary (optional)
                </label>
                <input
                  type="text"
                  name="salary"
                  value={job.salary}
                  onChange={handleChange}
                  placeholder="₹8–12 LPA"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Job Status
              </label>
              <select
                name="status"
                value={job.status}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Job Description
              </label>
              <textarea
                name="description"
                value={job.description}
                onChange={handleChange}
                onInput={autoResize}
                rows={4}
                placeholder="Write a detailed job description..."
                className="w-full border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Requirements (comma separated)
              </label>
              <textarea
                value={requirementsInput}
                onChange={(e) => setRequirementsInput(e.target.value)}
                onInput={autoResize}
                rows={2}
                placeholder="React, Node.js, Problem Solving..."
                className="w-full border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Responsibilities (comma separated)
              </label>
              <textarea
                value={responsibilitiesInput}
                onChange={(e) => setResponsibilitiesInput(e.target.value)}
                onInput={autoResize}
                rows={2}
                placeholder="Build features, Collaborate with team..."
                className="w-full border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saving || deleting}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <FaSave />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <FaTrashAlt />
                {deleting ? "Deleting..." : "Delete Job"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={saving || deleting}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                <FaArrowLeft />
                Cancel
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;