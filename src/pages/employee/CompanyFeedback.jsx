import React, { useState } from "react";

const sampleFeedback = [
  {
    id: 1,
    employee: "Alice Johnson",
    feedback: "Great work environment and supportive team!",
    rating: 5,
    date: "2025-09-20",
  },
  {
    id: 2,
    employee: "Bob Smith",
    feedback: "Could improve communication between departments.",
    rating: 3,
    date: "2025-09-18",
  },
  {
    id: 3,
    employee: "Carol Lee",
    feedback: "Excellent growth opportunities.",
    rating: 4,
    date: "2025-09-15",
  },
  {
    id: 4,
    employee: "David Kim",
    feedback: "Work-life balance is good, but workload can be high at times.",
    rating: 4,
    date: "2025-09-10",
  },
];

function StarRating({ rating }) {
  return (
    <span className="text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

const CompanyFeedback = () => {
  const [feedbackList, setFeedbackList] = useState(sampleFeedback);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [form, setForm] = useState({ employee: "", feedback: "", rating: 0 });

  const filteredFeedback = feedbackList.filter((item) => {
    const matchesName = item.employee
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesDate = dateFilter ? item.date === dateFilter : true;
    return matchesName && matchesDate;
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setForm((prev) => ({ ...prev, rating }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.employee || !form.feedback || !form.rating) return;
    setFeedbackList([
      {
        id: feedbackList.length + 1,
        employee: form.employee,
        feedback: form.feedback,
        rating: form.rating,
        date: new Date().toISOString().slice(0, 10),
      },
      ...feedbackList,
    ]);
    setForm({ employee: "", feedback: "", rating: 0 });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        Company Feedback & Reviews
      </h2>

      {/* Filter/Search Bar */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by employee name..."
          className="border rounded px-3 py-2 w-full md:w-1/2 focus:outline-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="border rounded px-3 py-2 w-full md:w-1/4 focus:outline-primary"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Feedback Table */}
      <div className="overflow-x-auto rounded shadow mb-8">
        <table className="min-w-full bg-white dark:bg-gray-900">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <th className="py-2 px-4 text-left">Employee Name</th>
              <th className="py-2 px-4 text-left">Feedback</th>
              <th className="py-2 px-4 text-center">Rating</th>
              <th className="py-2 px-4 text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedback.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No feedback found.
                </td>
              </tr>
            ) : (
              filteredFeedback.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="py-2 px-4 font-medium">{item.employee}</td>
                  <td className="py-2 px-4">{item.feedback}</td>
                  <td className="py-2 px-4 text-center">
                    <StarRating rating={item.rating} />
                  </td>
                  <td className="py-2 px-4 text-center">{item.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Feedback Form */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-2">Add New Feedback</h3>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="employee"
            placeholder="Employee Name"
            className="border rounded px-3 py-2 focus:outline-primary"
            value={form.employee}
            onChange={handleFormChange}
            required
          />
          <textarea
            name="feedback"
            placeholder="Feedback/Review"
            className="border rounded px-3 py-2 focus:outline-primary resize-none"
            value={form.feedback}
            onChange={handleFormChange}
            required
            rows={3}
          />
          <div className="flex items-center gap-2">
            <span className="mr-2">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`text-2xl ${
                  form.rating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleRatingChange(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyFeedback;
