import React, { useState, useEffect } from "react";
import {
  fetchCompanyFeedback,
  createFeedback,
} from "../../services/feedbackService";

// Presentational star rating (read only)
function StarRatingDisplay({ rating }) {
  return (
    <span className="text-yellow-400" aria-label={`Rating: ${rating} of 5`}>
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

// Interactive star input component
function StarRatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div
      className="flex items-center"
      aria-label="Select rating"
      role="radiogroup"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = hover ? star <= hover : star <= value;
        return (
          <button
            type="button"
            key={star}
            role="radio"
            aria-checked={value === star}
            className={`text-2xl focus:outline-none transition-colors ${
              active ? "text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

const CompanyFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [form, setForm] = useState({ employee: "", feedback: "", rating: 0 });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Initial load
  useEffect(() => {
    let mounted = true;
    fetchCompanyFeedback()
      .then((data) => {
        if (mounted) setFeedbackList(data);
      })
      .catch(() => setError("Failed to load feedback."))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

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

  const validate = () => {
    const errs = {};
    if (!form.employee.trim()) errs.employee = "Employee name is required";
    if (!form.feedback.trim()) errs.feedback = "Feedback is required";
    if (!form.rating || form.rating < 1 || form.rating > 5)
      errs.rating = "Select a rating (1-5)";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setSubmitting(true);
    // Optimistic update
    const tempItem = {
      id: Date.now(),
      employee: form.employee.trim(),
      feedback: form.feedback.trim(),
      rating: form.rating,
      date: new Date().toISOString().slice(0, 10),
      _optimistic: true,
    };
    setFeedbackList((prev) => [tempItem, ...prev]);
    try {
      const saved = await createFeedback(form);
      // Replace optimistic item
      setFeedbackList((prev) =>
        prev.map((f) => (f.id === tempItem.id ? saved : f))
      );
      setForm({ employee: "", feedback: "", rating: 0 });
    } catch (err) {
      setError(err.message || "Failed to submit feedback");
      // Rollback optimistic item
      setFeedbackList((prev) => prev.filter((f) => f.id !== tempItem.id));
    } finally {
      setSubmitting(false);
    }
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
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Loading feedback...
                </td>
              </tr>
            ) : filteredFeedback.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No feedback found.
                </td>
              </tr>
            ) : (
              filteredFeedback.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    item._optimistic ? "opacity-70" : ""
                  }`}
                >
                  <td className="py-2 px-4 font-medium">{item.employee}</td>
                  <td className="py-2 px-4">{item.feedback}</td>
                  <td className="py-2 px-4 text-center">
                    <StarRatingDisplay rating={item.rating} />
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
        {error && (
          <div className="mb-3 text-sm text-red-600" role="alert">
            {error}
          </div>
        )}
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-3"
          noValidate
        >
          <div>
            <input
              type="text"
              name="employee"
              placeholder="Employee Name"
              className={`border rounded px-3 py-2 w-full focus:outline-primary ${
                formErrors.employee ? "border-red-500" : ""
              }`}
              value={form.employee}
              onChange={handleFormChange}
              aria-invalid={!!formErrors.employee}
            />
            {formErrors.employee && (
              <p className="mt-1 text-xs text-red-500">{formErrors.employee}</p>
            )}
          </div>
          <div>
            <textarea
              name="feedback"
              placeholder="Feedback/Review"
              className={`border rounded px-3 py-2 w-full focus:outline-primary resize-none ${
                formErrors.feedback ? "border-red-500" : ""
              }`}
              value={form.feedback}
              onChange={handleFormChange}
              rows={3}
              aria-invalid={!!formErrors.feedback}
            />
            {formErrors.feedback && (
              <p className="mt-1 text-xs text-red-500">{formErrors.feedback}</p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="mr-1">Rating:</span>
              <StarRatingInput
                value={form.rating}
                onChange={handleRatingChange}
              />
            </div>
            {formErrors.rating && (
              <p className="mt-1 text-xs text-red-500">{formErrors.rating}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyFeedback;
