import React from "react";

const ProblemDescription = ({ problem }) => {
  if (!problem) return null;
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {problem.description}
        </p>
      </div>
      {/* Examples */}
      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Examples
        </h4>
        {problem.examples.map((example, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4"
          >
            <p className="font-medium mb-2 text-gray-900 dark:text-gray-100">
              Example {index + 1}:
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Input:
                </span>
                <code className="ml-2 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                  {example.input}
                </code>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  Output:
                </span>
                <code className="ml-2 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                  {example.output}
                </code>
              </div>
              {example.explanation && (
                <div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Explanation:
                  </span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {example.explanation}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Constraints */}
      <div>
        <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Constraints
        </h4>
        <ul className="space-y-2">
          {problem.constraints.map((constraint, index) => (
            <li
              key={index}
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              • {constraint}
            </li>
          ))}
        </ul>
      </div>
      {/* Hints */}
      <div>
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <span role="img" aria-label="lightbulb">
            💡
          </span>{" "}
          Hints
        </h4>
        <div className="space-y-2">
          {problem.hints.map((hint, index) => (
            <details
              key={index}
              className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3"
            >
              <summary className="cursor-pointer font-medium text-yellow-800 dark:text-yellow-400">
                Hint {index + 1}
              </summary>
              <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                {hint}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
