import React from "react";

const PersonalInfoForm = ({ formData, onChange, errors = {} }) => {
  const handleChange = (e) => {
    onChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Personal Information
      </h3>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          className={`w-full border rounded-lg px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-blue-400 
            bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100 
            transition ${errors.name ? "border-red-500" : ""}`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. john@example.com"
            className={`w-full border rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400 
              bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100
              ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Phone *
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 1234567890"
            className={`w-full border rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400 
              bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100
              ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
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
          placeholder="A brief summary about you..."
          rows="4"
          className="w-full border rounded-lg px-4 py-2 resize-y
            focus:outline-none focus:ring-2 focus:ring-blue-400 
            bg-white dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-100"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
