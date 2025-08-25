import React, { useState } from "react";
import {
  FaPlus,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";

const ProjectsForm = ({ projects, onChange }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: "",
      description: "",
      technologies: [],
      liveUrl: "",
      githubUrl: "",
      features: "",
      startDate: "",
      endDate: "",
      current: false,
    };
    onChange([...projects, newProject]);
    setExpandedItems(new Set([...expandedItems, newProject.id]));
  };

  const removeProject = (id) => {
    onChange(projects.filter((project) => project.id !== id));
    const newExpanded = new Set(expandedItems);
    newExpanded.delete(id);
    setExpandedItems(newExpanded);
  };

  const updateProject = (id, field, value) => {
    onChange(
      projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
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

  const addTechnology = (projectId, tech) => {
    const project = projects.find((p) => p.id === projectId);
    if (project && tech.trim() && !project.technologies.includes(tech.trim())) {
      updateProject(projectId, "technologies", [
        ...project.technologies,
        tech.trim(),
      ]);
    }
  };

  const removeTechnology = (projectId, techToRemove) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(
        projectId,
        "technologies",
        project.technologies.filter((tech) => tech !== techToRemove)
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Projects
        </h3>
        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
            text-white rounded-lg transition-colors"
        >
          <FaPlus className="text-sm" />
          Add Project
        </button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>
            No projects added yet. Click "Add Project" to showcase your work.
          </p>
        </div>
      )}

      {projects.map((project) => {
        const isExpanded = expandedItems.has(project.id);
        return (
          <div
            key={project.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => toggleExpand(project.id)}
                  className="flex items-center gap-2 text-left w-full"
                >
                  <span className="font-medium text-gray-800 dark:text-white">
                    {project.title || "New Project"}
                  </span>
                  {isExpanded ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 
                        text-blue-800 dark:text-blue-200 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 
                        text-gray-600 dark:text-gray-400 rounded"
                      >
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeProject(project.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <FaTimes />
              </button>
            </div>

            {isExpanded && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) =>
                      updateProject(project.id, "title", e.target.value)
                    }
                    placeholder="e.g. E-commerce Website"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 
                      bg-white dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) =>
                      updateProject(project.id, "description", e.target.value)
                    }
                    placeholder="Brief description of what the project does and its purpose..."
                    rows="3"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 
                      bg-white dark:bg-gray-800 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Technologies Used
                  </label>
                  <div className="space-y-2">
                    <TechnologyInput
                      onAdd={(tech) => addTechnology(project.id, tech)}
                      placeholder="e.g. React, Node.js, MongoDB"
                    />
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 
                            dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => removeTechnology(project.id, tech)}
                              className="text-blue-600 dark:text-blue-400 hover:text-red-500"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Live URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={project.liveUrl}
                        onChange={(e) =>
                          updateProject(project.id, "liveUrl", e.target.value)
                        }
                        placeholder="https://myproject.com"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-10
                          focus:outline-none focus:ring-2 focus:ring-blue-400 
                          bg-white dark:bg-gray-800 dark:text-gray-100"
                      />
                      {project.liveUrl && (
                        <FaExternalLinkAlt
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 
                          text-gray-400"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      GitHub URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={project.githubUrl}
                        onChange={(e) =>
                          updateProject(project.id, "githubUrl", e.target.value)
                        }
                        placeholder="https://github.com/username/repo"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-10
                          focus:outline-none focus:ring-2 focus:ring-blue-400 
                          bg-white dark:bg-gray-800 dark:text-gray-100"
                      />
                      {project.githubUrl && (
                        <FaGithub
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 
                          text-gray-400"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={project.startDate}
                      onChange={(e) =>
                        updateProject(project.id, "startDate", e.target.value)
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
                        value={project.endDate}
                        onChange={(e) =>
                          updateProject(project.id, "endDate", e.target.value)
                        }
                        disabled={project.current}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                          focus:outline-none focus:ring-2 focus:ring-blue-400 
                          bg-white dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={project.current}
                          onChange={(e) => {
                            updateProject(
                              project.id,
                              "current",
                              e.target.checked
                            );
                            if (e.target.checked) {
                              updateProject(project.id, "endDate", "");
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-gray-600 dark:text-gray-300">
                          Currently working on this
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Key Features / Achievements
                  </label>
                  <textarea
                    value={project.features}
                    onChange={(e) =>
                      updateProject(project.id, "features", e.target.value)
                    }
                    placeholder="• Implemented user authentication with JWT&#10;• Built responsive UI with React and Tailwind CSS&#10;• Achieved 95% test coverage"
                    rows="3"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 
                      bg-white dark:bg-gray-800 dark:text-gray-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    List key features, achievements, or technical challenges you
                    solved
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

// Helper component for technology input
const TechnologyInput = ({ onAdd, placeholder }) => {
  const [input, setInput] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        onAdd(input.trim());
        setInput("");
      }
    }
  };

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
          bg-white dark:bg-gray-800 dark:text-gray-100"
      />
      <button
        type="button"
        onClick={handleAdd}
        disabled={!input.trim()}
        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
          text-white rounded-lg transition-colors"
      >
        <FaPlus className="text-sm" />
      </button>
    </div>
  );
};

export default ProjectsForm;
