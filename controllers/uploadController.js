import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Keep uploads dir only for temporary buffering (safe fallback)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =====================
// MEMORY STORAGE (FIX)
// =====================
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'));
  }
};

// Configure multer for images
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

// Resume storage (still memory-safe approach)
const resumeStorage = multer.memoryStorage();

const resumeFileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX files are allowed'));
  }
};

const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: resumeFileFilter
});

// =====================
// CLOUDINARY UPLOAD LOGIC
// =====================

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// =====================
// SINGLE IMAGE UPLOAD
// =====================
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
        success: false
      });
    }

    let folder = 'general';
    if (req.path.includes('/hero')) folder = 'hero';
    else if (req.path.includes('/logo')) folder = 'logo';
    else if (req.path.includes('/blog')) folder = 'blog';
    else if (req.path.includes('/project')) folder = 'project';
    else if (req.path.includes('/profile')) folder = 'profile';
    else if (req.path.includes('/about')) folder = 'about';
    else if (req.path.includes('/skill')) folder = 'skill';

    // UPLOAD TO CLOUDINARY (FIX)
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.json({
      success: true,
      type: 'upload',
      value: result.secure_url,
      filename: result.public_id,
      folder,
      size: result.bytes,
      mimetype: req.file.mimetype,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

// =====================
// RESUME UPLOAD
// =====================
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
        success: false
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'resume');

    res.json({
      success: true,
      type: 'upload',
      value: result.secure_url,
      filename: result.public_id,
      folder: 'resume',
      size: result.bytes,
      mimetype: req.file.mimetype,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

// =====================
// MULTIPLE UPLOAD
// =====================
export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded',
        success: false
      });
    }

    const images = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadToCloudinary(file.buffer, 'general');
        return {
          success: true,
          type: 'upload',
          value: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
          mimetype: file.mimetype,
        };
      })
    );

    res.json({
      success: true,
      count: images.length,
      images,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

// =====================
// DELETE (CLOUDINARY)
// =====================
export const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;

    await cloudinary.uploader.destroy(filename);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};

// =====================
// FILE LIST (DISABLED LOCAL STORAGE)
// =====================
export const getUploadedFiles = async (req, res) => {
  res.json({
    success: true,
    message: "Files are now stored in Cloudinary, not locally.",
  });
};

export { upload, resumeUpload };
