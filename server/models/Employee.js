import mongoose from "mongoose";
import User from "./User.js";
const employeeSchema = new mongoose.Schema({
  currentCompany: { type: String, required: true },
  jobTitle: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  experience: { type: String },
  skills: [{ type: String }],
  department: { type: String },
  workLocation: { type: String },
  profileImage: { type: String }
});

export default User.discriminator("Employee", employeeSchema);
