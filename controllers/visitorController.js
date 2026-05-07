import Visitor from '../models/Visitor.js';

// @desc    Get visitor statistics
// @route   GET /api/visitors/stats
// @access  Private/Admin
export const getVisitorStats = async (req, res) => {
  try {
    // Total visitors
    const totalVisitors = await Visitor.countDocuments();
    
    // Today's visitors
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = await Visitor.countDocuments({
      visitedAt: { $gte: today }
    });
    
    // This week's visitors
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekVisitors = await Visitor.countDocuments({
      visitedAt: { $gte: weekAgo }
    });
    
    // This month's visitors
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthVisitors = await Visitor.countDocuments({
      visitedAt: { $gte: monthAgo }
    });
    
    // Unique visitors (by IP)
    const uniqueVisitors = await Visitor.distinct('ip');
    const uniqueCount = uniqueVisitors.length;
    
    // Top pages
    const topPages = await Visitor.aggregate([
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Recent visitors
    const recentVisitors = await Visitor.find()
      .sort({ visitedAt: -1 })
      .limit(50)
      .select('page userAgent visitedAt');
    
    res.json({
      success: true,
      stats: {
        totalVisitors,
        todayVisitors,
        weekVisitors,
        monthVisitors,
        uniqueVisitors: uniqueCount,
        topPages,
        recentVisitors,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// @desc    Track visitor (called by middleware)
// @route   POST /api/visitors/track
// @access  Public
export const trackVisitor = async (req, res) => {
  try {
    const { ip, userAgent, page, referrer } = req.body;
    
    // Check if same visitor in last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentVisit = await Visitor.findOne({
      ip,
      visitedAt: { $gt: thirtyMinutesAgo }
    });
    
    if (!recentVisit) {
      await Visitor.create({
        ip,
        userAgent,
        page,
        referrer,
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// @desc    Clear all visitor data
// @route   DELETE /api/visitors/clear
// @access  Private/Admin
export const clearVisitors = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin only.',
        success: false 
      });
    }
    
    const result = await Visitor.deleteMany({});
    
    res.json({
      success: true,
      message: `Successfully cleared ${result.deletedCount} visitor records`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};