// Mock Feedback Service
// This module encapsulates feedback data operations so the UI stays clean.
// TODO: Replace in-memory store with real API calls when backend is ready.

let _feedback = [
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

export function fetchCompanyFeedback() {
    // Simulate async fetch
    return new Promise((resolve) => {
        setTimeout(() => resolve([..._feedback]), 150);
    });
}

export function createFeedback({ employee, feedback, rating }) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!employee || !feedback || !rating) {
                reject(new Error("Missing required fields"));
                return;
            }
            const newItem = {
                id: _feedback.length ? Math.max(..._feedback.map((f) => f.id)) + 1 : 1,
                employee: employee.trim(),
                feedback: feedback.trim(),
                rating: Number(rating),
                date: new Date().toISOString().slice(0, 10),
            };
            _feedback = [newItem, ..._feedback];
            resolve(newItem);
        }, 200);
    });
}

// Helper for tests (optional)
export function _resetFeedback(data) {
    _feedback = data || [];
}
