import mongoose from "mongoose";
import User from "./User.js";

const institutionSchema = new mongoose.Schema({
  
  website: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  establishedYear: { type: Number },
  description: { type: String },
  accreditation: { type: String },
  totalStudents: { type: Number },
  profileImage: { type: String }
});

export default User.discriminator("Institution", institutionSchema);