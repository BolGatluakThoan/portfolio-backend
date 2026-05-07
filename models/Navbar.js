import mongoose from 'mongoose';

const navbarSchema = new mongoose.Schema({
  logo: {
    type: {
      type: String,
      enum: ['text', 'url', 'upload'],
      default: 'text',
    },
    value: {
      type: String,
      default: 'Portfolio',
    },
  },
  menu: [{
    name: String,
    path: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Navbar', navbarSchema);