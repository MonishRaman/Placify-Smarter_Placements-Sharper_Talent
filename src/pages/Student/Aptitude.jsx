const Aptitude = () => {
  const sampleQuestions = [
    {
      id: 1,
      question: "What is the next number in the series: 2, 4, 8, 16, ?",
      options: ["18", "32", "24", "20"],
      answer: "32",
    },
    {
      id: 2,
      question: "If a train travels 60 km in 1 hour, how far will it travel in 45 minutes?",
      options: ["45 km", "50 km", "55 km", "60 km"],
      answer: "45 km",
    },
    {
      id: 3,
      question: "Which of the following is a prime number?",
      options: ["21", "29", "35", "49"],
      answer: "29",
    },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col">
      {/* Header */}
      <header className="text-center py-12 bg-gradient-to-r from-green-500 to-teal-600 dark:from-green-700 dark:to-teal-800 rounded-b-3xl shadow-lg px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">📝 Aptitude Questions</h1>
        <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto">
          Sharpen your logical reasoning and problem-solving skills by practicing these questions.
        </p>
      </header>

      {/* Questions Section */}
      <main className="flex-1 max-w-5xl mx-auto py-12 px-4 sm:px-6 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sampleQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Q{q.id}. {q.question}
            </h2>
            <div className="grid grid-cols-1 gap-3 mt-auto">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  className="text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition duration-200 font-medium text-left w-full text-sm sm:text-base"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Footer / CTA */}
      <footer className="text-center py-12 bg-gradient-to-r from-teal-500 to-green-600 dark:from-teal-700 dark:to-green-800 rounded-t-3xl shadow-inner px-4 sm:px-6">
        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          🚀 Ready to improve?
        </h3>
        <p className="text-white/90 text-lg sm:text-xl mb-6">
          Attempt all questions and track your progress!
        </p>
        <button className="px-8 sm:px-10 py-3 bg-white text-green-600 font-semibold rounded-full hover:bg-white/90 dark:text-green-400 dark:hover:bg-white/20 transition duration-300 shadow-lg">
          Start Practicing
        </button>
      </footer>
    </div>
  );
};

export default Aptitude;
