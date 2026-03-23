import mongoose from 'mongoose';
import crypto from 'crypto';

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Idea title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Idea description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  type: {
    type: String,
    required: [true, 'Idea type is required'],
    enum: [
      'startup-idea',
      'existing-startup',
      'simple-project',
      'freelance-solo',
      'side-hustle',
      'local-business',
      'ecommerce',
      'nonprofit',
      'education-coaching',
      'content-creator',
      'tech-saas',
      'research-innovation',
      'personal-development'
    ],
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters'],
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'paused', 'archived'],
    default: 'active',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // AI-generated insights and recommendations
  aiInsights: {
    problemValidation: {
      score: { type: Number, min: 0, max: 10 },
      feedback: String,
      suggestions: [String],
    },
    marketAnalysis: {
      score: { type: Number, min: 0, max: 10 },
      feedback: String,
      suggestions: [String],
    },
    feasibility: {
      score: { type: Number, min: 0, max: 10 },
      feedback: String,
      suggestions: [String],
    },
    lastAnalyzed: Date,
  },
  // Metadata
  metadata: {
    estimatedDuration: String, // e.g., "3-6 months", "1 year"
    budget: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' },
    },
    targetAudience: String,
    keyFeatures: [String],
    technologies: [String],
    resources: [String],
  },
  // Timeline and milestones
  timeline: {
    startDate: Date,
    targetDate: Date,
    milestones: [{
      title: String,
      description: String,
      targetDate: Date,
      completed: { type: Boolean, default: false },
      completedAt: Date,
    }],
  },
  // Analytics and metrics
  analytics: {
    views: { type: Number, default: 0 },
    lastViewed: Date,
    timeSpent: { type: Number, default: 0 }, // in minutes
    completionRate: { type: Number, default: 0 },
  },
  // Sharing and visibility
  visibility: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private',
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  // Export and backup
  exports: [{
    format: { type: String, enum: ['pdf', 'docx', 'json'] },
    url: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
ideaSchema.index({ owner: 1, createdAt: -1 });
ideaSchema.index({ type: 1 });
ideaSchema.index({ status: 1 });
ideaSchema.index({ tags: 1 });
ideaSchema.index({ shareToken: 1 });
ideaSchema.index({ 'collaborators.user': 1 });

// Virtual for idea URL
ideaSchema.virtual('url').get(function() {
  return `/workspace/${this._id}`;
});

// Virtual for completion percentage
ideaSchema.virtual('completionPercentage').get(function() {
  if (!this.timeline?.milestones?.length) return 0;
  const completed = this.timeline.milestones.filter(m => m.completed).length;
  return Math.round((completed / this.timeline.milestones.length) * 100);
});

// Pre-save middleware to generate share token if needed
ideaSchema.pre('save', function(next) {
  if (this.visibility === 'shared' && !this.shareToken) {
    this.shareToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// Instance method to add collaborator
ideaSchema.methods.addCollaborator = function(userId, role = 'viewer') {
  const existingCollaborator = this.collaborators.find(
    collab => collab.user.toString() === userId.toString()
  );
  
  if (existingCollaborator) {
    existingCollaborator.role = role;
  } else {
    this.collaborators.push({ user: userId, role });
  }
  
  return this.save();
};

// Instance method to remove collaborator
ideaSchema.methods.removeCollaborator = function(userId) {
  this.collaborators = this.collaborators.filter(
    collab => collab.user.toString() !== userId.toString()
  );
  return this.save();
};

// Instance method to check if user has access
ideaSchema.methods.hasAccess = function(userId) {
  if (this.owner.toString() === userId.toString()) return true;
  if (this.visibility === 'public') return true;
  if (this.visibility === 'shared') return true;
  
  return this.collaborators.some(
    collab => collab.user.toString() === userId.toString()
  );
};

// Instance method to check if user can edit
ideaSchema.methods.canEdit = function(userId) {
  if (this.owner.toString() === userId.toString()) return true;
  
  const collaborator = this.collaborators.find(
    collab => collab.user.toString() === userId.toString()
  );
  
  return collaborator && ['editor', 'admin'].includes(collaborator.role);
};

// Static method to find ideas by user
ideaSchema.statics.findByUser = function(userId, options = {}) {
  return this.find({
    $or: [
      { owner: userId },
      { 'collaborators.user': userId }
    ],
    ...options
  }).populate('owner', 'name email avatar');
};

// Static method to find public ideas
ideaSchema.statics.findPublic = function(options = {}) {
  return this.find({ visibility: 'public', ...options })
    .populate('owner', 'name avatar');
};

const Idea = mongoose.model('Idea', ideaSchema);

export default Idea;