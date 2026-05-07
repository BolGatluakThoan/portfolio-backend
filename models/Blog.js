import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
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
  tags: [String],
  views: {
    type: Number,
    default: 0,
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: Date,
}, {
  timestamps: true,
});

export default mongoose.model('Blog', blogSchema);