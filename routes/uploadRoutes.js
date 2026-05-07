import express from 'express';
import { 
  uploadImage, 
  uploadMultiple, 
  uploadResume,
  deleteImage,
  getUploadedFiles,
  upload,
  resumeUpload
} from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Image upload routes
router.post('/single', protect, upload.single('image'), uploadImage);
router.post('/multiple', protect, upload.array('images', 10), uploadMultiple);
router.post('/hero', protect, upload.single('image'), uploadImage);
router.post('/logo', protect, upload.single('image'), uploadImage);
router.post('/blog', protect, upload.single('image'), uploadImage);
router.post('/project', protect, upload.single('image'), uploadImage);
router.post('/profile', protect, upload.single('image'), uploadImage);
router.post('/about', protect, upload.single('image'), uploadImage);
router.post('/skill', protect, upload.single('image'), uploadImage);

// Resume upload route
router.post('/resume', protect, resumeUpload.single('resume'), uploadResume);

// Delete route
router.delete('/:folder/:filename', protect, deleteImage);

// Get files route
router.get('/files', protect, getUploadedFiles);

export default router;