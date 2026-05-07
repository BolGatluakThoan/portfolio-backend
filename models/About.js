import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  bio: {
    type: String,
    required: true,
  },
  skillsSummary: {
    type: String,
    required: true,
  },
  image: {
    type: {
      type: String,
      enum: ['url', 'upload'],
      default: 'url',
    },
    value: String,
  },
  experiences: [{
    title: String,
    company: String,
    period: String,
    description: String,
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('About', aboutSchema);