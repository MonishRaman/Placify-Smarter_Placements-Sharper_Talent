import { Briefcase, Star, X } from "lucide-react";
import { useState } from "react";

const InterviewExperience = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    experience: "",
    rating: 5,
    interviewType: "",
    difficulty: "",
    tips: "",
    name: "",
    email: "",
  });

  const experiences = [
    {
      id: 1,
      company: "Google",
      role: "Software Engineer Intern",
      content:
        "The process included an online assessment followed by two rounds focused on DSA and system design. Interviewers were supportive.",
      color: "bg-gradient-to-r from-yellow-400 to-pink-500",
    },
    {
      id: 2,
      company: "TCS",
      role: "Graduate Trainee",
      content:
        "Aptitude + technical round with Java and SQL. HR tested communication skills and teamwork scenarios.",
      color: "bg-gradient-to-r from-green-400 to-blue-500",
    },
    {
      id: 3,
      company: "Infosys",
      role: "System Engineer",
      content:
        "Online test included verbal and aptitude. Interview revolved around my final year project and basic coding.",
      color: "bg-gradient-to-r from-purple-400 to-indigo-500",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement backend submission
    console.log("Form Data:", formData);
    // Close modal after submission
    setIsModalOpen(false);
    // Reset form
    setFormData({
      company: "",
      role: "",
      experience: "",
      rating: 5,
      interviewType: "",
      difficulty: "",
      tips: "",
      name: "",
      email: "",
    });
    alert("Thank you for sharing your experience!");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 overflow-x-hidden">
        {/* Background Decorations */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/30" />
          <div className="absolute -bottom-32 -right-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-pink-400/20 blur-3xl dark:bg-pink-500/30" />
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px] text-gray-900 dark:text-gray-100" />
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white py-10 sm:py-12 text-center shadow-lg rounded-b-3xl px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            🚀 Interview Experiences
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Explore real stories from candidates and learn how they cracked
            technical & HR rounds at top companies.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="max-w-6xl mx-auto py-10 sm:py-12 px-4 sm:px-6 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className={`rounded-2xl p-5 sm:p-6 shadow-lg transform hover:scale-105 transition duration-300 backdrop-blur-sm bg-white/30 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/40 ${exp.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-semibold backdrop-blur-sm">
                  {exp.company}
                </span>
                <Star size={18} className="text-white sm:text-base" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                {exp.role}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-100 dark:text-gray-300">
                {exp.content}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center py-12 sm:py-16 bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-600 dark:to-purple-700 shadow-inner rounded-t-3xl px-4 sm:px-6">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">
            🎯 Want to help others succeed?
          </h3>
          <p className="mb-6 sm:mb-8 text-white/80 text-sm sm:text-lg md:text-xl">
            Share your interview story and inspire future candidates!
          </p>
          <button
            onClick={openModal}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-pink-600 font-semibold rounded-full hover:bg-white/90 dark:text-pink-500 dark:hover:bg-white/20 transition duration-300 animate-bounce shadow-lg text-sm sm:text-base"
          >
            Share Your Experience
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-out animate-slideUp custom-scrollbar">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  Share Your Interview Experience
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/50 dark:hover:bg-gray-600/50 rounded-full transition-all duration-200 hover:scale-110 group"
                >
                  <X
                    size={24}
                    className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors"
                  />
                </button>
              </div>

              {/* Modal Body */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800 dark:to-gray-800"
              >
                {/* Personal Information Section */}
                <div className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="text-blue-500">👤</span>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Information Section */}
                <div className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="text-green-500">🏢</span>
                    Company & Role Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                        placeholder="e.g., Google, Microsoft"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                        Role/Position *
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                  </div>
                </div>

                {/* Interview Details Section */}
                <div className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="text-purple-500">💼</span>
                    Interview Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                        Interview Type *
                      </label>
                      <select
                        name="interviewType"
                        value={formData.interviewType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                      >
                        <option value="">Select type</option>
                        <option value="Technical">Technical</option>
                        <option value="HR">HR</option>
                        <option value="Behavioral">Behavioral</option>
                        <option value="Group Discussion">
                          Group Discussion
                        </option>
                        <option value="Case Study">Case Study</option>
                        <option value="Mixed">Mixed</option>
                      </select>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                        Difficulty Level *
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                      >
                        <option value="">Select difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Very Hard">Very Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                      Overall Experience Rating (1-5) *
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5) - Excellent</option>
                      <option value={4}>⭐⭐⭐⭐ (4) - Good</option>
                      <option value={3}>⭐⭐⭐ (3) - Average</option>
                      <option value={2}>⭐⭐ (2) - Below Average</option>
                      <option value={1}>⭐ (1) - Poor</option>
                    </select>
                  </div>
                </div>

                {/* Experience Section */}
                <div className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <span className="text-orange-500">📝</span>
                    Your Experience
                  </h3>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                        Detailed Experience *
                      </label>
                      <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                        placeholder="Describe your interview process, questions asked, atmosphere, etc."
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                        Tips for Future Candidates
                      </label>
                      <textarea
                        name="tips"
                        value={formData.tips}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                        placeholder="Share any advice or tips that might help others..."
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105 transform"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95"
                  >
                    Share Experience ✨
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
          transition: background-color 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.8);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default InterviewExperience;
