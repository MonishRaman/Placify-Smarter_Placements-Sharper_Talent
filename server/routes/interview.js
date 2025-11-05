// server/routes/interviews.js
import express from 'express';
import Interview from '../models/Interview.js';
import verifyToken from '../middleware/authMiddleware.js'; // Optional: for protected access
import handleVideo from "../controllers/videoController.js"
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @route   GET /api/interviews/past
 * @desc    Get all completed (past) interviews
 * @access  Private (optional - uncomment verifyToken if needed)
 */
router.get('/past', /* verifyToken, */ async (req, res) => {
  try {
const pastInterviews = await Interview.find({ status: 'completed' });


    const formatted = pastInterviews.map((interview) => ({
      id: interview._id,
      title: interview.title,
      company: interview.company,
      date: new Date(interview.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      score: interview.score,
      status: interview.status,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    logger.error('Error fetching past interviews:', error);
    res.status(500).json({ message: 'Server error while fetching past interviews' });
  }
});
router.post("/upload", handleVideo )
export default router;
