import express from 'express';
import { 
  getTemplates, 
  getTemplate, 
  updateTemplate, 
  resetTemplate,
  previewTemplate
} from '../controllers/emailTemplateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication (admin only)
router.use(protect);

router.get('/', getTemplates);
router.get('/:name', getTemplate);
router.put('/:id', updateTemplate);
router.post('/:name/reset', resetTemplate);
router.post('/preview', previewTemplate);

export default router;