import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ====== Config ======
import { PORT } from "./config/env.js";
import connectToDatabase from "./config/db.js";

// ====== Routes ======
import authRoutes from "./routes/auth.js";
import atsRoutes from "./routes/ats.js";
import chatRoutes from "./routes/chat.js";
import companyRoutes from "./routes/job.js";
import feedbackRoutes from "./routes/feedback.js";
import healthRoutes from "./routes/health.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import interviewRoutes from "./routes/interview.js";
import interviewExperienceRoutes from "./routes/interviewExperience.js";
import paymentRoutes from "./routes/Payment.js";
import performanceRoutes from "./routes/performance.js";
import questionsRoutes from "./routes/questions.js";
import resumeRoutes from "./routes/resume.js";
import resumeScoreRoutes from "./routes/resumeScore.js";
import settingsRoutes from "./routes/settingsI.js";

// Dry-Run routes for code validation
import cDryRunRoutes from "./routes/cDryRun.js";
import javaDryRunRoutes from "./routes/javaDryRun.js";
import dryRunRoutes from "./routes/dryrun.js";
import studentRoutes from "./routes/studentRoutes.js";

// ====== Path Setup ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== App Setup ======
const app = express();
const port = PORT || 5000;

// ====== Middleware ======
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== API Routes ======
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/institution", institutionRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/resume/score", resumeScoreRoutes); // Must come before /api/resume
app.use("/api/resume", resumeRoutes);
app.use("/api/interview-experience", interviewExperienceRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/jobs", companyRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/settings", settingsRoutes);

// Dry-Run endpoints for code validation (Python, Java, C/C++)
app.use("/api", dryRunRoutes); // Python dry-run: POST /api/dryrun
app.use("/api", javaDryRunRoutes); // Java dry-run: POST /api/java-dry-run
app.use("/api/c-dry-run", cDryRunRoutes); // C/C++ dry-run: POST /api/c-dry-run

// ====== Default Routes ======
app.get("/", (req, res) => {
  res.json({
    message: "Placify Feedback Server is running! 📧",
    status: "active",
    endpoints: {
      feedback: "/api/feedback",
      resume: "/api/resume",
      resumeScore: "/api/resume/score",
      interviewExperience: "/api/interview-experience",
    },
  });
});

app.get("/test", (req, res) => {
  res.json({
    message: "Server is working!",
    timestamp: new Date().toISOString(),
  });
});

// ====== Error Handling ======
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint Not Found" });
});

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ====== Start Server ======
app.listen(port, async () => {
  console.log(`✅ Server running on port ${port}`);

  try {
    await connectToDatabase();
    console.log("📦 Connected to MongoDB");
    console.log("📧 Ready to send emails!");
  } catch (dbError) {
    console.error("❌ Database connection failed:", dbError.message);
  }
});
