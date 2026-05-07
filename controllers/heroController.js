import Hero from '../models/Hero.js';
import cloudinary from '../config/cloudinary.js';

export const getHero = async (req, res) => {
  try {
    let hero = await Hero.findOne({ isActive: true });
    if (!hero) {
      hero = await Hero.create({
        title: 'Hi, I\'m',
        subtitle: 'Creative Developer',
        description: 'I build amazing web applications with modern technologies',
        typewriter: {
          enabled: true,
          strings: ['Software Engineer', 'Full Stack Developer', 'React Specialist', 'Problem Solver'],
          typeSpeed: 50,
          backSpeed: 30,
          loop: true,
        },
        ctaButtons: [
          { text: 'View Projects', link: '/projects', variant: 'primary' },
          { text: 'Contact Me', link: '/contact', variant: 'secondary' },
        ],
        image: { type: 'url', value: '' },
      });
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHero = async (req, res) => {
  try {
    const heroData = { ...req.body };
    
    // Handle image upload if file is provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio/hero',
        transformation: [{ width: 600, height: 600, crop: 'limit' }]
      });
      heroData.image = {
        type: 'upload',
        value: result.secure_url,
        publicId: result.public_id,
      };
    }
    
    const hero = await Hero.findOneAndUpdate(
      { isActive: true },
      heroData,
      { new: true, upsert: true }
    );
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};