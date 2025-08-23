import { useState } from "react";
import { FaBriefcase } from "react-icons/fa";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Auto expand textarea
  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job Post Data:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-950 dark:to-gray-900 py-10 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <FaBriefcase className="text-blue-600 dark:text-blue-400 text-3xl sm:text-4xl" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center">
            Post a Job
          </h1>
        </div>

        {/* Form */}
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

          {/* Company & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google"
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
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
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

          {/* Benefits */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Benefits
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              onInput={autoResize}
              placeholder="Perks and benefits of this job..."
              className="w-full border rounded-lg px-4 py-2 resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
            />
          </div>

          {/* Submit Button */}
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
