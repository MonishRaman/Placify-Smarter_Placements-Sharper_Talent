import React, { useState } from "react";
import { FaPlus, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

const EducationForm = ({ education, onChange }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    };
    onChange([...education, newEducation]);
    setExpandedItems(new Set([...expandedItems, newEducation.id]));
  };

  const removeEducation = (id) => {
    onChange(education.filter((edu) => edu.id !== id));
    const newExpanded = new Set(expandedItems);
    newExpanded.delete(id);
    setExpandedItems(newExpanded);
  };

  const updateEducation = (id, field, value) => {
    onChange(
      education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
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
          Education
        </h3>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
            text-white rounded-lg transition-colors"
        >
          <FaPlus className="text-sm" />
          Add Education
        </button>
      </div>

      {education.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No education entries yet. Click "Add Education" to get started.</p>
        </div>
      )}

      {education.map((edu) => {
        const isExpanded = expandedItems.has(edu.id);
        return (
          <div
            key={edu.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => toggleExpand(edu.id)}
                  className="flex items-center gap-2 text-left w-full"
                >
                  <span className="font-medium text-gray-800 dark:text-white">
                    {edu.institution || "New Education Entry"}
                  </span>
                  {isExpanded ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                {edu.degree && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
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
                      Institution *
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(edu.id, "institution", e.target.value)
                      }
                      placeholder="e.g. Harvard University"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 
                        bg-white dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Degree *
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, "degree", e.target.value)
                      }
                      placeholder="e.g. Bachelor of Science"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                        focus:outline-none focus:ring-2 focus:ring-blue-400 
                        bg-white dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(edu.id, "field", e.target.value)
                    }
                    placeholder="e.g. Computer Science"
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
                      value={edu.startDate}
                      onChange={(e) =>
                        updateEducation(edu.id, "startDate", e.target.value)
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
                        value={edu.endDate}
                        onChange={(e) =>
                          updateEducation(edu.id, "endDate", e.target.value)
                        }
                        disabled={edu.current}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                          focus:outline-none focus:ring-2 focus:ring-blue-400 
                          bg-white dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => {
                            updateEducation(
                              edu.id,
                              "current",
                              e.target.checked
                            );
                            if (e.target.checked) {
                              updateEducation(edu.id, "endDate", "");
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-gray-600 dark:text-gray-300">
                          Currently studying
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={edu.description}
                    onChange={(e) =>
                      updateEducation(edu.id, "description", e.target.value)
                    }
                    placeholder="Notable achievements, relevant coursework, GPA, etc."
                    rows="3"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 
                      bg-white dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EducationForm;
