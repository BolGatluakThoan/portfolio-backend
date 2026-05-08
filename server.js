import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import navbarRoutes from './routes/navbarRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import mongoose from 'mongoose';
import uploadRoutes from './routes/uploadRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import emailTemplateRoutes from './routes/emailTemplateRoutes.js';
import { trackVisitor } from './middleware/trackVisitor.js';
import visitorRoutes from './routes/visitorRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Validate required env vars
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing: ${varName}`);
    process.exit(1);
  }
});

// Connect DB
connectDB();

const app = express();

/* =========================
   CORS CONFIG (FIXED)
========================= */
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Track visitors
app.use(trackVisitor);

/* =========================
   ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/navbar', navbarRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/email-templates', emailTemplateRoutes);
app.use('/api/visitors', visitorRoutes);

/* =========================
   HEALTH CHECK (FIXED)
========================= */
app.get('/', (req, res) => {
  res.json({
    status: 'Backend is running 🚀',
    time: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

/* =========================
   ERROR HANDLING
========================= */
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.CLIENT_URL}`);
});

/* =========================
   CRASH HANDLING
========================= */
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});