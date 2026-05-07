import express from 'express';
import { getResume, updateResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getResume);
router.put('/', protect, updateResume);

export default router;