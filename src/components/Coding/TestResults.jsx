import React from "react";
import { CheckCircle, XCircle, Trophy, Award } from "lucide-react";

const TestResults = ({ testResults }) => {
  if (!testResults) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 max-h-60 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {testResults.success ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-green-600 dark:text-green-400">
                All Tests Passed!
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-red-600 dark:text-red-400">
                {testResults.passed}/{testResults.total} Tests Passed
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Runtime: {testResults.runtime}</span>
          <span>Memory: {testResults.memory}</span>
        </div>
      </div>
      {/* Test Case Details */}
      <div className="space-y-2">
        {testResults.details.map((test, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              test.passed
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                Test Case {index + 1}
              </span>
              {test.passed ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="space-y-1 text-xs">
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Input:
                </span>
                <code className="ml-2 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                  {test.input}
                </code>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Expected:
                </span>
                <code className="ml-2 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                  {test.expected}
                </code>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Output:
                </span>
                <code
                  className={`ml-2 px-2 py-1 rounded ${
                    test.passed
                      ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
                      : "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
                  }`}
                >
                  {test.output}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>
      {testResults.success && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Congratulations!</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4" />
              <span>+50 XP</span>
            </div>
          </div>
          <p className="mt-2 text-sm opacity-90">
            You've successfully solved this problem! Try the next challenge.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestResults;
