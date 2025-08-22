import mongoose from "mongoose";
import User from "./User.js";

const studentSchema = new mongoose.Schema({
  university: { type: String, required: true },
  major: { type: String, required: true },
    placementStatus: { type: String, enum: ["Placed", "Not Placed"], default: "Not Placed" },
  interviewAttendance: { type: Number, default: 0 },
  resultStatus: { type: String, enum: ["Pass", "Fail"], default: "Fail" },
  department: { type: String },
  year: { type: String },
  semester: { type: String },
  attendance: { type: Number, default: 0 }, // ✅ Add this
  passedInterviews: { type: Number, default: 0 }, // ✅ Add this
  failedInterviews: { type: Number, default: 0 }, // ✅ Add this
});

const Student = User.discriminator("Student", studentSchema);

export default Student;

