import Visitor from '../models/Visitor.js';

export const trackVisitor = async (req, res, next) => {
  // Skip tracking for admin routes
  if (req.path.startsWith('/admin') || req.path.startsWith('/api/auth') || req.path.startsWith('/api/visitors')) {
    return next();
  }
  
  try {
    // Get visitor IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Get user agent
    const userAgent = req.headers['user-agent'];
    
    // Don't track bots
    const botPatterns = /bot|crawler|spider|scraper|headless/i;
    if (botPatterns.test(userAgent)) {
      return next();
    }
    
    // Check if same visitor in last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentVisit = await Visitor.findOne({
      ip,
      visitedAt: { $gt: thirtyMinutesAgo }
    });
    
    // Only track if no recent visit from same IP
    if (!recentVisit) {
      await Visitor.create({
        ip,
        userAgent,
        page: req.originalUrl,
        referrer: req.headers.referer,
      });
    }
    
    next();
  } catch (error) {
    console.error('Visitor tracking error:', error);
    next();
  }
};