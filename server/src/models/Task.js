import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: true,
  },
  idea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true,
  },
  taskId: {
    type: String,
    required: [true, 'Task ID is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  weight: {
    type: Number,
    required: [true, 'Task weight is required'],
    min: [1, 'Weight must be at least 1'],
    max: [10, 'Weight cannot be more than 10'],
    default: 5,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled', 'on-hold'],
    default: 'pending',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  order: {
    type: Number,
    default: 0,
  },
  // Task categorization
  category: {
    type: String,
    enum: ['research', 'planning', 'development', 'testing', 'deployment', 'marketing', 'other'],
    default: 'other',
  },
  // Time tracking
  timeTracking: {
    estimatedHours: { type: Number, default: 0 },
    actualHours: { type: Number, default: 0 },
    timeEntries: [{
      startTime: Date,
      endTime: Date,
      duration: Number, // in minutes
      description: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }],
  },
  // Dependencies
  dependencies: [{
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    type: { type: String, enum: ['blocks', 'blocked-by', 'related'], default: 'blocked-by' },
  }],
  // Due dates and scheduling
  dueDate: {
    type: Date,
  },
  startDate: {
    type: Date,
  },
  // Assignments
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // AI-generated suggestions
  aiGenerated: {
    type: Boolean,
    default: false,
  },
  suggested: {
    type: Boolean,
    default: false,
  },
  // User notes and attachments
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot be more than 2000 characters'],
  },
  attachments: [{
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    mimeType: String,
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  // Tags for organization
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters'],
  }],
  // Collaboration and comments
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, maxlength: [1000, 'Comment cannot be more than 1000 characters'] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
  }],
  // Progress tracking
  progress: {
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    milestones: [{
      title: String,
      description: String,
      completed: { type: Boolean, default: false },
      completedAt: Date,
    }],
  },
  // Analytics
  analytics: {
    timeSpent: { type: Number, default: 0 }, // in minutes
    lastAccessed: Date,
    accessCount: { type: Number, default: 0 },
    completionTime: Number, // time from creation to completion in minutes
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
taskSchema.index({ field: 1, taskId: 1 }, { unique: true });
taskSchema.index({ idea: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ completed: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ weight: -1 });

// Virtual for task URL
taskSchema.virtual('url').get(function() {
  return `/workspace/${this.idea}/task/${this._id}`;
});

// Virtual for completion status
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

// Virtual for time remaining
taskSchema.virtual('timeRemaining').get(function() {
  if (!this.dueDate) return null;
  const now = new Date();
  const remaining = this.dueDate.getTime() - now.getTime();
  return remaining > 0 ? Math.ceil(remaining / (1000 * 60 * 60 * 24)) : 0; // days
});

// Pre-save middleware to update completion status
taskSchema.pre('save', function(next) {
  // Update completion status
  if (this.status === 'completed' && !this.completed) {
    this.completed = true;
    this.completedAt = new Date();
  } else if (this.status !== 'completed' && this.completed) {
    this.completed = false;
    this.completedAt = undefined;
  }
  
  // Update analytics
  if (this.completed && this.completedAt && this.createdAt) {
    this.analytics.completionTime = Math.round(
      (this.completedAt.getTime() - this.createdAt.getTime()) / (1000 * 60)
    );
  }
  
  next();
});

// Instance method to mark as completed
taskSchema.methods.markCompleted = function(userId) {
  this.status = 'completed';
  this.completed = true;
  this.completedAt = new Date();
  this.completedBy = userId;
  this.progress.percentage = 100;
  return this.save();
};

// Instance method to add time entry
taskSchema.methods.addTimeEntry = function(startTime, endTime, description, userId) {
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // minutes
  
  this.timeTracking.timeEntries.push({
    startTime,
    endTime,
    duration,
    description,
    user: userId,
  });
  
  this.timeTracking.actualHours += duration / 60;
  this.analytics.timeSpent += duration;
  
  return this.save();
};

// Instance method to add comment
taskSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content,
    createdAt: new Date(),
  });
  return this.save();
};

// Instance method to update progress
taskSchema.methods.updateProgress = function(percentage) {
  this.progress.percentage = Math.max(0, Math.min(100, percentage));
  
  if (this.progress.percentage === 100 && !this.completed) {
    this.status = 'completed';
    this.completed = true;
    this.completedAt = new Date();
  }
  
  return this.save();
};

// Static method to find tasks by field
taskSchema.statics.findByField = function(fieldId) {
  return this.find({ field: fieldId }).sort({ order: 1, weight: -1 });
};

// Static method to find tasks by idea
taskSchema.statics.findByIdea = function(ideaId) {
  return this.find({ idea: ideaId }).populate('field', 'title fieldId');
};

// Static method to get task statistics
taskSchema.statics.getStatistics = function(ideaId) {
  return this.aggregate([
    { $match: { idea: mongoose.Types.ObjectId(ideaId) } },
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
};

const Task = mongoose.model('Task', taskSchema);

export default Task;