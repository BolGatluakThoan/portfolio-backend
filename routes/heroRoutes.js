import express from 'express';
import { getHero, updateHero } from '../controllers/heroController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getHero);
router.put('/', protect, updateHero);

export default router;