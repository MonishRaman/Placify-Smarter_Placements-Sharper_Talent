import React from "react";
import { Play, Save, Upload, HelpCircle } from "lucide-react";

const CodingActions = ({ runCode, resetCode, isRunning, code }) => (
  <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={runCode}
          disabled={isRunning || !code.trim()}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Code
            </>
          )}
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          title="Submit Solution"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          title="Get Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default CodingActions;
