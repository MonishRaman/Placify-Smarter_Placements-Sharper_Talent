import React, { useState } from "react";

const sampleContributions = [
  {
    id: 1,
    project: "Placify Web Portal",
    role: "Frontend Developer",
    details: "23 commits, 5 tasks completed",
    status: "Completed",
  },
  {
    id: 2,
    project: "Resume Analyzer",
    role: "ML Engineer",
    details: "Built keyword extraction module",
    status: "In Progress",
  },
  {
    id: 3,
    project: "Interview Scheduler",
    role: "Backend Developer",
    details: "API integration, 12 PRs merged",
    status: "Completed",
  },
  {
    id: 4,
    project: "Placify Web Portal",
    role: "UI Designer",
    details: "Designed dashboard UI",
    status: "In Progress",
  },
];

const unique = (arr) => [...new Set(arr)];

const ProjectContributions = () => {
  const [contributions, setContributions] = useState(sampleContributions);
  const [filters, setFilters] = useState({ project: "", role: "", status: "" });
  const [sortBy, setSortBy] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    project: "",
    role: "",
    details: "",
    status: "In Progress",
  });

  // Filtered and sorted data
  let filtered = contributions.filter(
    (c) =>
      (!filters.project || c.project === filters.project) &&
      (!filters.role || c.role === filters.role) &&
      (!filters.status || c.status === filters.status)
  );
  if (sortBy) {
    filtered = [...filtered].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });
  }

  // Handle form submit (demo only)
  const handleAdd = (e) => {
    e.preventDefault();
    setContributions([
      ...contributions,
      { ...form, id: contributions.length + 1 },
    ]);
    setForm({ project: "", role: "", details: "", status: "In Progress" });
    setShowForm(false);
  };

  // Dashboard style container
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <svg
          width="28"
          height="28"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-blue-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6l4 2"
          />
        </svg>
        Project Contributions
      </h2>

      {/* Filters & Sort */}
      <div className="flex flex-wrap gap-4 mb-6 bg-gradient-to-r from-blue-50 via-white to-blue-100 p-4 rounded-lg shadow-sm border border-blue-100">
        <select
          className="select select-bordered focus:border-blue-400 focus:ring-blue-200"
          value={filters.project}
          onChange={(e) => setFilters({ ...filters, project: e.target.value })}
        >
          <option value="">All Projects</option>
          {unique(contributions.map((c) => c.project)).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered focus:border-blue-400 focus:ring-blue-200"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          {unique(contributions.map((c) => c.role)).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered focus:border-blue-400 focus:ring-blue-200"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          {unique(contributions.map((c) => c.status)).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered focus:border-blue-400 focus:ring-blue-200"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="project">Project</option>
          <option value="role">Role</option>
          <option value="status">Status</option>
        </select>
        <button
          className={`ml-auto px-5 py-2 rounded-lg font-semibold shadow transition-colors duration-150 ${
            showForm
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={() => setShowForm((v) => !v)}
          type="button"
        >
          {showForm ? "Cancel" : "Add Contribution"}
        </button>
      </div>

      {/* Add Contribution Form (Demo) */}
        {showForm && (
          <div className="bg-white border border-blue-100 p-4 rounded-lg shadow mb-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleAdd}
            aria-label="Add contribution form"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-blue-700">
            Project Name <span className="text-xs text-red-500">*</span>
              </label>
              <input
            className="input input-bordered w-full focus:border-blue-400 focus:ring-blue-200"
            placeholder="e.g. Placify Web Portal"
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value })}
            required
            aria-required="true"
              />
            </div>

            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm font-medium text-blue-700">
              Role <span className="text-xs text-red-500">*</span>
            </label>
            <input
              className="input input-bordered w-full focus:border-blue-400 focus:ring-blue-200"
              placeholder="e.g. Frontend Developer"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            />
              </div>

              <div className="w-40 flex flex-col gap-2">
            <label className="text-sm font-medium text-blue-700">Status</label>
            <select
              className="select select-bordered w-full focus:border-blue-400 focus:ring-blue-200"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-blue-700">
            Contribution Details <span className="text-xs text-red-500">*</span>
              </label>
              <textarea
            className="textarea textarea-bordered w-full focus:border-blue-400 focus:ring-blue-200"
            placeholder="Describe the contribution (commits, tasks, PRs, notes...)"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            required
            rows={4}
              />
              <div className="text-xs text-muted-foreground text-right">
            {form.details.length}/300
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors duration-150"
            type="submit"
              >
            Add
              </button>
              <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() =>
              setForm({ project: "", role: "", details: "", status: "In Progress" })
            }
              >
            Reset
              </button>
              <button
            type="button"
            className="ml-auto text-sm text-blue-600 hover:underline"
            onClick={() => setShowForm(false)}
              >
            Cancel
              </button>
            </div>
          </form>

          {/* Live Preview */}
          <div className="hidden md:block p-3">
            <div
              className={`rounded-lg shadow p-4 border-l-4 bg-gradient-to-br ${
            form.status === "Completed"
              ? "from-green-50 to-white border-green-400"
              : "from-yellow-50 to-white border-yellow-400"
              }`}
              aria-hidden="true"
            >
              <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-lg text-blue-800 flex items-center gap-2 break-words">
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-blue-400"
                aria-hidden="true"
              >
                <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6l4 2"
                />
              </svg>
              {form.project || "Project Name"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                form.status === "Completed"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-yellow-100 text-yellow-800 border border-yellow-300"
              }`}
            >
              {form.status}
            </span>
              </div>

              <div className="text-base-content/80 mb-1">
            <span className="font-medium text-blue-700">Role:</span>{" "}
            {form.role || "Role title"}
              </div>
              <div className="text-base-content/80 mb-1">
            <span className="font-medium text-blue-700">Details:</span>{" "}
            <span className="break-words">
              {form.details || "Short description of the contribution..."}
            </span>
              </div>

              <div className="text-xs text-muted-foreground mt-3">
            This is a live preview. Submitting will add it to the contributions list.
              </div>
            </div>
          </div>
            </div>
          </div>
        )}

        {/* Contributions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-base-content/60 py-8">
            No contributions found.
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              className={`rounded-lg shadow p-5 border-l-4 bg-gradient-to-br ${
                c.status === "Completed"
                  ? "from-green-50 to-white border-green-400"
                  : "from-yellow-50 to-white border-yellow-400"
              } hover:shadow-lg transition-shadow duration-150`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg text-blue-800 flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-blue-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6l4 2"
                    />
                  </svg>
                  {c.project}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    c.status === "Completed"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <div className="text-base-content/80 mb-1">
                <span className="font-medium text-blue-700">Role:</span>{" "}
                {c.role}
              </div>
              <div className="text-base-content/80 mb-1">
                <span className="font-medium text-blue-700">Details:</span>{" "}
                {c.details}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectContributions;
