import verifyToken from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();
import { createJob,updateJob,getJobs } from "../controllers/jobController.js";

router.get("/",getJobs)

// secured routes
router.post("/",verifyToken(["company"]),createJob)
router.patch("/:id",verifyToken(["company"]),updateJob)



export default router;