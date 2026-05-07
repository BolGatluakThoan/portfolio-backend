import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: String,
  version: {
    type: Number,
    default: 1,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Resume', resumeSchema);