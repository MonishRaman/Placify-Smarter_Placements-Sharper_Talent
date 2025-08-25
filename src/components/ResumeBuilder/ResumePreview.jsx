import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";

const ResumePreview = ({ formData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const formatDateRange = (startDate, endDate, current) => {
    const start = formatDate(startDate);
    const end = current ? "Present" : formatDate(endDate);
    return start && end ? `${start} - ${end}` : start || end;
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {formData.name || "Your Name"}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-gray-600 dark:text-gray-400">
          {formData.email && (
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-sm" />
              <span>{formData.email}</span>
            </div>
          )}
          {formData.phone && (
            <div className="flex items-center gap-2">
              <FaPhone className="text-sm" />
              <span>{formData.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {formData.summary && (
        <div className="mb-8">
          <h2
            className="text-xl font-semibold text-gray-900 dark:text-white mb-3 
            border-l-4 border-blue-500 pl-4"
          >
            Professional Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {formData.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {formData.skills && formData.skills.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xl font-semibold text-gray-900 dark:text-white mb-3 
            border-l-4 border-blue-500 pl-4"
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 
                text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {formData.experience && formData.experience.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xl font-semibold text-gray-900 dark:text-white mb-4 
            border-l-4 border-blue-500 pl-4"
          >
            Work Experience
          </h2>
          <div className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div
                key={index}
                className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-600"
              >
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {exp.position}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-medium">{exp.company}</span>
                    {exp.location && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-xs" />
                          <span>{exp.location}</span>
                        </div>
                      </>
                    )}
                    {(exp.startDate || exp.endDate) && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <FaCalendar className="text-xs" />
                          <span>
                            {formatDateRange(
                              exp.startDate,
                              exp.endDate,
                              exp.current
                            )}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 dark:text-gray-300">
                    {exp.description.split("\n").map((line, lineIndex) => (
                      <p key={lineIndex} className="mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {formData.education && formData.education.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xl font-semibold text-gray-900 dark:text-white mb-4 
            border-l-4 border-blue-500 pl-4"
          >
            Education
          </h2>
          <div className="space-y-6">
            {formData.education.map((edu, index) => (
              <div
                key={index}
                className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-600"
              >
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-medium">{edu.institution}</span>
                    {(edu.startDate || edu.endDate) && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <FaCalendar className="text-xs" />
                          <span>
                            {formatDateRange(
                              edu.startDate,
                              edu.endDate,
                              edu.current
                            )}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-gray-700 dark:text-gray-300">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {formData.projects && formData.projects.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-xl font-semibold text-gray-900 dark:text-white mb-4 
            border-l-4 border-blue-500 pl-4"
          >
            Projects
          </h2>
          <div className="space-y-6">
            {formData.projects.map((project, index) => (
              <div
                key={index}
                className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-600"
              >
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="mb-2">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <FaExternalLinkAlt className="text-sm" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                        >
                          <FaGithub className="text-sm" />
                        </a>
                      )}
                    </div>
                  </div>

                  {(project.startDate || project.endDate) && (
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-2">
                      <FaCalendar className="text-xs" />
                      <span>
                        {formatDateRange(
                          project.startDate,
                          project.endDate,
                          project.current
                        )}
                      </span>
                    </div>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 
                          text-gray-700 dark:text-gray-300 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {project.description && (
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {project.description}
                  </p>
                )}

                {project.features && (
                  <div className="text-gray-700 dark:text-gray-300">
                    {project.features.split("\n").map((line, lineIndex) => (
                      <p key={lineIndex} className="mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!formData.name &&
        !formData.email &&
        !formData.phone &&
        !formData.summary &&
        (!formData.skills || formData.skills.length === 0) &&
        (!formData.experience || formData.experience.length === 0) &&
        (!formData.education || formData.education.length === 0) &&
        (!formData.projects || formData.projects.length === 0) && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">Your resume preview will appear here</p>
            <p>Start filling out the form to see your resume take shape!</p>
          </div>
        )}
    </div>
  );
};

export default ResumePreview;
