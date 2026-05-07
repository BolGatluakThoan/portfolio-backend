import EmailTemplate from '../models/EmailTemplate.js';

// Default templates with professional design
const getDefaultTemplates = () => {
  return {
    user_auto_reply: {
      displayName: 'User Auto-Reply',
      subject: 'Thank You for Contacting {{siteName}}! ✨',
      description: 'Sent automatically to users who submit the contact form',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You for Contacting Us</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
            }
            .card {
              background: #ffffff;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
              transition: transform 0.3s ease;
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              padding: 48px 32px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
              animation: shimmer 8s infinite;
            }
            @keyframes shimmer {
              0% { transform: translate(-30%, -30%); }
              100% { transform: translate(30%, 30%); }
            }
            .header h1 {
              color: #ffffff;
              font-size: 32px;
              font-weight: 700;
              margin: 0 0 8px 0;
              letter-spacing: -0.5px;
            }
            .header p {
              color: rgba(255, 255, 255, 0.9);
              font-size: 18px;
              margin: 0;
            }
            .content {
              padding: 40px 32px;
            }
            .greeting {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .message-text {
              color: #4b5563;
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 24px;
            }
            .message-box {
              background: #f3f4f6;
              border-radius: 16px;
              padding: 24px;
              margin: 24px 0;
              border-left: 4px solid #2563eb;
            }
            .message-box strong {
              color: #1f2937;
              display: block;
              margin-bottom: 12px;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .message-box p {
              color: #4b5563;
              margin: 0 0 8px 0;
            }
            .auto-reply {
              background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
              border-radius: 16px;
              padding: 24px;
              margin: 24px 0;
              border-left: 4px solid #10b981;
            }
            .auto-reply strong {
              color: #065f46;
              display: block;
              margin-bottom: 12px;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .auto-reply p {
              color: #065f46;
              margin: 0;
              line-height: 1.5;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              color: #ffffff;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 40px;
              font-weight: 500;
              margin-top: 16px;
              transition: transform 0.2s, box-shadow 0.2s;
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
            }
            .footer {
              background: #f9fafb;
              padding: 24px 32px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer p {
              color: #6b7280;
              font-size: 12px;
              margin: 0 0 8px 0;
            }
            .footer a {
              color: #2563eb;
              text-decoration: none;
            }
            .social-links {
              margin-top: 16px;
            }
            .social-links a {
              color: #6b7280;
              margin: 0 8px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <h1>✨ Thank You!</h1>
                <p>We've received your message</p>
              </div>
              <div class="content">
                <div class="greeting">
                  Hi {{name}} 👋
                </div>
                <p class="message-text">
                  Thank you for reaching out to {{siteName}}. I appreciate you taking the time to get in touch.
                </p>
                <div class="message-box">
                  <strong>📝 Your Message</strong>
                  <p><strong>Subject:</strong> {{subject}}</p>
                  <p><strong>Message:</strong><br/>{{message}}</p>
                </div>
                <div class="auto-reply">
                  <strong>🤖 What Happens Next?</strong>
                  <p>{{autoReplyMessage}}</p>
                </div>
                <div style="text-align: center;">
                  <a href="{{siteUrl}}/blog" class="button">📖 Read My Blog</a>
                </div>
              </div>
              <div class="footer">
                <p>© {{year}} {{siteName}}. All rights reserved.</p>
                <div class="social-links">
                  <a href="#">GitHub</a> • 
                  <a href="#">LinkedIn</a> • 
                  <a href="#">Twitter</a>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    },
    admin_notification: {
      displayName: 'Admin Notification',
      subject: '🔔 New Message from {{name}} - {{subject}}',
      description: 'Sent to admin when someone submits the contact form',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
            }
            .card {
              background: #ffffff;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
              padding: 32px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              font-size: 28px;
              font-weight: 700;
              margin: 0;
            }
            .content {
              padding: 32px;
            }
            .info-card {
              background: #f9fafb;
              border-radius: 16px;
              padding: 20px;
              margin-bottom: 20px;
              border: 1px solid #e5e7eb;
            }
            .label {
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 8px;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .value {
              color: #4b5563;
              word-break: break-word;
              font-size: 16px;
            }
            .message-box {
              background: #fef3c7;
              border-radius: 16px;
              padding: 20px;
              margin: 20px 0;
              border-left: 4px solid #f59e0b;
            }
            .message-box .label {
              color: #92400e;
            }
            .action-buttons {
              display: flex;
              gap: 12px;
              margin: 24px 0;
              flex-wrap: wrap;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              color: #ffffff;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 40px;
              font-weight: 500;
              font-size: 14px;
              transition: transform 0.2s;
            }
            .button-secondary {
              background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
            }
            .button:hover {
              transform: translateY(-2px);
            }
            .footer {
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer p {
              color: #6b7280;
              font-size: 12px;
            }
            .badge {
              display: inline-block;
              background: #fef3c7;
              color: #92400e;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <h1>📬 New Contact Message</h1>
              </div>
              <div class="content">
                <div style="margin-bottom: 20px;">
                  <span class="badge">⚠️ Action Required</span>
                </div>
                <div class="info-card">
                  <div class="label">👤 From</div>
                  <div class="value">{{name}} &lt;{{email}}&gt;</div>
                </div>
                <div class="info-card">
                  <div class="label">📧 Subject</div>
                  <div class="value">{{subject}}</div>
                </div>
                <div class="message-box">
                  <div class="label">💬 Message</div>
                  <div class="value" style="margin-top: 8px;">{{message}}</div>
                </div>
                <div class="action-buttons">
                  <a href="{{siteUrl}}/admin/messages" class="button">📋 View in Dashboard</a>
                  <a href="mailto:{{email}}" class="button button-secondary">✉️ Reply to {{name}}</a>
                </div>
                <div style="background: #eef2ff; border-radius: 12px; padding: 16px; margin-top: 16px;">
                  <p style="color: #1e40af; font-size: 13px; margin: 0;">
                    💡 <strong>Quick Tip:</strong> Respond within 24 hours for the best experience.
                  </p>
                </div>
              </div>
              <div class="footer">
                <p>© {{year}} {{siteName}} | This is an automated notification</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }
  };
};

// @desc    Get all email templates
// @route   GET /api/email-templates
// @access  Private/Admin
export const getTemplates = async (req, res) => {
  try {
    let templates = await EmailTemplate.find();
    
    // If no templates exist, create defaults
    if (templates.length === 0) {
      const defaults = getDefaultTemplates();
      for (const [key, template] of Object.entries(defaults)) {
        await EmailTemplate.create({
          name: key,
          displayName: template.displayName,
          subject: template.subject,
          html: template.html,
          description: template.description,
        });
      }
      templates = await EmailTemplate.find();
    }
    
    res.json({
      success: true,
      templates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// @desc    Get single email template
// @route   GET /api/email-templates/:name
// @access  Private/Admin
export const getTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findOne({ name: req.params.name });
    if (!template) {
      return res.status(404).json({ message: 'Template not found', success: false });
    }
    res.json({
      success: true,
      template,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// @desc    Update email template
// @route   PUT /api/email-templates/:id
// @access  Private/Admin
export const updateTemplate = async (req, res) => {
  try {
    const { subject, html, isActive, displayName, description } = req.body;
    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      { subject, html, isActive, displayName, description },
      { new: true }
    );
    if (!template) {
      return res.status(404).json({ message: 'Template not found', success: false });
    }
    res.json({
      success: true,
      template,
      message: 'Template updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// @desc    Reset template to default
// @route   POST /api/email-templates/:name/reset
// @access  Private/Admin
export const resetTemplate = async (req, res) => {
  try {
    const defaults = getDefaultTemplates();
    const defaultTemplate = defaults[req.params.name];
    
    if (!defaultTemplate) {
      return res.status(404).json({ message: 'Default template not found', success: false });
    }
    
    const template = await EmailTemplate.findOneAndUpdate(
      { name: req.params.name },
      {
        subject: defaultTemplate.subject,
        html: defaultTemplate.html,
        displayName: defaultTemplate.displayName,
        description: defaultTemplate.description,
      },
      { new: true, upsert: true }
    );
    
    res.json({
      success: true,
      template,
      message: 'Template reset to default',
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// @desc    Preview email template
// @route   POST /api/email-templates/preview
// @access  Private/Admin
export const previewTemplate = async (req, res) => {
  try {
    const { html, data } = req.body;
    
    // Replace template variables
    let previewHtml = html;
    const variables = {
      siteName: process.env.SITE_NAME || 'Bol Portfolio',
      siteUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
      year: new Date().getFullYear(),
      name: data?.name || 'John Doe',
      email: data?.email || 'john@example.com',
      subject: data?.subject || 'Test Subject',
      message: data?.message || 'This is a test message to preview the email template.',
      autoReplyMessage: data?.autoReplyMessage || 'Thank you for reaching out! I will get back to you within 24-48 hours.',
    };
    
    for (const [key, value] of Object.entries(variables)) {
      previewHtml = previewHtml.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    res.json({
      success: true,
      html: previewHtml,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};