import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteTitle: {
    type: String,
    required: true,
  },
  siteDescription: String,
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  logo: {
    type: {
      type: String,
      enum: ['text', 'url', 'upload'],
      default: 'text',
    },
    value: String,
  },
  favicon: {
    type: {
      type: String,
      enum: ['url', 'upload'],
      default: 'url',
    },
    value: String,
  },
  autoReplyEnabled: {
    type: Boolean,
    default: true,
  },
  autoReplyMessage: {
    type: String,
    default: 'Thank you for reaching out! I will get back to you soon.',
  },
  adminEmail: String,
  googleAnalyticsId: String,
  // Add admin shortcut settings
  adminShortcut: {
    enabled: {
      type: Boolean,
      default: true,
    },
    key: {
      type: String,
      default: 'a',
    },
    presses: {
      type: Number,
      default: 3,
    },
    timeout: {
      type: Number,
      default: 1000,
    },
  },
}, {
  timestamps: true,
});

export default mongoose.model('Settings', settingsSchema);