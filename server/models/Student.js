import mongoose from "mongoose";
import User from "./User.js";

const studentSchema = new mongoose.Schema({
  university: { type: String, required: true },
  major: { type: String, required: true }
});

const Student = User.discriminator("Student", studentSchema);

export default Student;

