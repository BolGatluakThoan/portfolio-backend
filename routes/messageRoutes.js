import express from 'express';
import {
  sendMessage,
  getMessages,
  getMessage,
  markAsRead,
  deleteMessage,
  markAsReplied,
  getUnreadCount
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', sendMessage);

// Protected routes (require authentication)
router.get('/', protect, getMessages);
router.get('/unread/count', protect, getUnreadCount);
router.get('/:id', protect, getMessage);
router.put('/:id/read', protect, markAsRead);
router.put('/:id/replied', protect, markAsReplied);
router.delete('/:id', protect, deleteMessage);

export default router;