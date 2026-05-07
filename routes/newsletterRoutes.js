import express from 'express';
import { 
  subscribe, 
  unsubscribe, 
  getSubscribers, 
  sendNewsletter 
} from '../controllers/newsletterController.js';
import { 
  getTemplates, 
  getTemplate, 
  updateTemplate, 
  resetTemplate,
  previewTemplate 
} from '../controllers/emailTemplateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin only routes
router.get('/subscribers', protect, getSubscribers);
router.post('/send', protect, sendNewsletter);

// Email Template Management Routes (Admin only)
router.get('/templates', protect, getTemplates);
router.get('/templates/:name', protect, getTemplate);
router.put('/templates/:name', protect, updateTemplate);
router.post('/templates/:name/reset', protect, resetTemplate);
router.post('/templates/preview', protect, previewTemplate);

export default router;