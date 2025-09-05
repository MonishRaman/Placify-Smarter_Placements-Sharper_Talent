import verifyToken from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();
import { createJob,updateJob,getJobs ,deleteJob,applyForJob} from "../controllers/jobController.js";

router.get("/",getJobs)

// secured routes
router.post("/",verifyToken(["company"]),createJob)
router.patch("/:id",verifyToken(["company"]),updateJob)
router.delete("/:id", verifyToken(["company","admin"]), deleteJob); // DELETE job
router.post("/:id/apply", verifyToken(["student"]), applyForJob); // Apply for job



export default router;