import EmailTemplate from '../models/EmailTemplate.js';

// Default templates with professional design
const getDefaultTemplates = () => {
  return {
    user_auto_reply: {
      displayName: 'User Auto-Reply',
      subject: 'Thank You for Contacting {{siteName}}! ✨',
      description: 'Sent automatically to users who submit the contact form',
      html: `... unchanged ...`
    },
    admin_notification: {
      displayName: 'Admin Notification',
      subject: '🔔 New Message from {{name}} - {{subject}}',
      description: 'Sent to admin when someone submits the contact form',
      html: `... unchanged ...`
    }
  };
};

// ================= FIX: MISSING EXPORTS =================

// @desc    Get all email templates
export const getTemplates = async (req, res) => {
  try {
    let templates = await EmailTemplate.find();

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

// ✅ FIXED: THIS WAS MISSING (caused your crash)
export const getTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findOne({ name: req.params.name });

    if (!template) {
      return res.status(404).json({
        message: 'Template not found',
        success: false,
      });
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
export const updateTemplate = async (req, res) => {
  try {
    const { subject, html, isActive, displayName, description } = req.body;

    const template = await EmailTemplate.findByIdAndUpdate(
      req.params.id,
      { subject, html, isActive, displayName, description },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({
        message: 'Template not found',
        success: false,
      });
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
export const resetTemplate = async (req, res) => {
  try {
    const defaults = getDefaultTemplates();
    const defaultTemplate = defaults[req.params.name];

    if (!defaultTemplate) {
      return res.status(404).json({
        message: 'Default template not found',
        success: false,
      });
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
      message: data?.message || 'Test message',
      autoReplyMessage:
        data?.autoReplyMessage ||
        'Thank you for reaching out! I will get back to you within 24-48 hours.',
    };

    for (const [key, value] of Object.entries(variables)) {
      previewHtml = previewHtml.replace(
        new RegExp(`{{${key}}}`, 'g'),
        value
      );
    }

    res.json({
      success: true,
      html: previewHtml,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};