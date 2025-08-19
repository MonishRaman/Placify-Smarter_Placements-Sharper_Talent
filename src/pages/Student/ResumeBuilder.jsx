import { useState } from "react";
import { FileText, Sun, Moon, User, Mail, Phone, Briefcase, GraduationCap, Code, FileCheck } from "lucide-react";

const ResumeBuilder = () => {
  const [isDark, setIsDark] = useState(false);
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

  const handleSubmit = () => {
    console.log("Resume Data:", formData);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const themeClasses = {
    container: isDark 
      ? "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" 
      : "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
    card: isDark 
      ? "bg-slate-800 border border-slate-700 shadow-2xl shadow-slate-900/50" 
      : "bg-white border border-white/20 shadow-2xl shadow-blue-900/10",
    text: isDark ? "text-slate-100" : "text-slate-800",
    textSecondary: isDark ? "text-slate-300" : "text-slate-600",
    input: isDark 
      ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20" 
      : "bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20",
    button: isDark 
      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30" 
      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30",
    themeToggle: isDark 
      ? "bg-slate-700 hover:bg-slate-600 text-slate-300" 
      : "bg-white hover:bg-slate-50 text-slate-600 shadow-md"
  };

  return (
    <div className={`${themeClasses.container} transition-all duration-500 py-8 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleTheme}
            className={`${themeClasses.themeToggle} p-3 rounded-full border transition-all duration-300 hover:scale-105`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Main Card */}
        <div className={`${themeClasses.card} rounded-2xl p-8 backdrop-blur-sm transition-all duration-500`}>
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
              <FileText className="text-white text-2xl" />
            </div>
            <h1 className={`${themeClasses.text} text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
              Resume Builder
            </h1>
          </div>

          <div className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User className={`${themeClasses.textSecondary} w-5 h-5`} />
                <h2 className={`${themeClasses.text} text-xl font-semibold`}>Personal Information</h2>
              </div>
              
              {/* Full Name */}
              <div className="group">
                <label className={`${themeClasses.textSecondary} block text-sm font-semibold mb-2 group-hover:text-blue-500 transition-colors`}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`${themeClasses.input} w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300`}
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className={`${themeClasses.textSecondary} block text-sm font-semibold mb-2 group-hover:text-blue-500 transition-colors flex items-center gap-2`}>
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`${themeClasses.input} w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300`}
                  />
                </div>
                <div className="group">
                  <label className={`${themeClasses.textSecondary} block text-sm font-semibold mb-2 group-hover:text-blue-500 transition-colors flex items-center gap-2`}>
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`${themeClasses.input} w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300`}
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck className={`${themeClasses.textSecondary} w-5 h-5`} />
                <h2 className={`${themeClasses.text} text-xl font-semibold`}>Professional Summary</h2>
              </div>
              <div className="group">
                <label className={`${themeClasses.textSecondary} block text-sm font-semibold mb-2 group-hover:text-blue-500 transition-colors`}>
                  Tell us about yourself
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
                  className={`${themeClasses.input} w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300 resize-none`}
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Code className={`${themeClasses.textSecondary} w-5 h-5`} />
                <h2 className={`${themeClasses.text} text-xl font-semibold`}>Skills & Expertise</h2>
              </div>
              <div className="group">
                <label className={`${themeClasses.textSecondary} block text-sm font-semibold mb-2 group-hover:text-blue-500 transition-colors`}>
                  Technical & Soft Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="JavaScript, React, Node.js, Project Management, Leadership"
                  className={`${themeClasses.input} w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300`}
                />
                <p className={`${themeClasses.textSecondary} text-xs mt-1`}>Separate skills with commas</p>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className={`${themeClasses.textSecondary} w-5 h-5`} />
                <h2 className={`${themeClasses.text} text-xl font-semibold`}>Education</h2>
              </div>
              <div className="group">
                <label className={`${themeClasses.textSecondary} block text-sm font-semibold mb-2 group-hover:text-blue-500 transition-colors`}>
                  Academic Background
                </label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Bachelor of Science in Computer Science - University Name (2020-2024)&#10;Relevant coursework, GPA, achievements..."
                  className={`${themeClasses.input} w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300 resize-none`}
                />
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className={`${themeClasses.textSecondary} w-5 h-5`} />
                <h2 className={`${themeClasses.text} text-xl font-semibold`}>Work Experience</h2>
              </div>
              <div className="group">
                <label className={`${themeClasses.textSecondary} block text-sm font-semibold mb-2 group-hover:text-blue-500 transition-colors`}>
                  Professional Experience
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Software Engineer - Company Name (2022-Present)&#10;• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality products&#10;• Increased application performance by 30% through code optimization..."
                  className={`${themeClasses.input} w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300 resize-none`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className={`${themeClasses.button} px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-3 mx-auto`}
              >
                <FileCheck className="w-5 h-5" />
                Generate My Resume
              </button>
            </div>
            </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className={`${themeClasses.textSecondary} text-sm`}>
            Build your professional resume in minutes with our modern builder
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;