import express from 'express';
import { 
  login, 
  getMe, 
  verifyToken,
  changePassword,
  logout,
  refreshToken,
  updateProfile,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/verify', verifyToken);
router.post('/refresh-token', refreshToken);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

// Admin only routes (user management)
router.get('/users', protect, getAllUsers);
router.post('/users', protect, createUser);
router.put('/users/:id', protect, updateUser);
router.delete('/users/:id', protect, deleteUser);
router.post('/users/:id/reset-password', protect, resetUserPassword);

export default router;