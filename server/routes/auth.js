import express from "express";
import {
  registerStudent,
  registerEmployee,
  registerInstitution,
  registerCompany,
  loginUser,
  getProfile,
  updateProfile
} from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadImage.js";

const router = express.Router();

// Auth
router.post("/register/student", registerStudent);
router.post("/register/employee", registerEmployee);
router.post("/register/institution", registerInstitution);
router.post("/register/company", registerCompany);
router.post("/login", loginUser);

// Profile
router.get("/profile", verifyToken(), getProfile);
router.put("/profile", verifyToken(), upload.single("profileImage"), updateProfile);


export default router;
