import React, { useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PostJob = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    domain: "",
    location: "",
    status: "Open",
    salary: "",
    description: "",
    requirements: "",
    responsibilities: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value || "", // always keep controlled
    }));
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        domain: formData.domain,
        location: formData.location,
        status: formData.status,
        salary: formData.salary,
        description: formData.description,
        requirements: formData.requirements
          ? formData.requirements.split(",").map((r) => r.trim())
          : [],
        responsibilities: formData.responsibilities
          ? formData.responsibilities.split(",").map((r) => r.trim())
          : [],
      };

      const response = await axios.post(`${API_BASE}/api/jobs`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Job posted successfully!");
      console.log("Job created:", response.data);

      navigate("/dashboard/company");
    } catch (err) {
      console.error("Error posting job:", err);
      toast.error(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-950 dark:to-gray-900 py-10 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-3 mb-8">
          <FaBriefcase className="text-blue-600 dark:text-blue-400 text-3xl sm:text-4xl" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center">
            Post a Job
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              className="w-full border rounded-lg px-4 py-2 
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Domain & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Domain
              </label>
              <input
                type="text"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                placeholder="e.g. Web Development"
                className="w-full border rounded-lg px-4 py-2 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote / Bangalore"
                className="w-full border rounded-lg px-4 py-2 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Job Type & Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Job Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100"
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
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. ₹8-12 LPA"
                className="w-full border rounded-lg px-4 py-2 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onInput={autoResize}
              placeholder="Write a detailed job description..."
              className="w-full border rounded-lg px-4 py-2 resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Requirements (comma separated)
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              onInput={autoResize}
              placeholder="e.g. React, Node.js, 2+ years experience..."
              className="w-full border rounded-lg px-4 py-2 resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Responsibilities (comma separated)
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              onInput={autoResize}
              placeholder="e.g. Write clean code, Manage team..."
              className="w-full border rounded-lg px-4 py-2 resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Job Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 
                dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 
                text-white px-8 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
