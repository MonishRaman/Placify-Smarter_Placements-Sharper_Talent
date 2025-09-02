import express from "express";
import cors from "cors";
import feedbackRoutes from "./routes/feedback.js";
import { PORT } from "./config/env.js"
import connectToDatabase from "./config/db.js";
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.js";
import interviewRoutes from "./routes/interview.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import performance from "./routes/performance.js"
import jobRoute from "./routes/job.js"
import path from "path";
import { fileURLToPath } from "url";
import settingsRoutes from "./routes/settingsI.js";
import atsRoutes from "./routes/ats.js";
import resumeRoutes from "./routes/resume.js"; // New import for resume routes
import resumeScoreRoutes from "./routes/resumeScore.js"; // New import for resume score routes

import studentRoutes from "./routes/studentRoutes.js"; // Corrected import for studentRoutes


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set a default port if not provided in environment variables
const port = PORT || 5000;


const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

// ====== API Routes ======
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/institution", institutionRoutes);
app.use("/api/performance", performance);
app.use("/api/students", studentRoutes); // New route for student progress tracker
app.use("/api/ats", atsRoutes);
app.use("/api/resume/score", resumeScoreRoutes); // New route for resume score persistence - MUST come before /api/resume
app.use("/api/resume", resumeRoutes);
app.use("api/jobs",jobRoute)

app.get("/", (req, res) => {
  res.json({
    message: "Placify Feedback Server is running! 📧",
    status: "active",
    endpoints: {
      feedback: "/api/feedback",
      test: "/api/feedback/test",
      resume: "/api/resume",
      resumeScore: "/api/resume/score"
    }
  });
});

app.get("/test", (req, res) => {
  res.json({ message: "Server is working!", timestamp: new Date().toISOString() });
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add settings routes
app.use('/api/settings', settingsRoutes);
//404 error handler
app.use((req, res) => {
  res.status(404).json({ error: 'End point Not found' });
});
//global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server errror' });
})
// ====== Start Server ======
app.listen(port, async () => {
  console.log(`✅ Feedback server running on port ${port}`);
  // Optional: connect to MongoDB (requires valid MONGO_URI)
  await connectToDatabase(); // 🔄 Comment this out if not using MongoDB
  console.log(`📧 Ready to send emails!`);
});
