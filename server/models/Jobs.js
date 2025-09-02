import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    type: { type: String, enum: ["Full-time", "Part-time", "Internship"], required: true },
    domain: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
    salary: { type: String },
    description: { type: String },

    // Extra useful fields
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],

    // Ab applicants ke sath resume link bhi hoga
    applicants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        resume: { type: String, required: true }, // Resume ka link
        appliedAt: { type: Date, default: Date.now }, // Kab apply kiya
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
