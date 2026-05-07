import Message from '../models/Message.js';
import Settings from '../models/Settings.js';
import EmailTemplate from '../models/EmailTemplate.js';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_NAME = process.env.SITE_NAME || 'Bol Portfolio';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Send email function
const sendEmail = async (to, from, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: from,
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

// Helper function to replace variables in template
const replaceVariables = (html, variables) => {
  let result = html;
  for (const [key, value] of Object.entries(variables)) {
    if (value !== undefined && value !== null) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
  }
  return result;
};

// @desc    Send contact message
// @route   POST /api/messages
// @access  Public
export const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required',
        success: false 
      });
    }
    
    // Save to database
    const newMessage = await Message.create({ name, email, subject, message });

    // Get settings
    const settings = await Settings.findOne();
    const adminEmail = settings?.adminEmail || process.env.ADMIN_EMAIL || 'bolgatluak107@gmail.com';
    const senderEmail = settings?.senderEmail || 'onboarding@resend.dev';
    const autoReplyEnabled = settings?.autoReplyEnabled !== false;
    const autoReplyMessage = settings?.autoReplyMessage || 'Thank you for reaching out! I will get back to you within 24-48 hours.';

    // Get email templates
    let userTemplate = null;
    let adminTemplate = null;
    
    try {
      userTemplate = await EmailTemplate.findOne({ name: 'user_auto_reply', isActive: true });
      adminTemplate = await EmailTemplate.findOne({ name: 'admin_notification', isActive: true });
    } catch (templateError) {
      // Silent fail
    }

    // Common variables for templates
    const commonVariables = {
      siteName: SITE_NAME,
      siteUrl: FRONTEND_URL,
      year: new Date().getFullYear(),
    };

    // Send user auto-reply
    if (autoReplyEnabled && userTemplate && userTemplate.html && userTemplate.subject) {
      try {
        // Prepare user-specific variables
        const userVariables = {
          name: name || 'there',
          subject: subject || '',
          message: message || '',
          autoReplyMessage: autoReplyMessage,
          ...commonVariables
        };
        
        // Replace variables in HTML and subject
        let userHtml = replaceVariables(userTemplate.html, userVariables);
        let userSubject = replaceVariables(userTemplate.subject, userVariables);
        
        await sendEmail(email, senderEmail, userSubject, userHtml);
      } catch (emailError) {
        // Silent fail
      }
    }

    // Send admin notification
    if (adminTemplate && adminTemplate.html && adminTemplate.subject) {
      try {
        // Prepare admin-specific variables
        const adminVariables = {
          name: name || 'Unknown',
          email: email || '',
          subject: subject || '',
          message: message || '',
          ...commonVariables
        };
        
        // Replace variables in HTML and subject
        let adminHtml = replaceVariables(adminTemplate.html, adminVariables);
        let adminSubject = replaceVariables(adminTemplate.subject, adminVariables);
        
        await sendEmail(adminEmail, senderEmail, adminSubject, adminHtml);
      } catch (emailError) {
        // Silent fail
      }
    }

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully! I will get back to you soon.' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message, 
      success: false 
    });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort('-createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private
export const getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ 
      success: true,
      message: 'Message deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as replied
// @route   PUT /api/messages/:id/replied
// @access  Private
export const markAsReplied = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { replied: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread messages count
// @route   GET /api/messages/unread/count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({ read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};