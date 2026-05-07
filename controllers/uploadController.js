import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from '../config/cloudinary.js';

// Store files temporarily in memory before uploading to Cloudinary
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype =
    file.mimetype.startsWith('image/');

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'
      )
    );
  }
};

// Configure multer for images
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

// File filter for resume files
const resumeFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX files are allowed'));
  }
};

// Configure multer for resumes
const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: resumeFileFilter,
});

// Helper function to determine folder
const getFolderName = (req) => {
  if (req.path.includes('/hero')) return 'hero';
  if (req.path.includes('/logo')) return 'logo';
  if (req.path.includes('/blog')) return 'blog';
  if (req.path.includes('/project')) return 'project';
  if (req.path.includes('/profile')) return 'profile';
  if (req.path.includes('/about')) return 'about';
  if (req.path.includes('/skill')) return 'skill';
  if (req.path.includes('/resume')) return 'resume';

  return 'general';
};

// Upload buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder, mimetype) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `portfolio/${folder}`,
        resource_type:
          mimetype === 'application/pdf'
            ? 'raw'
            : 'auto',
        public_id: uuidv4(),
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// @desc Upload single image
// @route POST /api/upload/single
// @route POST /api/upload/hero
// @route POST /api/upload/logo
// @route POST /api/upload/blog
// @route POST /api/upload/project
// @route POST /api/upload/profile
// @route POST /api/upload/about
// @route POST /api/upload/skill
// @access Private
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
        success: false,
      });
    }

    const folder = getFolderName(req);

    const result = await uploadToCloudinary(
      req.file.buffer,
      folder,
      req.file.mimetype
    );

    res.json({
      success: true,
      type: 'upload',
      value: result.secure_url,
      public_id: result.public_id,
      folder,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// @desc Upload resume file
// @route POST /api/upload/resume
// @access Private
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
        success: false,
      });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      'resume',
      req.file.mimetype
    );

    res.json({
      success: true,
      type: 'upload',
      value: result.secure_url,
      public_id: result.public_id,
      folder: 'resume',
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// @desc Upload multiple images
// @route POST /api/upload/multiple
// @access Private
export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded',
        success: false,
      });
    }

    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadToCloudinary(
          file.buffer,
          'general',
          file.mimetype
        );

        return {
          success: true,
          type: 'upload',
          value: result.secure_url,
          public_id: result.public_id,
          size: file.size,
          mimetype: file.mimetype,
        };
      })
    );

    res.json({
      success: true,
      count: uploadedImages.length,
      images: uploadedImages,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// @desc Delete uploaded image
// @route DELETE /api/upload/:public_id
// @access Private
export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;

    await cloudinary.uploader.destroy(public_id);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// @desc Get uploaded files list
// @route GET /api/upload/files
// @access Private
export const getUploadedFiles = async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression('folder:portfolio/*')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    res.json({
      success: true,
      files: result.resources,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export { upload, resumeUpload };
