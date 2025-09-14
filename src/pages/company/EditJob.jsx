import React, { useEffect, useState } from "react";
import { FaBriefcase, FaTrashAlt, FaSave, FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
  // Separate string inputs for comma separated editing
  const [requirementsInput, setRequirementsInput] = useState("");
  const [responsibilitiesInput, setResponsibilitiesInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load job from passed state (prefill sab kuch)
  useEffect(() => {
    if (passedJob) {
      const normalized = {
        _id: passedJob._id || id,
        title: passedJob.title || "",
        type: passedJob.type || "",
        domain: passedJob.domain || "",
        location: passedJob.location || "",
        status: passedJob.status || "Open",
        salary: passedJob.salary || "",
        description: passedJob.description || "",
        requirements: Array.isArray(passedJob.requirements) ? passedJob.requirements : [],
        responsibilities: Array.isArray(passedJob.responsibilities) ? passedJob.responsibilities : [],
        company: passedJob.company || emptyJob.company
      };
      setJob(normalized);
      setRequirementsInput(normalized.requirements.join(", "));
      setResponsibilitiesInput(normalized.responsibilities.join(", "));
    } else {
      // Future: fetch by id if direct open (not via state)
      setJob(j => ({ ...j, _id: id }));
    }
  }, [passedJob, id]);

  // Generic text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prev => ({ ...prev, [name]: value }));
  };

  // Parse comma separated -> arrays
  const syncArrays = () => {
    setJob(prev => ({
      ...prev,
      requirements: requirementsInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
      responsibilities: responsibilitiesInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
    }));
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    syncArrays();
    setSaving(true);
    const payload = {
      ...job,
      requirements: requirementsInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
      responsibilities: responsibilitiesInput
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
    };
    console.log("UPDATE JOB PAYLOAD:", payload);
    setTimeout(() => {
      setSaving(false);
      navigate(-1);
    }, 700);
  };

  const handleDelete = () => {
    if (!window.confirm("Is job ko delete karna sure ho?")) return;
    setDeleting(true);
    console.log("DELETE JOB ID:", job._id || id);
    setTimeout(() => {
      setDeleting(false);
      navigate(-1);
    }, 700);
  };

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
                Saare fields prefilled hain. Company info editable nahi hai.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company read-only */}
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
              placeholder="e.g. Software Engineer"
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
                  placeholder="e.g. Web Development"
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
                  placeholder="e.g. Remote / Bangalore"
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
                placeholder="e.g. ₹8–12 LPA"
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
              placeholder="Write a detailed job description..."
              className="w-full border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
              rows={4}
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
              onBlur={syncArrays}
              onInput={autoResize}
              placeholder="React, Node.js, Problem Solving..."
              className="w-full border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
              rows={2}
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
              onBlur={syncArrays}
              onInput={autoResize}
              placeholder="Build features, Collaborate with team..."
              className="w-full border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800/70 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <FaSave />
              {saving ? "Saving..." : "Save Changes (Mock)"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <FaTrashAlt />
              {deleting ? "Deleting..." : "Delete Job"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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