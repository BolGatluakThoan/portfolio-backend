import Resume from '../models/Resume.js';

export const getResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ isActive: true }).sort('-version');
    if (!resume) {
      resume = await Resume.create({
        fileUrl: '#',
        fileName: 'resume.pdf',
      });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { fileUrl, fileName } = req.body;
    
    // Create new version
    const resume = await Resume.create({
      fileUrl,
      fileName,
      version: (await Resume.countDocuments()) + 1,
      isActive: true,
    });
    
    // Deactivate old versions
    await Resume.updateMany(
      { _id: { $ne: resume._id } },
      { isActive: false }
    );
    
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      success: false 
    });
  }
};