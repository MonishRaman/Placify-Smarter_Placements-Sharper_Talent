import React from "react";
import { CheckCircle, Clock, Flame, Trophy } from "lucide-react";

const SidebarProblemList = ({
  problems,
  filteredProblems,
  selectedProblem,
  setSelectedProblem,
  userProgress,
  searchTerm,
  setSearchTerm,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedCategory,
  setSelectedCategory,
  categories,
  difficulties,
}) => {
  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span role="img" aria-label="code">
              💻
            </span>
          </div>
          <div>
            <h1 className="text-xl dark:text-white font-bold">Code Practice</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sharpen your skills
            </p>
          </div>
        </div>
        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 text-white">
            <div className="flex items-center justify-between">
              <Trophy className="w-5 h-5" />
              <span className="text-xs font-medium">
                {userProgress.ranking}
              </span>
            </div>
            <p className="text-lg font-bold">{userProgress.totalSolved}</p>
            <p className="text-xs opacity-90">Problems Solved</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-3 text-white">
            <div className="flex items-center justify-between">
              <Flame className="w-5 h-5" />
              <span className="text-xs font-medium">Streak</span>
            </div>
            <p className="text-lg font-bold">{userProgress.streak}</p>
            <p className="text-xs opacity-90">Day Streak</p>
          </div>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="relative mb-3">
          <span className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors text-sm"
          >
            {difficulties.map((diff) => (
              <option
                key={diff}
                value={diff}
                className="bg-white dark:bg-gray-800"
              >
                {diff}
              </option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors text-sm"
          >
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
                className="bg-white dark:bg-gray-800"
              >
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Problem List */}
      <div className="flex-1 overflow-y-auto">
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            onClick={() => setSelectedProblem(problem)}
            className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedProblem?.id === problem.id
                ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500"
                : ""
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-sm line-clamp-2 dark:text-white">
                {problem.title}
              </h3>
              {problem.solved ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" />
              ) : (
                <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full flex-shrink-0 ml-2" />
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                {problem.difficulty}
              </span>
              <span>{problem.category}</span>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{problem.acceptance}% acceptance</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {problem.timeSpent}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarProblemList;
