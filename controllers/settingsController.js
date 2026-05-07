import Settings from '../models/Settings.js';

// Public - no authentication needed
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        siteTitle: 'My Portfolio',
        siteDescription: 'Personal portfolio website',
        theme: 'light',
        logo: { type: 'text', value: 'Portfolio' },
        autoReplyEnabled: true,
        autoReplyMessage: 'Thank you for reaching out! I will get back to you soon.',
        adminShortcut: {
          enabled: true,
          key: 'a',
          presses: 3,
          timeout: 1000,
        },
      });
    }
    // Return only public settings (exclude sensitive data if any)
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Protected - requires authentication
export const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};