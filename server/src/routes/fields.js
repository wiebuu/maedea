import express from 'express';
import Field from '../models/Field.js';
import Task from '../models/Task.js';
import Idea from '../models/Idea.js';
import { logger } from '../config/logger.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { 
  validateFieldCreation, 
  validateFieldUpdate, 
  validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all fields for an idea
// @route   GET /api/fields/idea/:ideaId
// @access  Private
router.get('/idea/:ideaId', validateObjectId('ideaId'), catchAsync(async (req, res) => {
  // Check if user has access to the idea
  const idea = await Idea.findById(req.params.ideaId);
  if (!idea) {
    return res.status(404).json({
      success: false,
      message: 'Idea not found',
    });
  }

  if (!idea.hasAccess(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const fields = await Field.findByIdea(req.params.ideaId);

  res.json({
    success: true,
    data: {
      fields,
    },
  });
}));

// @desc    Get single field
// @route   GET /api/fields/:fieldId
// @access  Private
router.get('/:fieldId', validateObjectId('fieldId'), catchAsync(async (req, res) => {
  const field = await Field.findById(req.params.fieldId).populate('idea');

  if (!field) {
    return res.status(404).json({
      success: false,
      message: 'Field not found',
    });
  }

  // Check if user has access to the idea
  if (!field.idea.hasAccess(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  // Update analytics
  field.analytics.accessCount += 1;
  field.analytics.lastAccessed = new Date();
  await field.save();

  res.json({
    success: true,
    data: {
      field,
    },
  });
}));

// @desc    Create new field
// @route   POST /api/fields
// @access  Private
router.post('/', validateFieldCreation, catchAsync(async (req, res) => {
  const { idea: ideaId, fieldId, title, description, order } = req.body;

  // Check if user has access to the idea
  const idea = await Idea.findById(ideaId);
  if (!idea) {
    return res.status(404).json({
      success: false,
      message: 'Idea not found',
    });
  }

  if (!idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  // Check if field ID already exists for this idea
  const existingField = await Field.findOne({ idea: ideaId, fieldId });
  if (existingField) {
    return res.status(400).json({
      success: false,
      message: 'Field ID already exists for this idea',
    });
  }

  const fieldData = {
    idea: ideaId,
    fieldId,
    title,
    description,
    order: order || 0,
    lastModifiedBy: req.user._id,
  };

  const field = await Field.create(fieldData);

  logger.info(`New field created: ${field.title} for idea ${idea.title} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Field created successfully',
    data: {
      field,
    },
  });
}));

// @desc    Update field
// @route   PUT /api/fields/:fieldId
// @access  Private
router.put('/:fieldId', validateObjectId('fieldId'), validateFieldUpdate, catchAsync(async (req, res) => {
  const field = await Field.findById(req.params.fieldId).populate('idea');

  if (!field) {
    return res.status(404).json({
      success: false,
      message: 'Field not found',
    });
  }

  // Check if user can edit the idea
  if (!field.idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const allowedUpdates = [
    'title', 'description', 'aiGenerated', 'notes', 'order', 'customizations'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  updates.lastModifiedBy = req.user._id;

  const updatedField = await Field.findByIdAndUpdate(
    req.params.fieldId,
    updates,
    { new: true, runValidators: true }
  );

  logger.info(`Field updated: ${updatedField.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Field updated successfully',
    data: {
      field: updatedField,
    },
  });
}));

// @desc    Delete field
// @route   DELETE /api/fields/:fieldId
// @access  Private
router.delete('/:fieldId', validateObjectId('fieldId'), catchAsync(async (req, res) => {
  const field = await Field.findById(req.params.fieldId).populate('idea');

  if (!field) {
    return res.status(404).json({
      success: false,
      message: 'Field not found',
    });
  }

  // Check if user can edit the idea
  if (!field.idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  // Delete related tasks
  await Task.deleteMany({ field: field._id });

  // Delete the field
  await Field.findByIdAndDelete(req.params.fieldId);

  logger.info(`Field deleted: ${field.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Field deleted successfully',
  });
}));

// @desc    Mark field as completed
// @route   PATCH /api/fields/:fieldId/complete
// @access  Private
router.patch('/:fieldId/complete', validateObjectId('fieldId'), catchAsync(async (req, res) => {
  const field = await Field.findById(req.params.fieldId).populate('idea');

  if (!field) {
    return res.status(404).json({
      success: false,
      message: 'Field not found',
    });
  }

  // Check if user can edit the idea
  if (!field.idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  await field.markCompleted();

  logger.info(`Field completed: ${field.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Field marked as completed',
    data: {
      field,
    },
  });
}));

// @desc    Reset field completion
// @route   PATCH /api/fields/:fieldId/reset
// @access  Private
router.patch('/:fieldId/reset', validateObjectId('fieldId'), catchAsync(async (req, res) => {
  const field = await Field.findById(req.params.fieldId).populate('idea');

  if (!field) {
    return res.status(404).json({
      success: false,
      message: 'Field not found',
    });
  }

  // Check if user can edit the idea
  if (!field.idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  await field.resetCompletion();

  logger.info(`Field reset: ${field.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Field completion reset',
    data: {
      field,
    },
  });
}));

// @desc    Update field progress
// @route   PATCH /api/fields/:fieldId/progress
// @access  Private
router.patch('/:fieldId/progress', validateObjectId('fieldId'), catchAsync(async (req, res) => {
  const { completedTasks, totalTasks } = req.body;

  if (typeof completedTasks !== 'number' || typeof totalTasks !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Completed tasks and total tasks must be numbers',
    });
  }

  const field = await Field.findById(req.params.fieldId).populate('idea');

  if (!field) {
    return res.status(404).json({
      success: false,
      message: 'Field not found',
    });
  }

  // Check if user can edit the idea
  if (!field.idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  await field.updateProgress(completedTasks, totalTasks);

  logger.info(`Field progress updated: ${field.title} (${completedTasks}/${totalTasks}) by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Field progress updated',
    data: {
      field,
    },
  });
}));

// @desc    Reorder fields
// @route   PATCH /api/fields/reorder
// @access  Private
router.patch('/reorder', catchAsync(async (req, res) => {
  const { fieldOrders } = req.body; // Array of { fieldId, order }

  if (!Array.isArray(fieldOrders)) {
    return res.status(400).json({
      success: false,
      message: 'Field orders must be an array',
    });
  }

  // Update field orders
  const updatePromises = fieldOrders.map(({ fieldId, order }) => 
    Field.findByIdAndUpdate(fieldId, { order }, { new: true })
  );

  await Promise.all(updatePromises);

  logger.info(`Fields reordered by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Fields reordered successfully',
  });
}));

// @desc    Get field statistics
// @route   GET /api/fields/:fieldId/statistics
// @access  Private
router.get('/:fieldId/statistics', validateObjectId('fieldId'), catchAsync(async (req, res) => {
  const field = await Field.findById(req.params.fieldId).populate('idea');

  if (!field) {
    return res.status(404).json({
      success: false,
      message: 'Field not found',
    });
  }

  // Check if user has access to the idea
  if (!field.idea.hasAccess(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  // Get task statistics for this field
  const taskStats = await Task.aggregate([
    { $match: { field: field._id } },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: { $sum: { $cond: ['$completed', 1, 0] } },
        averageWeight: { $avg: '$weight' },
        totalEstimatedHours: { $sum: '$timeTracking.estimatedHours' },
        totalActualHours: { $sum: '$timeTracking.actualHours' },
        overdueTasks: {
          $sum: {
            $cond: [
              { $and: [{ $ne: ['$dueDate', null] }, { $gt: ['$dueDate', new Date()] }, { $eq: ['$completed', false] }] },
              1,
              0
            ]
          }
        },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      field: {
        id: field._id,
        title: field.title,
        progress: field.progress,
        isCompleted: field.isCompleted,
        completionDate: field.completionDate,
      },
      taskStats: taskStats[0] || {
        totalTasks: 0,
        completedTasks: 0,
        averageWeight: 0,
        totalEstimatedHours: 0,
        totalActualHours: 0,
        overdueTasks: 0,
      },
      analytics: field.analytics,
    },
  });
}));

export default router;