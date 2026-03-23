import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  idea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [4000, 'Message cannot be more than 4000 characters'],
  },
  // AI-specific fields
  aiResponse: {
    model: String, // e.g., 'gpt-4', 'gpt-3.5-turbo'
    tokens: {
      prompt: Number,
      completion: Number,
      total: Number,
    },
    processingTime: Number, // in milliseconds
    confidence: Number, // 0-1
  },
  // Context for AI responses
  context: {
    fieldId: String, // If message is related to a specific field
    taskId: String, // If message is related to a specific task
    previousMessages: [String], // IDs of previous messages for context
  },
  // Message metadata
  metadata: {
    isEdited: { type: Boolean, default: false },
    editedAt: Date,
    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
    reactions: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emoji: String,
      createdAt: { type: Date, default: Date.now },
    }],
  },
  // Threading for conversations
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatThread',
  },
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage',
  },
  // AI actions triggered by the message
  actions: [{
    type: {
      type: String,
      enum: ['add-task', 'update-task', 'delete-task', 'add-field', 'update-field', 'analyze', 'suggest'],
    },
    targetId: String, // ID of the affected resource
    details: mongoose.Schema.Types.Mixed,
    executed: { type: Boolean, default: false },
    executedAt: Date,
  }],
  // Message status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent',
  },
  // Analytics
  analytics: {
    readBy: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      readAt: { type: Date, default: Date.now },
    }],
    responseTime: Number, // Time taken to respond (for AI messages)
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
chatMessageSchema.index({ idea: 1, createdAt: -1 });
chatMessageSchema.index({ user: 1 });
chatMessageSchema.index({ type: 1 });
chatMessageSchema.index({ threadId: 1 });
chatMessageSchema.index({ 'metadata.isDeleted': 1 });

// Virtual for message age
chatMessageSchema.virtual('age').get(function() {
  const now = new Date();
  const diff = now.getTime() - this.createdAt.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
});

// Virtual for message preview
chatMessageSchema.virtual('preview').get(function() {
  return this.content.length > 100 
    ? this.content.substring(0, 100) + '...' 
    : this.content;
});

// Pre-save middleware
chatMessageSchema.pre('save', function(next) {
  // Update AI response metadata
  if (this.type === 'ai' && this.aiResponse) {
    this.aiResponse.tokens.total = (this.aiResponse.tokens.prompt || 0) + (this.aiResponse.tokens.completion || 0);
  }
  
  // Set thread ID if not provided
  if (!this.threadId && this.parentMessage) {
    // This would need to be handled in the application logic
    // as we can't easily query the parent message here
  }
  
  next();
});

// Instance method to mark as read
chatMessageSchema.methods.markAsRead = function(userId) {
  const existingRead = this.analytics.readBy.find(read => read.user.toString() === userId.toString());
  
  if (!existingRead) {
    this.analytics.readBy.push({ user: userId, readAt: new Date() });
    this.status = 'read';
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Instance method to add reaction
chatMessageSchema.methods.addReaction = function(userId, emoji) {
  // Remove existing reaction from this user
  this.metadata.reactions = this.metadata.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );
  
  // Add new reaction
  this.metadata.reactions.push({
    user: userId,
    emoji,
    createdAt: new Date(),
  });
  
  return this.save();
};

// Instance method to remove reaction
chatMessageSchema.methods.removeReaction = function(userId) {
  this.metadata.reactions = this.metadata.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );
  return this.save();
};

// Instance method to execute action
chatMessageSchema.methods.executeAction = function(actionId) {
  const action = this.actions.id(actionId);
  if (action && !action.executed) {
    action.executed = true;
    action.executedAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to find messages by idea
chatMessageSchema.statics.findByIdea = function(ideaId, options = {}) {
  const query = { idea: ideaId, 'metadata.isDeleted': false };
  return this.find(query, null, options)
    .populate('user', 'name avatar')
    .sort({ createdAt: 1 });
};

// Static method to find messages by thread
chatMessageSchema.statics.findByThread = function(threadId, options = {}) {
  const query = { threadId, 'metadata.isDeleted': false };
  return this.find(query, null, options)
    .populate('user', 'name avatar')
    .sort({ createdAt: 1 });
};

// Static method to get conversation summary
chatMessageSchema.statics.getConversationSummary = function(ideaId, limit = 50) {
  return this.find({ idea: ideaId, 'metadata.isDeleted': false })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .then(messages => messages.reverse());
};

// Static method to get AI usage statistics
chatMessageSchema.statics.getAIUsageStats = function(userId, timeRange = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeRange);
  
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        type: 'ai',
        createdAt: { $gte: startDate },
        'metadata.isDeleted': false,
      },
    },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        totalTokens: { $sum: '$aiResponse.tokens.total' },
        averageResponseTime: { $avg: '$aiResponse.processingTime' },
        totalProcessingTime: { $sum: '$aiResponse.processingTime' },
      },
    },
  ]);
};

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;