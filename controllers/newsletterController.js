import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Subscriber from '../models/Subscriber.js';
import { Resend } from 'resend';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory (backend folder)
dotenv.config({ path: path.join(__dirname, '../.env') });

// Get Resend configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const SITE_NAME = process.env.SITE_NAME || 'Bol Portfolio';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Initialize Resend
let resend = null;

if (RESEND_API_KEY && RESEND_API_KEY !== '') {
  resend = new Resend(RESEND_API_KEY);
}

// Send email function
const sendEmail = async (to, subject, html) => {
  if (!resend) {
    return false;
  }
  
  if (!to) {
    return false;
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: subject,
      html: html,
    });
    
    if (error) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// @desc    Subscribe to newsletter
export const subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required',
        success: false 
      });
    }

    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.status === 'unsubscribed') {
        subscriber.status = 'active';
        subscriber.unsubscribedAt = null;
        await subscriber.save();
        
        return res.json({ 
          message: 'Welcome back! You have been resubscribed.',
          success: true 
        });
      }
      
      return res.status(400).json({ 
        message: 'Email already subscribed',
        success: false 
      });
    }

    subscriber = await Subscriber.create({
      email,
      name: name || '',
    });

    const welcomeHtml = `
      ...
      <a href="${CLIENT_URL}/blog" ...
      ...
      <a href="${CLIENT_URL}/unsubscribe?email=${email}" ...
      ...
    `;

    await sendEmail(
      email,
      `🎉 Welcome to ${SITE_NAME}, ${name || 'Developer'}! 🚀`,
      welcomeHtml
    );

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully! Check your email.',
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
      },
    });

  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      success: false 
    });
  }
};

// @desc    Unsubscribe from newsletter
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Subscriber.findOne({ email });
    
    if (!subscriber) {
      return res.status(404).json({ 
        message: 'Email not found',
        success: false 
      });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({
      success: true,
      message: 'Unsubscribed successfully',
    });

  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      success: false 
    });
  }
};

// @desc    Get all subscribers (Admin only)
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort('-subscribedAt');
    const activeCount = await Subscriber.countDocuments({ status: 'active' });
    const totalCount = await Subscriber.countDocuments();

    res.json({
      success: true,
      count: subscribers.length,
      activeCount,
      totalCount,
      subscribers,
    });

  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      success: false 
    });
  }
};

// @desc    Send newsletter to all subscribers (Admin only)
export const sendNewsletter = async (req, res) => {
  try {
    const { subject, content, blogUrl } = req.body;

    const subscribers = await Subscriber.find({ status: 'active' });

    const emailResults = [];

    for (const subscriber of subscribers) {
      const emailHtml = `
        ...
        <a href="${CLIENT_URL}/unsubscribe?email=${subscriber.email}" ...
        ...
      `;

      const sent = await sendEmail(subscriber.email, subject, emailHtml);
      emailResults.push({ email: subscriber.email, sent });

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const successCount = emailResults.filter(r => r.sent).length;

    res.json({
      success: true,
      message: `Newsletter sent to ${successCount} of ${subscribers.length} subscribers`,
      count: successCount,
    });

  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      success: false 
    });
  }
};