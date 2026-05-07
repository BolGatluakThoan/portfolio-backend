import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  ip: {
    type: String,
    index: true,
  },
  userAgent: {
    type: String,
  },
  page: {
    type: String,
  },
  referrer: {
    type: String,
  },
  visitedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

// Create compound index for faster queries
visitorSchema.index({ ip: 1, visitedAt: -1 });

export default mongoose.model('Visitor', visitorSchema);