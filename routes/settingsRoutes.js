import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET is public - no authentication needed
router.get('/', getSettings);

// PUT requires authentication
router.put('/', protect, updateSettings);

export default router;