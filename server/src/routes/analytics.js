import express from 'express';
import Idea from '../models/Idea.js';
import Field from '../models/Field.js';
import Task from '../models/Task.js';
import ChatMessage from '../models/ChatMessage.js';
import User from '../models/User.js';
import { logger } from '../config/logger.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// @desc    Get user analytics overview
// @route   GET /api/analytics/overview
// @access  Private
router.get('/overview', catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Get basic counts
  const totalIdeas = await Idea.countDocuments({ owner: userId });
  const activeIdeas = await Idea.countDocuments({ owner: userId, status: 'active' });
  const completedIdeas = await Idea.countDocuments({ owner: userId, status: 'completed' });

  // Get progress statistics
  const progressStats = await Idea.aggregate([
    { $match: { owner: userId, status: { $ne: 'archived' } } },
    {
      $group: {
        _id: null,
        averageProgress: { $avg: '$progress' },
        totalProgress: { $sum: '$progress' },
        maxProgress: { $max: '$progress' },
        minProgress: { $min: '$progress' },
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
        ideasCreated: { $sum: 1 },
        averageProgress: { $avg: '$progress' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 },
  ]);

  // Get idea type distribution
  const typeDistribution = await Idea.aggregate([
    { $match: { owner: userId } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        averageProgress: { $avg: '$progress' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Get completion rate
  const completionRate = totalIdeas > 0 ? Math.round((completedIdeas / totalIdeas) * 100) : 0;

  res.json({
    success: true,
    data: {
      overview: {
        totalIdeas,
        activeIdeas,
        completedIdeas,
        completionRate,
        averageProgress: progressStats[0]?.averageProgress ? Math.round(progressStats[0].averageProgress) : 0,
      },
      monthlyActivity,
      typeDistribution,
      progressStats: progressStats[0] || {
        averageProgress: 0,
        totalProgress: 0,
        maxProgress: 0,
        minProgress: 0,
      },
    },
  });
}));

// @desc    Get idea analytics
// @route   GET /api/analytics/idea/:ideaId
// @access  Private
router.get('/idea/:ideaId', validateObjectId('ideaId'), catchAsync(async (req, res) => {
  const idea = await Idea.findById(req.params.ideaId);

  if (!idea) {
    return res.status(404).json({
      success: false,
      message: 'Idea not found',
    });
  }

  // Check if user has access
  if (!idea.hasAccess(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  // Get field statistics
  const fieldStats = await Field.getStatistics(idea._id);

  // Get task statistics
  const taskStats = await Task.getStatistics(idea._id);

  // Get completion timeline
  const completionTimeline = await Field.aggregate([
    { $match: { idea: idea._id, isCompleted: true } },
    {
      $group: {
        _id: {
          year: { $year: '$completionDate' },
          month: { $month: '$completionDate' },
          day: { $dayOfMonth: '$completionDate' },
        },
        completedFields: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  // Get task completion by priority
  const taskCompletionByPriority = await Task.aggregate([
    { $match: { idea: idea._id } },
    {
      $group: {
        _id: '$priority',
        totalTasks: { $sum: 1 },
        completedTasks: { $sum: { $cond: ['$completed', 1, 0] } },
        averageWeight: { $avg: '$weight' },
      },
    },
  ]);

  // Get time tracking data
  const timeTrackingData = await Task.aggregate([
    { $match: { idea: idea._id } },
    {
      $group: {
        _id: null,
        totalEstimatedHours: { $sum: '$timeTracking.estimatedHours' },
        totalActualHours: { $sum: '$timeTracking.actualHours' },
        averageEstimatedHours: { $avg: '$timeTracking.estimatedHours' },
        averageActualHours: { $avg: '$timeTracking.actualHours' },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      idea: {
        id: idea._id,
        title: idea.title,
        type: idea.type,
        status: idea.status,
        progress: idea.progress,
        createdAt: idea.createdAt,
        updatedAt: idea.updatedAt,
      },
      fieldStats: fieldStats[0] || {
        totalFields: 0,
        completedFields: 0,
        averageProgress: 0,
        totalTasks: 0,
        completedTasks: 0,
      },
      taskStats: taskStats[0] || {
        totalTasks: 0,
        completedTasks: 0,
        averageWeight: 0,
        totalEstimatedHours: 0,
        totalActualHours: 0,
        overdueTasks: 0,
      },
      completionTimeline,
      taskCompletionByPriority,
      timeTrackingData: timeTrackingData[0] || {
        totalEstimatedHours: 0,
        totalActualHours: 0,
        averageEstimatedHours: 0,
        averageActualHours: 0,
      },
      analytics: idea.analytics,
    },
  });
}));

// @desc    Get productivity analytics
// @route   GET /api/analytics/productivity
// @access  Private
router.get('/productivity', catchAsync(async (req, res) => {
  const userId = req.user._id;
  const timeRange = parseInt(req.query.days) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeRange);

  // Get task completion over time
  const taskCompletionOverTime = await Task.aggregate([
    {
      $match: {
        idea: { $in: await Idea.find({ owner: userId }).distinct('_id') },
        completedAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$completedAt' },
          month: { $month: '$completedAt' },
          day: { $dayOfMonth: '$completedAt' },
        },
        completedTasks: { $sum: 1 },
        totalWeight: { $sum: '$weight' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  // Get field completion over time
  const fieldCompletionOverTime = await Field.aggregate([
    {
      $match: {
        idea: { $in: await Idea.find({ owner: userId }).distinct('_id') },
        completionDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$completionDate' },
          month: { $month: '$completionDate' },
          day: { $dayOfMonth: '$completionDate' },
        },
        completedFields: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  // Get most productive hours
  const productiveHours = await Task.aggregate([
    {
      $match: {
        idea: { $in: await Idea.find({ owner: userId }).distinct('_id') },
        'timeTracking.timeEntries': { $exists: true, $ne: [] },
      },
    },
    { $unwind: '$timeTracking.timeEntries' },
    {
      $group: {
        _id: { $hour: '$timeTracking.timeEntries.startTime' },
        totalMinutes: { $sum: '$timeTracking.timeEntries.duration' },
        sessionCount: { $sum: 1 },
      },
    },
    { $sort: { totalMinutes: -1 } },
    { $limit: 10 },
  ]);

  // Get average task completion time
  const averageCompletionTime = await Task.aggregate([
    {
      $match: {
        idea: { $in: await Idea.find({ owner: userId }).distinct('_id') },
        completed: true,
        'analytics.completionTime': { $exists: true },
      },
    },
    {
      $group: {
        _id: null,
        averageCompletionTime: { $avg: '$analytics.completionTime' },
        medianCompletionTime: { $avg: '$analytics.completionTime' },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      timeRange,
      taskCompletionOverTime,
      fieldCompletionOverTime,
      productiveHours,
      averageCompletionTime: averageCompletionTime[0] || {
        averageCompletionTime: 0,
        medianCompletionTime: 0,
      },
    },
  });
}));

// @desc    Get AI usage analytics
// @route   GET /api/analytics/ai-usage
// @access  Private
router.get('/ai-usage', catchAsync(async (req, res) => {
  const userId = req.user._id;
  const timeRange = parseInt(req.query.days) || 30;

  // Get AI usage statistics
  const aiStats = await ChatMessage.getAIUsageStats(userId, timeRange);

  // Get AI usage over time
  const aiUsageOverTime = await ChatMessage.aggregate([
    {
      $match: {
        user: userId,
        type: 'ai',
        createdAt: { $gte: new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        messages: { $sum: 1 },
        totalTokens: { $sum: '$aiResponse.tokens.total' },
        averageResponseTime: { $avg: '$aiResponse.processingTime' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  // Get most common AI requests
  const commonRequests = await ChatMessage.aggregate([
    {
      $match: {
        user: userId,
        type: 'user',
        createdAt: { $gte: new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: '$content',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  res.json({
    success: true,
    data: {
      timeRange,
      stats: aiStats[0] || {
        totalMessages: 0,
        totalTokens: 0,
        averageResponseTime: 0,
        totalProcessingTime: 0,
      },
      usageOverTime: aiUsageOverTime,
      commonRequests,
    },
  });
}));

// @desc    Get personal development analytics (for YOU project)
// @route   GET /api/analytics/personal-development
// @access  Private
router.get('/personal-development', catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Get personal development idea
  const personalDevIdea = await Idea.findOne({
    owner: userId,
    type: 'personal-development',
  });

  if (!personalDevIdea) {
    return res.status(404).json({
      success: false,
      message: 'Personal development project not found',
    });
  }

  // Get current personal metrics
  const user = await User.findById(userId);
  const currentMetrics = user.personalMetrics;

  // Get metrics over time (this would require storing historical data)
  // For now, we'll return current metrics
  const metricsHistory = [{
    date: new Date(),
    metrics: currentMetrics,
  }];

  // Get personal development tasks
  const personalTasks = await Task.findByIdea(personalDevIdea._id);
  const taskStats = await Task.getStatistics(personalDevIdea._id);

  // Calculate overall personal development score
  const metricsArray = Object.values(currentMetrics).filter(value => typeof value === 'number');
  const overallScore = metricsArray.length > 0 
    ? Math.round(metricsArray.reduce((sum, value) => sum + value, 0) / metricsArray.length)
    : 0;

  res.json({
    success: true,
    data: {
      currentMetrics,
      metricsHistory,
      overallScore,
      taskStats: taskStats[0] || {
        totalTasks: 0,
        completedTasks: 0,
        averageWeight: 0,
        totalEstimatedHours: 0,
        totalActualHours: 0,
        overdueTasks: 0,
      },
      personalTasks: personalTasks.slice(0, 10), // Recent tasks
    },
  });
}));

export default router;