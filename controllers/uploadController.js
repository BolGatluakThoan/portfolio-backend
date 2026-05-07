import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'general';
    
    // Determine folder based on request path
    if (req.path.includes('/hero')) {
      folder = 'hero';
    } else if (req.path.includes('/logo')) {
      folder = 'logo';
    } else if (req.path.includes('/blog')) {
      folder = 'blog';
    } else if (req.path.includes('/project')) {
      folder = 'project';
    } else if (req.path.includes('/profile')) {
      folder = 'profile';
    } else if (req.path.includes('/about')) {
      folder = 'about';
    } else if (req.path.includes('/skill')) {
      folder = 'skill';
    } else if (req.path.includes('/resume')) {
      folder = 'resume';
    }
    
    const folderPath = path.join(uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// Configure storage for resume files
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(uploadDir, 'resume');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter for resume files
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

// Configure multer for resumes
const resumeUpload = multer({ 
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: resumeFileFilter
});

// @desc    Upload single image
// @route   POST /api/upload/single
// @route   POST /api/upload/hero
// @route   POST /api/upload/logo
// @route   POST /api/upload/blog
// @route   POST /api/upload/project
// @route   POST /api/upload/profile
// @route   POST /api/upload/about
// @route   POST /api/upload/skill
// @access  Private
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded',
        success: false 
      });
    }
    
    // Determine folder for URL
    let folder = 'general';
    if (req.path.includes('/hero')) {
      folder = 'hero';
    } else if (req.path.includes('/logo')) {
      folder = 'logo';
    } else if (req.path.includes('/blog')) {
      folder = 'blog';
    } else if (req.path.includes('/project')) {
      folder = 'project';
    } else if (req.path.includes('/profile')) {
      folder = 'profile';
    } else if (req.path.includes('/about')) {
      folder = 'about';
    } else if (req.path.includes('/skill')) {
      folder = 'skill';
    }
    
    // Construct URL for the uploaded file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${folder}/${req.file.filename}`;
    
    res.json({
      success: true,
      type: 'upload',
      value: fileUrl,
      filename: req.file.filename,
      folder: folder,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      success: false 
    });
  }
};

// @desc    Upload resume file
// @route   POST /api/upload/resume
// @access  Private
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded',
        success: false 
      });
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/resume/${req.file.filename}`;
    
    res.json({
      success: true,
      type: 'upload',
      value: fileUrl,
      filename: req.file.filename,
      folder: 'resume',
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      success: false 
    });
  }
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        message: 'No files uploaded',
        success: false 
      });
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const images = req.files.map(file => ({
      success: true,
      type: 'upload',
      value: `${baseUrl}/uploads/general/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    }));
    
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

// @desc    Delete uploaded image
// @route   DELETE /api/upload/:folder/:filename
// @access  Private
export const deleteImage = async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const filePath = path.join(uploadDir, folder, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        message: 'File not found',
        success: false 
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
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

// @desc    Get uploaded files list
// @route   GET /api/upload/files
// @access  Private
export const getUploadedFiles = async (req, res) => {
  try {
    const folders = ['general', 'hero', 'logo', 'blog', 'project', 'profile', 'about', 'skill', 'resume'];
    const files = {};
    
    for (const folder of folders) {
      const folderPath = path.join(uploadDir, folder);
      if (fs.existsSync(folderPath)) {
        const folderFiles = fs.readdirSync(folderPath);
        files[folder] = folderFiles.map(filename => ({
          filename,
          url: `${req.protocol}://${req.get('host')}/uploads/${folder}/${filename}`,
          size: fs.statSync(path.join(folderPath, filename)).size,
          modified: fs.statSync(path.join(folderPath, filename)).mtime,
        }));
      } else {
        files[folder] = [];
      }
    }
    
    res.json({
      success: true,
      files,
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      success: false 
    });
  }
};

export { upload, resumeUpload };