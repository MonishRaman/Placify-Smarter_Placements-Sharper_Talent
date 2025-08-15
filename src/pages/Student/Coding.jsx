import React, { useState } from "react";
import challenges from "../../data/challenges";
import { useNavigate } from "react-router-dom";

// Challenge Card
const ChallengeCard = ({ c, onOpen }) => (
  <div
    className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 shadow-lg hover:shadow-2xl dark:hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:scale-[1.03] cursor-pointer group"
    onClick={() => onOpen(c)}
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {c.title}
      </h3>
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          c.difficulty === "Easy"
            ? "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300"
            : c.difficulty === "Medium"
            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300"
            : "bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300"
        }`}
      >
        {c.difficulty}
      </span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 leading-relaxed">
      {c.description}
    </p>
    <div className="text-xs text-gray-500 dark:text-gray-400">
      <span className="font-semibold">Tags:</span>{" "}
      {Array.isArray(c.tags) ? c.tags.join(", ") : "None"}
    </div>
  </div>
);

// Modal
const Modal = ({ open, onClose, challenge }) => {
  const navigate = useNavigate();
  if (!open || !challenge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 shadow-2xl border border-gray-300 dark:border-slate-700 z-10 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {challenge.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {challenge.difficulty} •{" "}
              {Array.isArray(challenge.tags) ? challenge.tags.join(", ") : "No tags"}
            </p>
          </div>
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                onClose();
                navigate(`/dashboard/coding/${challenge.id}`);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:shadow-[0_0_12px_rgba(59,130,246,0.7)] transition shadow-md"
            >
              Start
            </button>
            <button
              onClick={() => {
                onClose();
                navigate(`/dashboard/coding/${challenge.id}?view=solution`);
              }}
              className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition shadow-sm"
            >
              Solution
            </button>
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xl"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        <hr className="my-5 border-gray-300 dark:border-slate-700" />

        {/* Content */}
        <div className="space-y-8">
          {/* Description */}
          <div>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Description
            </p>
            <pre className="bg-gray-50 dark:bg-slate-800/80 rounded-xl p-5 overflow-auto text-sm whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-100 shadow-inner">
              {typeof challenge.description === "string"
                ? challenge.description
                    .split(/(```[\s\S]*?```)/g)
                    .map((part, idx) => {
                      if (/^```[\s\S]*```$/.test(part)) {
                        const code = part.replace(/^```|```$/g, "").trim();
                        return (
                          <code
                            key={idx}
                            className="block bg-gray-100 dark:bg-slate-900 rounded-lg p-4 my-4 font-mono text-[0.95em] text-gray-800 dark:text-green-300 whitespace-pre shadow-inner"
                          >
                            {code}
                          </code>
                        );
                      }
                      const withBold = part.replace(
                        /\*\*(.*?)\*\*/g,
                        (_, text) => `<strong>${text}</strong>`
                      );
                      return (
                        <span
                          key={idx}
                          dangerouslySetInnerHTML={{ __html: withBold }}
                        />
                      );
                    })
                : challenge.description}
            </pre>
          </div>

          {/* Starter Code */}
          <div>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Starter Code
            </p>
            <pre className="bg-gray-50 dark:bg-slate-900 rounded-xl p-5 overflow-auto text-sm font-mono text-gray-800 dark:text-green-300 shadow-inner">
              {challenge.starterCode || "// No starter code provided"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Coding Component
const Coding = () => {
  const [openChallenge, setOpenChallenge] = useState(null);
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Coding Practice
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400 mb-10 max-w-2xl">
        Practice common interview coding problems — start with any challenge to
        open details and the editor.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {challenges.map((c) => (
          <ChallengeCard key={c.id} c={c} onOpen={(ch) => setOpenChallenge(ch)} />
        ))}
      </div>
      <Modal
        open={!!openChallenge}
        onClose={() => setOpenChallenge(null)}
        challenge={openChallenge}
      />
    </div>
  );
};

export default Coding;
