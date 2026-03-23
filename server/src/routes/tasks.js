import express from 'express';
import Task from '../models/Task.js';
import Field from '../models/Field.js';
import Idea from '../models/Idea.js';
import { logger } from '../config/logger.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { 
  validateTaskCreation, 
  validateTaskUpdate, 
  validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

// @desc    Get all tasks for a field
// @route   GET /api/tasks/field/:fieldId
// @access  Private
router.get('/field/:fieldId', validateObjectId('fieldId'), catchAsync(async (req, res) => {
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

  const tasks = await Task.findByField(req.params.fieldId);

  res.json({
    success: true,
    data: {
      tasks,
    },
  });
}));

// @desc    Get all tasks for an idea
// @route   GET /api/tasks/idea/:ideaId
// @access  Private
router.get('/idea/:ideaId', validateObjectId('ideaId'), catchAsync(async (req, res) => {
  const idea = await Idea.findById(req.params.ideaId);

  if (!idea) {
    return res.status(404).json({
      success: false,
      message: 'Idea not found',
    });
  }

  // Check if user has access to the idea
  if (!idea.hasAccess(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const tasks = await Task.findByIdea(req.params.ideaId);

  res.json({
    success: true,
    data: {
      tasks,
    },
  });
}));

// @desc    Get single task
// @route   GET /api/tasks/:taskId
// @access  Private
router.get('/:taskId', validateObjectId('taskId'), catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.taskId)
    .populate('field')
    .populate('idea')
    .populate('assignedTo', 'name email avatar')
    .populate('completedBy', 'name email avatar')
    .populate('comments.user', 'name avatar');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user has access to the idea
  if (!task.idea.hasAccess(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  // Update analytics
  task.analytics.accessCount += 1;
  task.analytics.lastAccessed = new Date();
  await task.save();

  res.json({
    success: true,
    data: {
      task,
    },
  });
}));

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post('/', validateTaskCreation, catchAsync(async (req, res) => {
  const { field: fieldId, taskId, title, description, weight, priority, category, order } = req.body;

  // Check if field exists and user has access
  const field = await Field.findById(fieldId).populate('idea');
  if (!field) {
    return res.status(404).json({
      success: false,
      message: 'Field not found',
    });
  }

  if (!field.idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  // Check if task ID already exists for this field
  const existingTask = await Task.findOne({ field: fieldId, taskId });
  if (existingTask) {
    return res.status(400).json({
      success: false,
      message: 'Task ID already exists for this field',
    });
  }

  const taskData = {
    field: fieldId,
    idea: field.idea._id,
    taskId,
    title,
    description,
    weight,
    priority: priority || 'medium',
    category: category || 'other',
    order: order || 0,
  };

  const task = await Task.create(taskData);

  // Update field progress
  const totalTasks = await Task.countDocuments({ field: fieldId });
  const completedTasks = await Task.countDocuments({ field: fieldId, completed: true });
  await field.updateProgress(completedTasks, totalTasks);

  logger.info(`New task created: ${task.title} in field ${field.title} by ${req.user.email}`);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: {
      task,
    },
  });
}));

// @desc    Update task
// @route   PUT /api/tasks/:taskId
// @access  Private
router.put('/:taskId', validateObjectId('taskId'), validateTaskUpdate, catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.taskId).populate('field').populate('idea');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user can edit the idea
  if (!task.idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const allowedUpdates = [
    'title', 'description', 'weight', 'status', 'priority', 'notes',
    'dueDate', 'startDate', 'assignedTo', 'category', 'order'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.taskId,
    updates,
    { new: true, runValidators: true }
  ).populate('field')
   .populate('assignedTo', 'name email avatar');

  // Update field progress if completion status changed
  if (req.body.status === 'completed' || req.body.completed === true) {
    await updatedTask.markCompleted(req.user._id);
  }

  // Update field progress
  const totalTasks = await Task.countDocuments({ field: task.field._id });
  const completedTasks = await Task.countDocuments({ field: task.field._id, completed: true });
  await task.field.updateProgress(completedTasks, totalTasks);

  logger.info(`Task updated: ${updatedTask.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Task updated successfully',
    data: {
      task: updatedTask,
    },
  });
}));

// @desc    Delete task
// @route   DELETE /api/tasks/:taskId
// @access  Private
router.delete('/:taskId', validateObjectId('taskId'), catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.taskId).populate('field').populate('idea');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user can edit the idea
  if (!task.idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  // Delete the task
  await Task.findByIdAndDelete(req.params.taskId);

  // Update field progress
  const totalTasks = await Task.countDocuments({ field: task.field._id });
  const completedTasks = await Task.countDocuments({ field: task.field._id, completed: true });
  await task.field.updateProgress(completedTasks, totalTasks);

  logger.info(`Task deleted: ${task.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Task deleted successfully',
  });
}));

