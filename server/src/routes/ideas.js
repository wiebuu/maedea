import express from 'express';
import Idea from '../models/Idea.js';
import Field from '../models/Field.js';
import Task from '../models/Task.js';
import { logger } from '../config/logger.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { 
  validateIdeaCreation, 
  validateIdeaUpdate, 
  validateObjectId,
  validatePagination,
  validateSearch 
} from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all ideas for user
// @route   GET /api/ideas
// @access  Private
router.get('/', validatePagination, validateSearch, catchAsync(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = {
    $or: [
      { owner: userId },
      { 'collaborators.user': userId }
    ],
    'metadata.isDeleted': { $ne: true }
  };

  // Add filters
  if (req.query.type) {
    query.type = req.query.type;
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.q) {
    query.$or = [
      { title: { $regex: req.query.q, $options: 'i' } },
      { description: { $regex: req.query.q, $options: 'i' } },
      { tags: { $in: [new RegExp(req.query.q, 'i')] } }
    ];
  }

  // Sort options
  let sort = { updatedAt: -1 };
  if (req.query.sort) {
    const sortField = req.query.sort.startsWith('-') 
      ? req.query.sort.substring(1) 
      : req.query.sort;
    const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
    sort = { [sortField]: sortOrder };
  }

  const ideas = await Idea.find(query)
    .populate('owner', 'name email avatar')
    .populate('collaborators.user', 'name email avatar')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Idea.countDocuments(query);

  res.json({
    success: true,
    data: {
      ideas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
}));

// @desc    Get single idea
// @route   GET /api/ideas/:ideaId
// @access  Private
router.get('/:ideaId', validateObjectId('ideaId'), catchAsync(async (req, res) => {
  const idea = await Idea.findById(req.params.ideaId)
    .populate('owner', 'name email avatar')
    .populate('collaborators.user', 'name email avatar');

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

  // Update analytics
  idea.analytics.views += 1;
  idea.analytics.lastViewed = new Date();
  await idea.save();

  res.json({
    success: true,
    data: {
      idea,
    },
  });
}));

// @desc    Create new idea
// @route   POST /api/ideas
// @access  Private
router.post('/', validateIdeaCreation, catchAsync(async (req, res) => {
  const ideaData = {
    ...req.body,
    owner: req.user._id,
  };

  const idea = await Idea.create(ideaData);

  // Generate initial fields based on idea type
  const fields = generateInitialFields(idea._id, idea.type);
  await Field.insertMany(fields);

  logger.info(`New idea created: ${idea.title} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Idea created successfully',
    data: {
      idea,
    },
  });
}));

// @desc    Update idea
// @route   PUT /api/ideas/:ideaId
// @access  Private
router.put('/:ideaId', validateObjectId('ideaId'), validateIdeaUpdate, catchAsync(async (req, res) => {
  const idea = await Idea.findById(req.params.ideaId);

  if (!idea) {
    return res.status(404).json({
      success: false,
      message: 'Idea not found',
    });
  }

  // Check if user can edit
  if (!idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const allowedUpdates = [
    'title', 'description', 'tags', 'status', 'priority', 'progress',
    'visibility', 'metadata', 'timeline'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const updatedIdea = await Idea.findByIdAndUpdate(
    req.params.ideaId,
    updates,
    { new: true, runValidators: true }
  ).populate('owner', 'name email avatar')
   .populate('collaborators.user', 'name email avatar');

  logger.info(`Idea updated: ${updatedIdea.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Idea updated successfully',
    data: {
      idea: updatedIdea,
    },
  });
}));

// @desc    Delete idea
// @route   DELETE /api/ideas/:ideaId
// @access  Private
router.delete('/:ideaId', validateObjectId('ideaId'), catchAsync(async (req, res) => {
  const idea = await Idea.findById(req.params.ideaId);

  if (!idea) {
    return res.status(404).json({
      success: false,
      message: 'Idea not found',
    });
  }

  // Check if user owns the idea or is admin
  if (idea.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  // Delete related fields and tasks
  await Field.deleteMany({ idea: idea._id });
  await Task.deleteMany({ idea: idea._id });

  // Delete the idea
  await Idea.findByIdAndDelete(req.params.ideaId);

  logger.info(`Idea deleted: ${idea.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Idea deleted successfully',
  });
}));

// @desc    Duplicate idea
// @route   POST /api/ideas/:ideaId/duplicate
// @access  Private
router.post('/:ideaId/duplicate', validateObjectId('ideaId'), catchAsync(async (req, res) => {
  const originalIdea = await Idea.findById(req.params.ideaId);

  if (!originalIdea) {
    return res.status(404).json({
      success: false,
      message: 'Idea not found',
    });
  }

  // Check if user has access
  if (!originalIdea.hasAccess(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  // Create duplicate idea
  const duplicateData = {
    ...originalIdea.toObject(),
    _id: undefined,
    title: `${originalIdea.title} (Copy)`,
    owner: req.user._id,
    collaborators: [],
    status: 'draft',
    progress: 0,
    analytics: {
      views: 0,
      lastViewed: null,
      timeSpent: 0,
      completionRate: 0,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const duplicatedIdea = await Idea.create(duplicateData);

  // Duplicate fields and tasks
  const originalFields = await Field.findByIdea(originalIdea._id);
  const duplicatedFields = originalFields.map(field => ({
    ...field.toObject(),
    _id: undefined,
    idea: duplicatedIdea._id,
    isCompleted: false,
    completionDate: undefined,
    progress: {
      completedTasks: 0,
      totalTasks: field.progress.totalTasks,
      percentage: 0,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await Field.insertMany(duplicatedFields);

  // Duplicate tasks
  const originalTasks = await Task.findByIdea(originalIdea._id);
  const duplicatedTasks = originalTasks.map(task => ({
    ...task.toObject(),
    _id: undefined,
    idea: duplicatedIdea._id,
    field: duplicatedFields.find(f => f.fieldId === task.field.fieldId)?._id,
    completed: false,
    completedAt: undefined,
    completedBy: undefined,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await Task.insertMany(duplicatedTasks);

  logger.info(`Idea duplicated: ${originalIdea.title} -> ${duplicatedIdea.title} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Idea duplicated successfully',
    data: {
      idea: duplicatedIdea,
    },
  });
}));

// @desc    Share idea
// @route   POST /api/ideas/:ideaId/share
// @access  Private
router.post('/:ideaId/share', validateObjectId('ideaId'), catchAsync(async (req, res) => {
  const { visibility } = req.body;

  if (!visibility || !['shared', 'public'].includes(visibility)) {
    return res.status(400).json({
      success: false,
      message: 'Visibility must be either "shared" or "public"',
    });
  }

  const idea = await Idea.findById(req.params.ideaId);

  if (!idea) {
    return res.status(404).json({
      success: false,
      message: 'Idea not found',
    });
  }

  // Check if user owns the idea
  if (idea.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  idea.visibility = visibility;
  await idea.save();

  const shareUrl = visibility === 'public' 
    ? `${process.env.CORS_ORIGIN}/shared/${idea.shareToken}`
    : `${process.env.CORS_ORIGIN}/shared/${idea.shareToken}`;

  logger.info(`Idea shared: ${idea.title} with ${visibility} visibility by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Idea shared successfully',
    data: {
      shareUrl,
      visibility: idea.visibility,
    },
  });
}));

// @desc    Get shared idea (public access)
// @route   GET /api/ideas/shared/:shareToken
// @access  Public
router.get('/shared/:shareToken', catchAsync(async (req, res) => {
  const idea = await Idea.findOne({ shareToken: req.params.shareToken })
    .populate('owner', 'name avatar');

  if (!idea) {
    return res.status(404).json({
      success: false,
      message: 'Shared idea not found',
    });
  }

  // Update view count
  idea.analytics.views += 1;
  idea.analytics.lastViewed = new Date();
  await idea.save();

  res.json({
    success: true,
    data: {
      idea,
    },
  });
}));

// @desc    Get idea statistics
// @route   GET /api/ideas/:ideaId/statistics
// @access  Private
router.get('/:ideaId/statistics', validateObjectId('ideaId'), catchAsync(async (req, res) => {
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

  res.json({
    success: true,
    data: {
      idea: {
        id: idea._id,
        title: idea.title,
        progress: idea.progress,
        status: idea.status,
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
    },
  });
}));

// Helper function to generate initial fields based on idea type
function generateInitialFields(ideaId, ideaType) {
  // This would typically use the same logic as the client-side generateMockFields
  // For now, we'll create a basic set of fields
  
  const baseFields = [
    {
      idea: ideaId,
      fieldId: 'problem-solution',
      title: 'Problem & Solution Fit',
      description: 'Define the core problem and validate your solution approach',
      aiGenerated: 'Your idea addresses a clear market need. Focus on validating the problem with potential users and refining your solution based on feedback.',
      order: 1,
    },
    {
      idea: ideaId,
      fieldId: 'market-competition',
      title: 'Market & Competition',
      description: 'Analyze your target market and competitive landscape',
      aiGenerated: 'The market shows strong growth potential. Key competitors exist but there\'s room for differentiation through your unique approach.',
      order: 2,
    },
    {
      idea: ideaId,
      fieldId: 'product-strategy',
      title: 'Product Strategy',
      description: 'Define your MVP and core product features',
      aiGenerated: 'Start with a focused MVP that addresses the core problem. Plan for iterative development based on user feedback.',
      order: 3,
    },
  ];

  // Add type-specific fields
  if (ideaType === 'startup-idea' || ideaType === 'existing-startup') {
    baseFields.push({
      idea: ideaId,
      fieldId: 'business-monetization',
      title: 'Business & Monetization',
      description: 'Define your business model and revenue strategy',
      aiGenerated: 'Consider multiple revenue streams. Start with one primary model and expand as you grow.',
      order: 4,
    });
  }

  return baseFields;
}

export default router;