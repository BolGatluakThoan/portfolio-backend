import express from 'express';
import { getVisitorStats, trackVisitor, clearVisitors } from '../controllers/visitorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - for tracking visitors
router.post('/track', trackVisitor);

// Admin only routes
router.get('/stats', protect, getVisitorStats);
router.delete('/clear', protect, clearVisitors);  // Add this line

export default router;