// @desc    Mark task as completed
// @route   PATCH /api/tasks/:taskId/complete
// @access  Private
router.patch('/:taskId/complete', validateObjectId('taskId'), catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.taskId).populate('field').populate('idea');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user can edit the idea
  if (!task.idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  await task.markCompleted(req.user._id);

  // Update field progress
  const totalTasks = await Task.countDocuments({ field: task.field._id });
  const completedTasks = await Task.countDocuments({ field: task.field._id, completed: true });
  await task.field.updateProgress(completedTasks, totalTasks);

  logger.info(`Task completed: ${task.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Task marked as completed',
    data: {
      task,
    },
  });
}));

// @desc    Add time entry to task
// @route   POST /api/tasks/:taskId/time-entry
// @access  Private
router.post('/:taskId/time-entry', validateObjectId('taskId'), catchAsync(async (req, res) => {
  const { startTime, endTime, description } = req.body;

  if (!startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'Start time and end time are required',
    });
  }

  const task = await Task.findById(req.params.taskId).populate('field').populate('idea');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user can edit the idea
  if (!task.idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start >= end) {
    return res.status(400).json({
      success: false,
      message: 'Start time must be before end time',
    });
  }

  await task.addTimeEntry(start, end, description || '', req.user._id);

  logger.info(`Time entry added to task: ${task.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Time entry added successfully',
    data: {
      task,
    },
  });
}));

// @desc    Add comment to task
// @route   POST /api/tasks/:taskId/comments
// @access  Private
router.post('/:taskId/comments', validateObjectId('taskId'), catchAsync(async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Comment content is required',
    });
  }

  const task = await Task.findById(req.params.taskId).populate('field').populate('idea');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user has access to the idea
  if (!task.idea.hasAccess(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  await task.addComment(req.user._id, content.trim());

  logger.info(`Comment added to task: ${task.title} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Comment added successfully',
    data: {
      task,
    },
  });
}));

// @desc    Update task progress
// @route   PATCH /api/tasks/:taskId/progress
// @access  Private
router.patch('/:taskId/progress', validateObjectId('taskId'), catchAsync(async (req, res) => {
  const { percentage } = req.body;

  if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
    return res.status(400).json({
      success: false,
      message: 'Progress percentage must be a number between 0 and 100',
    });
  }

  const task = await Task.findById(req.params.taskId).populate('field').populate('idea');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user can edit the idea
  if (!task.idea.canEdit(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  await task.updateProgress(percentage);

  logger.info(`Task progress updated: ${task.title} (${percentage}%) by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Task progress updated',
    data: {
      task,
    },
  });
}));

// @desc    Reorder tasks
// @route   PATCH /api/tasks/reorder
// @access  Private
router.patch('/reorder', catchAsync(async (req, res) => {
  const { taskOrders } = req.body; // Array of { taskId, order }

  if (!Array.isArray(taskOrders)) {
    return res.status(400).json({
      success: false,
      message: 'Task orders must be an array',
    });
  }

  // Update task orders
  const updatePromises = taskOrders.map(({ taskId, order }) => 
    Task.findByIdAndUpdate(taskId, { order }, { new: true })
  );

  await Promise.all(updatePromises);

  logger.info(`Tasks reordered by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Tasks reordered successfully',
  });
}));

// @desc    Get task statistics
// @route   GET /api/tasks/:taskId/statistics
// @access  Private
router.get('/:taskId/statistics', validateObjectId('taskId'), catchAsync(async (req, res) => {
  const task = await Task.findById(req.params.taskId).populate('field').populate('idea');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  // Check if user has access to the idea
  if (!task.idea.hasAccess(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  res.json({
    success: true,
    data: {
      task: {
        id: task._id,
        title: task.title,
        status: task.status,
        completed: task.completed,
        progress: task.progress,
        weight: task.weight,
        priority: task.priority,
        dueDate: task.dueDate,
        isOverdue: task.isOverdue,
        timeRemaining: task.timeRemaining,
      },
      timeTracking: task.timeTracking,
      analytics: task.analytics,
    },
  });
}));

export default router;