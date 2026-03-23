import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  idea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true,
  },
  fieldId: {
    type: String,
    required: [true, 'Field ID is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Field title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Field description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  aiGenerated: {
    type: String,
    trim: true,
    maxlength: [1000, 'AI generated content cannot be more than 1000 characters'],
  },
  order: {
    type: Number,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completionDate: {
    type: Date,
  },
  // Progress tracking
  progress: {
    completedTasks: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
  },
  // AI insights specific to this field
  aiInsights: {
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
    },
    estimatedTime: String, // e.g., "2-3 weeks", "1 month"
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    dependencies: [String], // Other field IDs this depends on
    suggestions: [String],
    resources: [String],
    lastAnalyzed: Date,
  },
  // User notes and customizations
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot be more than 2000 characters'],
  },
  customizations: {
    color: String,
    icon: String,
    isHidden: { type: Boolean, default: false },
  },
  // Collaboration
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Analytics
  analytics: {
    timeSpent: { type: Number, default: 0 }, // in minutes
    lastAccessed: Date,
    accessCount: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
fieldSchema.index({ idea: 1, fieldId: 1 }, { unique: true });
fieldSchema.index({ idea: 1, order: 1 });
fieldSchema.index({ isCompleted: 1 });

// Virtual for completion percentage
fieldSchema.virtual('completionPercentage').get(function() {
  if (this.progress.totalTasks === 0) return 0;
  return Math.round((this.progress.completedTasks / this.progress.totalTasks) * 100);
});

// Pre-save middleware to update progress
fieldSchema.pre('save', function(next) {
  // Update completion status based on progress
  if (this.progress.totalTasks > 0) {
    this.progress.percentage = Math.round((this.progress.completedTasks / this.progress.totalTasks) * 100);
    this.isCompleted = this.progress.percentage === 100;
    
    if (this.isCompleted && !this.completionDate) {
      this.completionDate = new Date();
    }
  }
  next();
});

// Instance method to update progress
fieldSchema.methods.updateProgress = function(completedTasks, totalTasks) {
  this.progress.completedTasks = completedTasks;
  this.progress.totalTasks = totalTasks;
  this.progress.percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  this.isCompleted = this.progress.percentage === 100;
  
  if (this.isCompleted && !this.completionDate) {
    this.completionDate = new Date();
  }
  
  return this.save();
};

// Instance method to mark as completed
fieldSchema.methods.markCompleted = function() {
  this.isCompleted = true;
  this.completionDate = new Date();
  this.progress.percentage = 100;
  return this.save();
};

// Instance method to reset completion
fieldSchema.methods.resetCompletion = function() {
  this.isCompleted = false;
  this.completionDate = undefined;
  this.progress.percentage = 0;
  return this.save();
};

// Static method to find fields by idea
fieldSchema.statics.findByIdea = function(ideaId) {
  return this.find({ idea: ideaId }).sort({ order: 1 });
};

// Static method to get field statistics
fieldSchema.statics.getStatistics = function(ideaId) {
  return this.aggregate([
    { $match: { idea: mongoose.Types.ObjectId(ideaId) } },
    {
      $group: {
        _id: null,
        totalFields: { $sum: 1 },
        completedFields: { $sum: { $cond: ['$isCompleted', 1, 0] } },
        averageProgress: { $avg: '$progress.percentage' },
        totalTasks: { $sum: '$progress.totalTasks' },
        completedTasks: { $sum: '$progress.completedTasks' },
      },
    },
  ]);
};

const Field = mongoose.model('Field', fieldSchema);

export default Field;