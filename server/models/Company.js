
import mongoose from "mongoose";
import User from "./User.js";

const companySchema = new mongoose.Schema({
  industry: { type: String, required: true },
  website: { type: String },
  description: { type: String },
  foundedYear: { type: Number },
  employeeCount: { type: Number }
});

export default User.discriminator("Company", companySchema);
