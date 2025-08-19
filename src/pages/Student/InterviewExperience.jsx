import { Briefcase, Star } from "lucide-react";

const InterviewExperience = () => {
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

  return (
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
          Explore real stories from candidates and learn how they cracked technical & HR rounds at top companies.
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
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{exp.role}</h2>
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
        <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-pink-600 font-semibold rounded-full hover:bg-white/90 dark:text-pink-500 dark:hover:bg-white/20 transition duration-300 animate-bounce shadow-lg text-sm sm:text-base">
          Share Your Experience
        </button>
      </div>
    </div>
  );
};

export default InterviewExperience;
