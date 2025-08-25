import { useState, useRef, useEffect } from "react";
import {
  FaFileAlt,
  FaEye,
  FaEdit,
  FaDownload,
  FaMoon,
  FaSun,
  FaSpinner,
  FaMagic,
  FaSave,
  FaCloud,
  FaList,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import PersonalInfoForm from "../../components/ResumeBuilder/PersonalInfoForm";
import EducationForm from "../../components/ResumeBuilder/EducationForm";
import ExperienceForm from "../../components/ResumeBuilder/ExperienceForm";
import SkillsForm from "../../components/ResumeBuilder/SkillsForm";
import ProjectsForm from "../../components/ResumeBuilder/ProjectsForm";
import ResumePreview from "../../components/ResumeBuilder/ResumePreview";
import { validateResumeData } from "../../utils/resumeValidation";
import { generateResumePDF } from "../../utils/pdfGenerator";
import { toast } from "react-toastify";
import {
  createResume,
  updateResume,
  getUserResumes,
  getResumeById,
  deleteResume,
  transformFormDataToAPI,
  transformAPIDataToForm,
} from "../../api/resumeApi";

const ResumeBuilder = () => {
  const { darkMode, setDarkMode } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("edit");
  const [errors, setErrors] = useState({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [showResumeList, setShowResumeList] = useState(false);
  const resumePreviewRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    skills: [], // Changed to array
    education: [], // Changed to array
    experience: [], // Changed to array
    projects: [], // Added projects
  });

  // Load saved resumes when component mounts (only if authenticated)
  useEffect(() => {
    if (isAuthenticated && user) {
      loadSavedResumes();
      // If no current resume, try to load from localStorage as fallback
      if (!currentResumeId) {
        loadFromLocalStorage();
      }
    } else {
      // If not authenticated, load from localStorage
      loadFromLocalStorage();
    }
  }, [isAuthenticated, user]);

  // Auto-save to localStorage for backup
  useEffect(() => {
    if (
      Object.keys(formData).some(
        (key) =>
          formData[key] &&
          (typeof formData[key] === "string"
            ? formData[key].trim()
            : formData[key].length > 0)
      )
    ) {
      localStorage.setItem("resumeBuilderData", JSON.stringify(formData));
    }
  }, [formData]);

  // Load data from localStorage
  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem("resumeBuilderData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Error loading saved resume data:", error);
      }
    }
  };

  // Load all saved resumes from backend
  const loadSavedResumes = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const result = await getUserResumes();
      if (result.success) {
        setSavedResumes(result.data || []);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error loading resumes:", error);
      toast.error("Failed to load saved resumes");
    } finally {
      setIsLoading(false);
    }
  };

  // Load a specific resume
  const loadResume = async (resumeId) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const result = await getResumeById(resumeId);
      if (result.success) {
        const transformedData = transformAPIDataToForm(result.data);
        setFormData(transformedData);
        setCurrentResumeId(resumeId);
        setActiveTab("edit");
        setShowResumeList(false);
        toast.success("Resume loaded successfully!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error loading resume:", error);
      toast.error("Failed to load resume");
    } finally {
      setIsLoading(false);
    }
  };

  // Save resume to backend
  const saveResumeToBackend = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save your resume");
      return;
    }

    const validation = validateResumeData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please fix the validation errors before saving");
      return;
    }

    setIsSaving(true);
    try {
      const apiData = transformFormDataToAPI(formData);
      let result;

      if (currentResumeId) {
        // Update existing resume
        result = await updateResume(currentResumeId, apiData);
      } else {
        // Create new resume
        result = await createResume(apiData);
      }

      if (result.success) {
        if (!currentResumeId) {
          setCurrentResumeId(result.data._id);
        }
        await loadSavedResumes(); // Refresh the list
        toast.success(result.message || "Resume saved successfully!");
        setErrors({});
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      toast.error("Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a resume
  const handleDeleteResume = async (resumeId) => {
    if (!isAuthenticated) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this resume? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const result = await deleteResume(resumeId);
      if (result.success) {
        toast.success("Resume deleted successfully!");
        await loadSavedResumes(); // Refresh the list

        // If the deleted resume was currently loaded, clear the form
        if (currentResumeId === resumeId) {
          setCurrentResumeId(null);
          setFormData({
            name: "",
            email: "",
            phone: "",
            summary: "",
            skills: [],
            education: [],
            experience: [],
            projects: [],
          });
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    }
  };

  // Create new resume (clear current data)
  const createNewResume = () => {
    setCurrentResumeId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      summary: "",
      skills: [],
      education: [],
      experience: [],
      projects: [],
    });
    setErrors({});
    setActiveTab("edit");
    setShowResumeList(false);
    localStorage.removeItem("resumeBuilderData");
    toast.success("Started new resume!");
  };

  const handlePersonalInfoChange = (changes) => {
    setFormData((prev) => ({
      ...prev,
      ...changes,
    }));

    // Clear related errors
    const newErrors = { ...errors };
    Object.keys(changes).forEach((key) => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const handleEducationChange = (education) => {
    setFormData((prev) => ({
      ...prev,
      education,
    }));
  };

  const handleExperienceChange = (experience) => {
    setFormData((prev) => ({
      ...prev,
      experience,
    }));
  };

  const handleSkillsChange = (skills) => {
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleProjectsChange = (projects) => {
    setFormData((prev) => ({
      ...prev,
      projects,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateResumeData(formData);

    if (validation.isValid) {
      setErrors({});
      // Switch to preview tab to show the completed resume
      setActiveTab("preview");
      console.log("Resume Data:", formData);

      // Auto-save to backend if authenticated
      if (isAuthenticated) {
        saveResumeToBackend();
      }
    } else {
      setErrors(validation.errors);
      // Stay on edit tab to show validation errors
      setActiveTab("edit");
    }
  };

  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      createNewResume();
    }
  };

  const fillSampleData = () => {
    const sampleData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      summary:
        "Passionate Full-Stack Developer with 3+ years of experience building scalable web applications using React, Node.js, and modern technologies. Strong problem-solving skills with a track record of delivering high-quality software solutions in agile environments.",
      skills: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "PostgreSQL",
        "Git",
        "Docker",
        "AWS",
        "HTML/CSS",
        "Tailwind CSS",
        "REST APIs",
        "GraphQL",
        "Jest",
      ],
      education: [
        {
          id: Date.now(),
          institution: "University of Technology",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2018-08",
          endDate: "2022-05",
          current: false,
          description:
            "Graduated Magna Cum Laude with a GPA of 3.8/4.0. Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems, Web Development.",
        },
      ],
      experience: [
        {
          id: Date.now() + 1,
          company: "TechCorp Solutions",
          position: "Full-Stack Developer",
          location: "San Francisco, CA",
          startDate: "2022-06",
          endDate: "",
          current: true,
          description:
            "• Developed and maintained 5+ React-based web applications serving 10K+ daily users\n• Built RESTful APIs using Node.js and Express.js, improving response times by 40%\n• Collaborated with cross-functional teams using Agile methodologies\n• Implemented automated testing strategies, achieving 95% code coverage",
        },
        {
          id: Date.now() + 2,
          company: "StartupXYZ",
          position: "Junior Frontend Developer",
          location: "Remote",
          startDate: "2021-06",
          endDate: "2022-05",
          current: false,
          description:
            "• Designed and implemented responsive user interfaces using React and CSS\n• Worked closely with UX/UI designers to translate mockups into functional components\n• Optimized application performance, reducing load times by 25%\n• Participated in code reviews and maintained coding standards",
        },
      ],
      projects: [
        {
          id: Date.now() + 3,
          title: "E-Commerce Platform",
          description:
            "A full-featured e-commerce web application with user authentication, product catalog, shopping cart, and payment integration.",
          technologies: ["React", "Node.js", "MongoDB", "Stripe API", "JWT"],
          liveUrl: "https://ecommerce-demo.example.com",
          githubUrl: "https://github.com/johndoe/ecommerce-platform",
          startDate: "2023-01",
          endDate: "2023-04",
          current: false,
          features:
            "• Implemented secure user authentication and authorization\n• Integrated Stripe payment gateway for seamless transactions\n• Built responsive design supporting mobile and desktop devices\n• Added real-time inventory management system",
        },
        {
          id: Date.now() + 4,
          title: "Task Management App",
          description:
            "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
          technologies: ["React", "Socket.io", "Express.js", "PostgreSQL"],
          liveUrl: "",
          githubUrl: "https://github.com/johndoe/task-manager",
          startDate: "2023-08",
          endDate: "",
          current: true,
          features:
            "• Real-time collaboration using WebSocket connections\n• Drag-and-drop interface for intuitive task management\n• Role-based access control for team management\n• Data visualization with charts and progress tracking",
        },
      ],
    };

    setFormData(sampleData);
    setErrors({});
    toast.success("Sample data filled successfully!");
  };

  const handleDownloadPDF = async () => {
    // Check if resume has required data
    if (!formData.name || !formData.email) {
      toast.error(
        "Please fill in at least your name and email before downloading"
      );
      return;
    }

    // Switch to preview mode if not already
    if (activeTab !== "preview") {
      setActiveTab("preview");
      // Wait a bit for the preview to render
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsGeneratingPDF(true);

    try {
      const resumeElement = resumePreviewRef.current;
      if (!resumeElement) {
        throw new Error("Resume preview not found");
      }

      // Generate filename based on user's name
      const fileName = formData.name
        ? `${formData.name.replace(/\s+/g, "_")}_Resume`
        : "Resume";

      const result = await generateResumePDF(resumeElement, fileName);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download resume. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-950 dark:to-gray-900 py-10 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-blue-600 dark:text-blue-400 text-3xl sm:text-4xl" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                Resume Builder
              </h1>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FaMoon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "edit"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <FaEdit />
              Edit Resume
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "preview"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <FaEye />
              Preview
            </button>
          </div>

          {/* Current Resume Info */}
          {isAuthenticated && currentResumeId && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400">
                <FaCloud />
                <span className="font-medium">
                  Currently editing: {formData.name || "Untitled Resume"}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 
                text-white px-6 py-2 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
            >
              Generate Resume
            </button>

            {/* Backend Integration Buttons - Only show if authenticated */}
            {isAuthenticated && (
              <>
                <button
                  onClick={saveResumeToBackend}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
                    isSaving
                      ? "bg-gray-400 text-white cursor-not-allowed opacity-50"
                      : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                  title="Save resume to your account"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Resume
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowResumeList(!showResumeList)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition shadow-lg hover:shadow-xl flex items-center gap-2"
                  title="View your saved resumes"
                >
                  <FaList />
                  My Resumes ({savedResumes.length})
                </button>

                <button
                  onClick={createNewResume}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                  title="Start a new resume"
                >
                  New Resume
                </button>
              </>
            )}

            <button
              onClick={fillSampleData}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 
                text-white px-6 py-2 rounded-lg font-semibold transition shadow-lg hover:shadow-xl flex items-center gap-2"
              title="Fill form with sample data for testing"
            >
              <FaMagic />
              Fill Sample Data
            </button>

            <button
              onClick={clearAllData}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Clear All
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF || (!formData.name && !formData.email)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition ${
                isGeneratingPDF || (!formData.name && !formData.email)
                  ? "bg-gray-400 text-white cursor-not-allowed opacity-50"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
              }`}
              title={
                !formData.name && !formData.email
                  ? "Fill in your name and email first"
                  : "Download resume as PDF"
              }
            >
              {isGeneratingPDF ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FaDownload />
                  Download PDF
                </>
              )}
            </button>
          </div>

          {/* Saved Resumes List */}
          {isAuthenticated && showResumeList && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Saved Resumes
                </h3>
                <button
                  onClick={() => setShowResumeList(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FaSpinner className="animate-spin text-blue-600 dark:text-blue-400 text-2xl" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    Loading resumes...
                  </span>
                </div>
              ) : savedResumes.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                  No saved resumes yet. Create your first resume!
                </p>
              ) : (
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {savedResumes.map((resume) => (
                    <div
                      key={resume._id}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                        currentResumeId === resume._id
                          ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="flex-1"
                          onClick={() => loadResume(resume._id)}
                        >
                          <h4 className="font-medium text-gray-800 dark:text-white">
                            {resume.fullName || "Untitled Resume"}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {resume.email} • Updated{" "}
                            {new Date(resume.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResume(resume._id);
                          }}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
                          title="Delete resume"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Authentication Notice */}
          {!isAuthenticated && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                <span className="font-medium">💡 Tip:</span>
                <span>
                  Login to save your resumes to the cloud and access them from
                  anywhere!
                </span>
              </div>
            </div>
          )}

          {/* Validation Errors Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <h3 className="text-red-800 dark:text-red-400 font-medium mb-2">
                Please fix the following errors:
              </h3>
              <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Content */}
        {activeTab === "edit" ? (
          <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-8">
              <PersonalInfoForm
                formData={formData}
                onChange={handlePersonalInfoChange}
                errors={errors}
              />

              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <SkillsForm
                  skills={formData.skills}
                  onChange={handleSkillsChange}
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <EducationForm
                  education={formData.education}
                  onChange={handleEducationChange}
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <ExperienceForm
                  experience={formData.experience}
                  onChange={handleExperienceChange}
                />
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <ProjectsForm
                  projects={formData.projects}
                  onChange={handleProjectsChange}
                />
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div ref={resumePreviewRef}>
              <ResumePreview formData={formData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
