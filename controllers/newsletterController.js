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
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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

    // Check if already subscribed
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

    // Create new subscriber
    subscriber = await Subscriber.create({
      email,
      name: name || '',
    });

    // Send welcome email
    const welcomeHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Main Card with Border -->
        <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 35px -10px rgba(0,0,0,0.15); border: 2px solid #e2e8f0;">
          
          <!-- Header Section -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 12px;">🚀✨🌟</div>
            <h1 style="color: #ffffff; font-size: 34px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">${SITE_NAME}</h1>
            <p style="color: rgba(255,255,255,0.95); margin-top: 10px; font-size: 16px;">Where ideas come to life</p>
          </div>
          
          <!-- Content Section -->
          <div style="padding: 40px 35px; background: #ffffff;">
            
            <!-- Welcome Greeting Card -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 20px; padding: 25px; text-align: center; margin-bottom: 30px; border: 2px solid #fbbf24;">
              <div style="font-size: 52px; margin-bottom: 10px;">👋🌟🎉</div>
              <h2 style="color: #92400e; font-size: 26px; font-weight: 700; margin: 0 0 5px 0;">Welcome, ${name || 'Developer'}!</h2>
              <p style="color: #b45309; font-size: 14px; margin: 0;">You're now part of our amazing community</p>
            </div>
            
            <!-- Main Message -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #1f2937; font-size: 18px; font-weight: 600; margin-bottom: 15px;">🎯 Thank you for subscribing!</p>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">You'll now receive exclusive updates about:</p>
            </div>
            
            <!-- Features Grid -->
            <div style="display: table; width: 100%; margin: 25px 0; border-collapse: separate; border-spacing: 10px;">
              <div style="display: table-row;">
                <div style="display: table-cell; background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border-radius: 16px; padding: 20px; text-align: center; width: 33%; border: 1px solid #a5b4fc;">
                  <div style="font-size: 36px; margin-bottom: 10px;">✨📝</div>
                  <div style="font-weight: 700; color: #3730a3; margin-bottom: 5px;">New Tutorials</div>
                  <div style="font-size: 12px; color: #4338ca;">Weekly insights</div>
                </div>
                <div style="display: table-cell; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 16px; padding: 20px; text-align: center; width: 33%; border: 1px solid #6ee7b7;">
                  <div style="font-size: 36px; margin-bottom: 10px;">🚀💡</div>
                  <div style="font-weight: 700; color: #065f46; margin-bottom: 5px;">Project Updates</div>
                  <div style="font-size: 12px; color: #047857;">Real-world code</div>
                </div>
                <div style="display: table-cell; background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border-radius: 16px; padding: 20px; text-align: center; width: 33%; border: 1px solid #f9a8d4;">
                  <div style="font-size: 36px; margin-bottom: 10px;">💼🎯</div>
                  <div style="font-weight: 700; color: #9d174d; margin-bottom: 5px;">Career Tips</div>
                  <div style="font-size: 12px; color: #be185d;">Level up your skills</div>
                </div>
              </div>
            </div>
            
            <!-- Special Welcome Note -->
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 16px; padding: 20px; margin: 25px 0; text-align: center; border-left: 5px solid #10b981;">
              <p style="color: #065f46; font-size: 16px; font-weight: 600; margin: 0;">🎁 Excited to have you on this journey! 🎁</p>
              <p style="color: #047857; font-size: 13px; margin-top: 8px;">Each newsletter is crafted with care just for you</p>
            </div>
            
            <!-- Divider -->
            <div style="height: 2px; background: linear-gradient(90deg, #667eea, #764ba2, #667eea); margin: 30px 0 25px 0;"></div>
            
            <!-- Closing Message -->
            <div style="text-align: center;">
              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                💙 I'm truly excited to have you here. Get ready for amazing content, insights, and inspiration delivered straight to your inbox!
              </p>
              
              <!-- CTA Button -->
              <a href="${FRONTEND_URL}/blog" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 50px; font-weight: 600; font-size: 16px; margin-top: 10px; box-shadow: 0 10px 20px -5px rgba(102,126,234,0.4);">
                📖 Explore Blog Posts →
              </a>
            </div>
          </div>
          
          <!-- Footer Section -->
          <div style="background: #f9fafb; padding: 30px 35px; text-align: center; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">💙 Thanks for being part of this journey</p>
            <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
              <a href="${FRONTEND_URL}/unsubscribe?email=${email}" style="color: #9ca3af; text-decoration: none; font-size: 12px;">Unsubscribe anytime</a>
            </div>
          </div>
          
        </div>
      </div>
    `;

    await sendEmail(email, `🎉 Welcome to ${SITE_NAME}, ${name || 'Developer'}! 🚀`, welcomeHtml);

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

    if (subscriber.status === 'unsubscribed') {
      return res.status(404).json({ 
        message: 'This email is already unsubscribed or not found in our system.',
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

    if (!subject || !content) {
      return res.status(400).json({ 
        message: 'Subject and content are required',
        success: false 
      });
    }

    const subscribers = await Subscriber.find({ status: 'active' });
    
    if (subscribers.length === 0) {
      return res.status(400).json({ 
        message: 'No active subscribers',
        success: false 
      });
    }

    // Send emails to all subscribers
    const emailResults = [];
    for (const subscriber of subscribers) {
      const emailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; border-radius: 16px;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #2563eb;">
            <h1 style="color: #2563eb; margin: 0;">🚀 ${SITE_NAME}</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #1f2937;">${subject}</h2>
            <div style="color: #4b5563; font-size: 16px; line-height: 1.5;">${content}</div>
            ${blogUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${blogUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                  📖 Read the Full Blog Post →
                </a>
              </div>
            ` : ''}
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px;">
              <a href="${FRONTEND_URL}/unsubscribe?email=${subscriber.email}" style="color: #9ca3af;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `;

      const sent = await sendEmail(subscriber.email, subject, emailHtml);
      emailResults.push({ email: subscriber.email, sent });
      
      // Add small delay to avoid rate limiting
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