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
            /* unchanged styles */
          </style>
        </head>
        <body>
          <!-- unchanged body -->
        </body>
        </html>
      `
    }
  };
};

// @desc    Preview email template
// @route   POST /api/email-templates/preview
// @access  Private/Admin
export const previewTemplate = async (req, res) => {
  try {
    const { html, data } = req.body;

    let previewHtml = html;

    const variables = {
      siteName: process.env.SITE_NAME || 'Bol Portfolio',
      siteUrl: process.env.CLIENT_URL || 'http://localhost:5173',
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