import express from 'express';
import User from '../models/User.js';
import Idea from '../models/Idea.js';
import { logger } from '../config/logger.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { validateUserUpdate, validatePersonalMetrics, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const userResponse = user.getPublicProfile();

  res.json({
    success: true,
    data: {
      user: userResponse,
    },
  });
}));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', validateUserUpdate, catchAsync(async (req, res) => {
  const allowedUpdates = ['name', 'avatar', 'preferences'];
  const updates = {};

  // Filter allowed updates
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const userResponse = user.getPublicProfile();

  logger.info(`User profile updated: ${user.email}`);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: userResponse,
    },
  });
}));

// @desc    Update personal metrics (for YOU project)
// @route   PUT /api/users/personal-metrics
// @access  Private
router.put('/personal-metrics', validatePersonalMetrics, catchAsync(async (req, res) => {
  const allowedMetrics = [
    'skills', 'knowledge', 'experience', 'financialStability', 'health', 'discipline',
    'network', 'mentors', 'locationAdvantage', 'marketAccess', 'resources', 'location',
    'mindset', 'focus', 'resilience', 'riskTolerance', 'emotionalIntelligence',
    'readingHabits', 'creativity'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedMetrics.includes(key)) {
      updates[`personalMetrics.${key}`] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  logger.info(`Personal metrics updated for user: ${user.email}`);

  res.json({
    success: true,
    message: 'Personal metrics updated successfully',
    data: {
      personalMetrics: user.personalMetrics,
    },
  });
}));

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
router.get('/dashboard', catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Get user's ideas with basic info
  const ideas = await Idea.findByUser(userId, { status: { $ne: 'archived' } })
    .select('title type status progress createdAt updatedAt tags')
    .sort({ updatedAt: -1 })
    .limit(10);

  // Get statistics
  const totalIdeas = await Idea.countDocuments({ owner: userId });
  const activeIdeas = await Idea.countDocuments({ owner: userId, status: 'active' });
  const completedIdeas = await Idea.countDocuments({ owner: userId, status: 'completed' });

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentActivity = await Idea.find({
    owner: userId,
    updatedAt: { $gte: sevenDaysAgo },
  })
    .select('title type updatedAt')
    .sort({ updatedAt: -1 })
    .limit(5);

  // Calculate overall progress
  const progressData = await Idea.aggregate([
    { $match: { owner: userId, status: { $ne: 'archived' } } },
    {
      $group: {
        _id: null,
        averageProgress: { $avg: '$progress' },
        totalIdeas: { $sum: 1 },
      },
    },
  ]);

  const overallProgress = progressData.length > 0 ? Math.round(progressData[0].averageProgress) : 0;

  res.json({
    success: true,
    data: {
      user: req.user.getPublicProfile(),
      ideas,
      statistics: {
        totalIdeas,
        activeIdeas,
        completedIdeas,
        overallProgress,
      },
      recentActivity,
    },
  });
}));

// @desc    Get user statistics
// @route   GET /api/users/statistics
// @access  Private
router.get('/statistics', catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Get idea statistics
  const ideaStats = await Idea.aggregate([
    { $match: { owner: userId } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        averageProgress: { $avg: '$progress' },
      },
    },
  ]);

  // Get monthly activity
  const monthlyActivity = await Idea.aggregate([
    { $match: { owner: userId } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  // Get completion rate
  const completionStats = await Idea.aggregate([
    { $match: { owner: userId } },
    {
      $group: {
        _id: null,
        totalIdeas: { $sum: 1 },
        completedIdeas: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        averageProgress: { $avg: '$progress' },
      },
    },
  ]);

  const completionRate = completionStats.length > 0 && completionStats[0].totalIdeas > 0
    ? Math.round((completionStats[0].completedIdeas / completionStats[0].totalIdeas) * 100)
    : 0;

  res.json({
    success: true,
    data: {
      ideaStats,
      monthlyActivity,
      completionRate,
      averageProgress: completionStats.length > 0 ? Math.round(completionStats[0].averageProgress) : 0,
    },
  });
}));

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', catchAsync(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required to delete account',
    });
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');
  
  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid password',
    });
  }

  // Delete user's ideas
  await Idea.deleteMany({ owner: req.user._id });

  // Delete user account
  await User.findByIdAndDelete(req.user._id);

  logger.info(`User account deleted: ${user.email}`);

  res.json({
    success: true,
    message: 'Account deleted successfully',
  });
}));

// @desc    Get user by ID (for admin or public profiles)
// @route   GET /api/users/:userId
// @access  Private
router.get('/:userId', validateObjectId('userId'), catchAsync(async (req, res) => {
  const { userId } = req.params;

  // Check if user is requesting their own profile or is admin
  if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const user = await User.findById(userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const userResponse = user.getPublicProfile();

  res.json({
    success: true,
    data: {
      user: userResponse,
    },
  });
}));

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', catchAsync(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
}));

export default router;