import express from 'express';
import { getNavbar, updateNavbar } from '../controllers/navbarController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getNavbar);
router.put('/', protect, updateNavbar);

export default router;