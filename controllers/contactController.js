import ContactInfo from '../models/ContactInfo.js';

export const getContactInfo = async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne({ isActive: true });
    if (!contactInfo) {
      contactInfo = await ContactInfo.create({
        email: 'contact@example.com',
        phone: '+1234567890',
        address: 'Your Address Here',
        socials: {
          github: 'https://github.com/username',
          linkedin: 'https://linkedin.com/in/username',
          twitter: 'https://twitter.com/username',
        },
      });
    }
    res.json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOneAndUpdate(
      { isActive: true },
      req.body,
      { new: true, upsert: true }
    );
    res.json(contactInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};