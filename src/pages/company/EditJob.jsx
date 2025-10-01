import React, { useEffect, useState, useCallback } from "react";
import { FaBriefcase, FaTrashAlt, FaSave, FaArrowLeft, FaMapMarkerAlt, FaBuilding, FaLink, FaDollarSign, FaList, FaTasks, FaRegListAlt, FaRegFileAlt, FaChevronDown } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import Swal from 'sweetalert2';

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

const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

const EditJob = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const passedJob = location.state?.job;

  const [job, setJob] = useState(emptyJob);
  const [originalJob, setOriginalJob] = useState(emptyJob);
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

  useEffect(() => {
    if (passedJob) {
      fillJob(passedJob);
      setInitialLoading(false);
    }
  }, [passedJob, id]);

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

    if (JSON.stringify(payload) === JSON.stringify(originalComparable)) {
      toast.info("No changes detected", toastConfig);
      return;
    }

    setSaving(true);
    setErrorMsg("");
    try {
      await axios.patch(`${API_BASE}/api/jobs/${job._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Job updated successfully!", toastConfig);
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

    const isDarkMode = document.documentElement.classList.contains('dark');

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, delete it!',
      background: isDarkMode ? '#1f2937' : '#fff',
      color: isDarkMode ? '#e5e7eb' : '#1f2937',
    });

    if (result.isConfirmed) {
      setDeleting(true);
      setErrorMsg("");
      try {
        await axios.delete(`${API_BASE}/api/jobs/${job._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.error("Job has been deleted.", toastConfig);
        navigate("/dashboard/company/my-jobs");
      } catch (e) {
        setErrorMsg(e.response?.data?.message || "Delete failed.");
        setDeleting(false);
      }
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

  const inputBaseClasses = "w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100 transition-all duration-200";
  const selectBaseClasses = "w-full border rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100 appearance-none transition-all duration-200";
  const textareaBaseClasses = "w-full border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100 overflow-hidden transition-all duration-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-950 dark:to-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <FaBriefcase className="text-blue-600 dark:text-blue-400 text-3xl" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                Edit Job
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update job details. Company info is read-only.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center self-start sm:self-center gap-2 px-4 py-2 rounded-lg font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FaArrowLeft className="text-xs" />
            Back
          </button>
        </div>

        {errorMsg && (
          <div className="mb-6 text-sm px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company readonly */}
            <div className="grid gap-4 sm:grid-cols-2 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FaBuilding className="text-gray-400"/>
                <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Company</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{job.company?.name || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaLink className="text-gray-400"/>
                <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Website</p>
                    <a href={job.company?.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 truncate hover:underline">{job.company?.website || "—"}</a>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Job Title</label>
              <div className="relative">
                <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input id="title" type="text" name="title" value={job.title} onChange={handleChange} required placeholder="e.g., Software Engineer" className={inputBaseClasses} />
              </div>
            </div>

            {/* Domain & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="domain" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Domain</label>
                <div className="relative">
                  <FaRegListAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input id="domain" type="text" name="domain" value={job.domain} onChange={handleChange} required placeholder="e.g., Web Development" className={inputBaseClasses} />
                </div>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Location</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input id="location" type="text" name="location" value={job.location} onChange={handleChange} required placeholder="e.g., Remote / New York" className={inputBaseClasses} />
                </div>
              </div>
            </div>

            {/* Type, Salary, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Job Type</label>
                <div className="relative">
                  <select id="type" name="type" value={job.type} onChange={handleChange} required className={selectBaseClasses}>
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                  <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label htmlFor="salary" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Salary (optional)</label>
                <div className="relative">
                  <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input id="salary" type="text" name="salary" value={job.salary} onChange={handleChange} placeholder="e.g., ₹8–12 LPA" className={inputBaseClasses} />
                </div>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Job Status</label>
                <div className="relative">
                  <select id="status" name="status" value={job.status} onChange={handleChange} className={selectBaseClasses}>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Description, Requirements, Responsibilities */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Job Description</label>
              <textarea id="description" name="description" value={job.description} onChange={handleChange} onInput={autoResize} rows={4} placeholder="Write a detailed job description..." className={textareaBaseClasses} />
            </div>
            <div>
              <label htmlFor="requirements" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Requirements (comma separated)</label>
              <textarea id="requirements" value={requirementsInput} onChange={(e) => setRequirementsInput(e.target.value)} onInput={autoResize} rows={2} placeholder="e.g., React, Node.js, Problem Solving..." className={textareaBaseClasses} />
            </div>
            <div>
              <label htmlFor="responsibilities" className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Responsibilities (comma separated)</label>
              <textarea id="responsibilities" value={responsibilitiesInput} onChange={(e) => setResponsibilitiesInput(e.target.value)} onInput={autoResize} rows={2} placeholder="e.g., Build features, Collaborate with team..." className={textareaBaseClasses} />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={saving || deleting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
              >
                <FaSave />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
              >
                <FaTrashAlt />
                {deleting ? "Deleting..." : "Delete Job"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={saving || deleting}
                className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;