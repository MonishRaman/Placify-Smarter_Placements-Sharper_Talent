// server/controllers/studentController.js

// Mock data to simulate fetching from a database
const mockStudents = [
  {
    id: 1,
    name: "Rohan Sharma",
    email: "rohan.sharma@placify.dev",
    status: "In Progress",
    progress: 75,
  },
  {
    id: 2,
    name: "Ananya Gupta",
    email: "ananya.gupta@placify.dev",
    status: "Completed",
    progress: 100,
  },
  {
    id: 3,
    name: "Vikram Singh",
    email: "vikram.singh@placify.dev",
    status: "Not Started",
    progress: 0,
  },
  {
    id: 4,
    name: "Priya Verma",
    email: "priya.verma@placify.dev",
    status: "In Progress",
    progress: 40,
  },
  {
    id: 5,
    name: "Siddharth Rao",
    email: "siddharth.rao@placify.dev",
    status: "In Progress",
    progress: 90,
  },
  {
    id: 6,
    name: "Neha Joshi",
    email: "neha.joshi@placify.dev",
    status: "Completed",
    progress: 100,
  },
  {
    id: 7,
    name: "Rahul Kumar",
    email: "rahul.kumar@placify.dev",
    status: "Not Started",
    progress: 0,
  },
  {
    id: 8,
    name: "Tanya Reddy",
    email: "tanya.reddy@placify.dev",
    status: "In Progress",
    progress: 65,
  },
];

// Mock data for detailed view of specific students
const mockStudentDetails = {
  1: {
    name: "Rohan Sharma",
    email: "rohan.sharma@placify.dev",
    status: "In Progress",
    progress: 75,
    lastInterview: "AI Interview Bot",
    lastScore: 85,
    feedback: "Good technical foundation, focus on communication skills.",
    metrics: [
      { name: "Technical Score", value: 90, icon: "Zap" },
      { name: "Confidence", value: 75, icon: "Star" },
      { name: "Clarity & Tone", value: 80, icon: "Clock" },
    ],
  },
  2: {
    name: "Ananya Gupta",
    email: "ananya.gupta@placify.dev",
    status: "Completed",
    progress: 100,
    lastInterview: "Final Round",
    lastScore: 92,
    feedback: "Excellent overall performance. Ready for the role.",
    metrics: [
      { name: "Technical Score", value: 95, icon: "Zap" },
      { name: "Confidence", value: 90, icon: "Star" },
      { name: "Clarity & Tone", value: 95, icon: "Clock" },
    ],
  },
  3: {
    name: "Vikram Singh",
    email: "vikram.singh@placify.dev",
    status: "Not Started",
    progress: 0,
    lastInterview: "N/A",
    lastScore: 0,
    feedback: "No interviews completed yet.",
    metrics: [
      { name: "Technical Score", value: 0, icon: "Zap" },
      { name: "Confidence", value: 0, icon: "Star" },
      { name: "Clarity & Tone", value: 0, icon: "Clock" },
    ],
  },
};

// @desc   Get all students progress
// @route  GET /api/students
export const getStudentProgress = async (req, res) => {
  try {
    res.status(200).json(mockStudents);
  } catch (error) {
    console.error("Error fetching student progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Get single student by ID
// @route  GET /api/students/:id
export const getStudentById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = mockStudentDetails[id];

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
