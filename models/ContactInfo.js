import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: String,
  address: String,
  socials: {
    github: String,
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('ContactInfo', contactInfoSchema);