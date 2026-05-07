import About from '../models/About.js';

export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne({ isActive: true });
    if (!about) {
      about = await About.create({
        bio: "I'm a passionate developer with experience in building web applications. I specialize in modern technologies and love creating beautiful, responsive, and user-friendly websites.",
        skillsSummary: "React, Node.js, MongoDB, Express, Tailwind CSS",
        image: { type: 'url', value: '' },
        experiences: [],
        education: [],
      });
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const about = await About.findOneAndUpdate(
      { isActive: true },
      req.body,
      { new: true, upsert: true }
    );
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};