import React, { useState } from "react";
import { FaPlus, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

const ExperienceForm = ({ experience, onChange }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    };
    onChange([...experience, newExperience]);
    setExpandedItems(new Set([...expandedItems, newExperience.id]));
  };

  const removeExperience = (id) => {
    onChange(experience.filter((exp) => exp.id !== id));
    const newExpanded = new Set(expandedItems);
    newExpanded.delete(id);
    setExpandedItems(newExpanded);
  };

  const updateExperience = (id, field, value) => {
    onChange(
      experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Work Experience
        </h3>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
            text-white rounded-lg transition-colors"
        >
          <FaPlus className="text-sm" />
          Add Experience
        </button>
      </div>

      {experience.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>
            No work experience entries yet. Click "Add Experience" to get
            started.
          </p>
        </div>
      )}

      {experience.map((exp) => {
        const isExpanded = expandedItems.has(exp.id);
        return (
          <div
            key={exp.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => toggleExpand(exp.id)}
                  className="flex items-center gap-2 text-left w-full"
                >
                  <span className="font-medium text-gray-800 dark:text-white">
                    {exp.position || "New Experience Entry"}
                  </span>
                  {isExpanded ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                {exp.company && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    at {exp.company}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <FaTimes />
              </button>
            </div>

            {isExpanded && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, "company", e.target.value)
                      }
                      placeholder="e.g. Google Inc."
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 
                        bg-white dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Position *
                    </label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(exp.id, "position", e.target.value)
                      }
                      placeholder="e.g. Software Engineer"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 
                        bg-white dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) =>
                      updateExperience(exp.id, "location", e.target.value)
                    }
                    placeholder="e.g. San Francisco, CA"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 
                      bg-white dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "startDate", e.target.value)
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 
                        bg-white dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <div className="space-y-2">
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "endDate", e.target.value)
                        }
                        disabled={exp.current}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                          focus:outline-none focus:ring-2 focus:ring-blue-400 
                          bg-white dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => {
                            updateExperience(
                              exp.id,
                              "current",
                              e.target.checked
                            );
                            if (e.target.checked) {
                              updateExperience(exp.id, "endDate", "");
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-gray-600 dark:text-gray-300">
                          Currently working here
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Job Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(exp.id, "description", e.target.value)
                    }
                    placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality software&#10;• Improved application performance by 30% through optimization"
                    rows="4"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 
                      bg-white dark:bg-gray-800 dark:text-gray-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Tip: Use bullet points (•) to list your achievements and
                    responsibilities
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExperienceForm;
