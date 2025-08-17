import { useState, useRef } from "react";
import { FaFileAlt } from "react-icons/fa";

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    education: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Auto expand textarea
  const autoResize = (e) => {
    e.target.style.height = "auto"; // reset height
    e.target.style.height = e.target.scrollHeight + "px"; // set new height
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Resume Data:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-950 dark:to-gray-900 py-10 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <FaFileAlt className="text-blue-600 dark:text-blue-400 text-3xl sm:text-4xl" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center">
            Resume Builder
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full border rounded-lg px-4 py-2 
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100 
                transition"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
                className="w-full border rounded-lg px-4 py-2 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 1234567890"
                className="w-full border rounded-lg px-4 py-2 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 
                  bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Professional Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              onInput={autoResize}
              placeholder="A brief summary about you..."
              className="w-full border rounded-lg px-4 py-2 resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. JavaScript, React, Node.js"
              className="w-full border rounded-lg px-4 py-2 
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Education
            </label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              onInput={autoResize}
              placeholder="Your academic background..."
              className="w-full border rounded-lg px-4 py-2 resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100 overflow-hidden"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Work Experience
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              onInput={autoResize}
              placeholder="Your work history..."
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
              Generate Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeBuilder;
