import express from 'express';
import {
    createInterviewExperience,
    getAllInterviewExperiences,
    getInterviewExperienceById,

    getInterviewStats,

} from '../controllers/interviewExperienceController.js';

const router = express.Router();

router.post('/', createInterviewExperience);
router.get('/', getAllInterviewExperiences);
router.get('/stats', getInterviewStats);
router.get('/:id', getInterviewExperienceById);


export default router;
