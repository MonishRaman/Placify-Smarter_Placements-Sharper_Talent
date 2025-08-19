import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import challenges from "../../data/challenges";
import Editor from "@monaco-editor/react";
import { Play, RefreshCw, Eye, EyeOff, ArrowLeft } from "lucide-react";

const CodingEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const challenge = challenges.find((c) => c.id === id);
  const showSolution = searchParams.get("view") === "solution";

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (challenge) {
      if (showSolution && challenge.solution) {
        setCode(challenge.solution);
      } else {
        setCode(challenge.starterCode || "");
      }
    }
  }, [challenge, showSolution]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");

    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const consoleLog = [];
      const mockConsole = {
        log: (...args) => consoleLog.push(args.join(" ")),
        error: (...args) => consoleLog.push("ERROR: " + args.join(" ")),
        warn: (...args) => consoleLog.push("WARNING: " + args.join(" ")),
      };

      const safeGlobals = {
        console: mockConsole,
        Math,
        Date,
        Array,
        Object,
        String,
        Number,
        Boolean,
        JSON,
      };

      const func = new Function(...Object.keys(safeGlobals), code);
      func(...Object.values(safeGlobals));

      setOutput(
        consoleLog.length > 0
          ? consoleLog.join("\n")
          : "✅ Code executed successfully (no output)"
      );
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    if (showSolution && challenge.solution) {
      setCode(challenge.solution);
    } else {
      setCode(challenge.starterCode || "");
    }
    // Keep output mounted but clear content
    setOutput("");
  };

  const toggleSolution = () => {
    if (showSolution) {
      navigate(`/dashboard/coding/${id}`);
    } else {
      navigate(`/dashboard/coding/${id}?view=solution`);
    }
  };

  if (!challenge) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 dark:text-red-400 mb-4 font-medium text-lg">
          Challenge not found.
        </p>
        <button
          onClick={() => navigate("/dashboard/coding")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md transition"
        >
          <ArrowLeft size={18} /> Go Back to Challenges
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard/coding")}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-3 text-sm"
        >
          <ArrowLeft size={16} /> Back to Challenges
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          {challenge.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              challenge.difficulty === "Easy"
                ? "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300"
                : challenge.difficulty === "Medium"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300"
                : "bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300"
            }`}
          >
            {challenge.difficulty}
          </span>
          {showSolution && (
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-800/40 dark:text-purple-300">
              Solution View
            </span>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
            {challenge.description}
          </pre>
        </div>
      </div>

      {/* Editor + Output Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Editor */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Code Editor
          </label>
          <div className="rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-lg h-[45vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh]">
            <Editor
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
              className="w-full h-full"
            />
          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap gap-3 sticky top-2 z-10">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-5 py-2.5 sm:py-2 rounded-lg font-medium shadow transition"
            >
              <Play size={18} /> {isRunning ? "Running..." : "Run Code"}
            </button>

            <button
              onClick={resetCode}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 sm:py-2 rounded-lg font-medium shadow transition"
            >
              <RefreshCw size={18} /> Reset
            </button>

            {challenge.solution && (
              <button
                onClick={toggleSolution}
                className={`flex items-center gap-2 px-5 py-2.5 sm:py-2 rounded-lg font-medium shadow transition ${
                  showSolution
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-800/40 dark:hover:bg-purple-700/60 dark:text-purple-300"
                }`}
              >
                {showSolution ? (
                  <>
                    <EyeOff size={18} /> Hide Solution
                  </>
                ) : (
                  <>
                    <Eye size={18} /> Show Solution
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right: Output (always mounted to avoid layout jumps) */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Output
          </label>
          <pre className="bg-gray-900 text-green-300 p-4 rounded-xl h-[45vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] border border-gray-700 overflow-auto shadow-inner text-sm leading-relaxed">
            {output && output.trim().length > 0
              ? output
              : "• No output yet.\nRun your code to see results here."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodingEditor;
