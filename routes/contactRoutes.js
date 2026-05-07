import express from 'express';
import { getContactInfo, updateContactInfo } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getContactInfo);
router.put('/', protect, updateContactInfo);

export default router;