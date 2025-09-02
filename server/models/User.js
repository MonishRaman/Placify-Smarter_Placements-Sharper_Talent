import mongoose from "mongoose";

const baseUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    // role must be strictly controlled
    role: {
      type: String,
      required: true,
      enum: ["admin", "company", "employee", "student","institution"],
      default: "student"
    },

    // Common fields
    name: { type: String, required: true },
    phone: { type: String },
    dob: { type: Date },
    address: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    education: { type: String },
    profileImage: { type: String },


    // Candidate-specific fields
    resume: { type: String },  // Legacy field for backward compatibility
    resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resume" }], // New field for resume references
    skills: [{ type: String }],
  },
  { timestamps: true }
);
const User = mongoose.model("User", baseUserSchema);
export default User;
