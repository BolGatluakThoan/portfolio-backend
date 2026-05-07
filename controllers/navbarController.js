import Navbar from '../models/Navbar.js';

export const getNavbar = async (req, res) => {
  try {
    let navbar = await Navbar.findOne({ isActive: true });
    if (!navbar) {
      navbar = await Navbar.create({
        logo: { type: 'text', value: 'Portfolio' },
        menu: [
          { name: 'Home', path: '/' },
          { name: 'Projects', path: '/projects' },
          { name: 'Blog', path: '/blog' },
          { name: 'Contact', path: '/contact' },
        ],
      });
    }
    res.json(navbar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNavbar = async (req, res) => {
  try {
    const navbar = await Navbar.findOneAndUpdate(
      { isActive: true },
      req.body,
      { new: true, upsert: true }
    );
    res.json(navbar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};