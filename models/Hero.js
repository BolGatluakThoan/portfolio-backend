import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  typewriter: {
    enabled: {
      type: Boolean,
      default: false,
    },
    strings: {
      type: [String],
      default: ['Software Engineer', 'Full Stack Developer', 'Problem Solver'],
    },
    typeSpeed: {
      type: Number,
      default: 50,
    },
    backSpeed: {
      type: Number,
      default: 30,
    },
    loop: {
      type: Boolean,
      default: true,
    },
  },
  ctaButtons: [{
    text: String,
    link: String,
    variant: {
      type: String,
      enum: ['primary', 'secondary'],
      default: 'primary',
    },
  }],
  image: {
    type: {
      type: String,
      enum: ['url', 'upload'],
      default: 'url',
    },
    value: String,
    publicId: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Hero', heroSchema);