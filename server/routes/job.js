import verifyToken from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();
import { createJob,updateJob,getJobs ,deleteJob,applyForJob,getAppliedJobs,withdrawApplication,getCompanyJobs} from "../controllers/jobController.js";

router.get("/",getJobs)

// secured routes
router.post("/",verifyToken(["company"]),createJob)
router.patch("/:id",verifyToken(["company"]),updateJob)
router.delete("/:id", verifyToken(["company","admin"]), deleteJob); // DELETE job
router.post("/:id/apply", verifyToken(["student"]), applyForJob); // Apply for job
router.get("/applied", verifyToken(["student"]), getAppliedJobs);   // View applied jobs
router.delete("/:id/withdraw", verifyToken(["student"]), withdrawApplication); // Withdraw application
router.get("/mine", verifyToken(["company"]), getCompanyJobs);// companyjobs on company's portal 





export default router;