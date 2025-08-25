import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const SkillsForm = ({ skills, onChange }) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      onChange([...skills, trimmedSkill]);
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(newSkill);
      setNewSkill("");
    }
  };

  const handleAddClick = () => {
    addSkill(newSkill);
    setNewSkill("");
  };

  // Predefined skill suggestions
  const skillSuggestions = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "TypeScript",
    "Java",
    "C++",
    "HTML/CSS",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Git",
    "Docker",
    "AWS",
    "Azure",
    "Linux",
    "Machine Learning",
    "Data Analysis",
    "Project Management",
    "Agile",
    "Scrum",
    "Communication",
    "Leadership",
    "Problem Solving",
    "Team Collaboration",
  ];

  const availableSuggestions = skillSuggestions.filter(
    (suggestion) =>
      !skills.includes(suggestion) &&
      suggestion.toLowerCase().includes(newSkill.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        Skills
      </h3>

      {/* Add new skill */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a skill and press Enter"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400 
              bg-white dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            type="button"
            onClick={handleAddClick}
            disabled={!newSkill.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
              disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <FaPlus className="text-sm" />
            Add
          </button>
        </div>

        {/* Skill suggestions */}
        {newSkill && availableSuggestions.length > 0 && (
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.slice(0, 8).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    addSkill(suggestion);
                    setNewSkill("");
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 
                    dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current skills */}
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">
          Current Skills ({skills.length})
        </p>
        {skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No skills added yet. Start typing to add your skills.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/50 
                  text-blue-800 dark:text-blue-200 rounded-lg border border-blue-200 dark:border-blue-700"
              >
                <span className="text-sm font-medium">{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-blue-600 dark:text-blue-400 hover:text-red-500 dark:hover:text-red-400 
                    transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skill categories (optional enhancement) */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Quick Add by Category:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {[
            {
              category: "Frontend",
              skills: ["React", "Vue.js", "Angular", "HTML/CSS"],
            },
            {
              category: "Backend",
              skills: ["Node.js", "Express", "Django", "Spring Boot"],
            },
            {
              category: "Database",
              skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
            },
            {
              category: "DevOps",
              skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
            },
          ].map(({ category, skills: categorySkills }) => (
            <div key={category} className="space-y-1">
              <p className="font-medium text-gray-700 dark:text-gray-300">
                {category}
              </p>
              {categorySkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  disabled={skills.includes(skill)}
                  className="block w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 
                    dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 
                    rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
