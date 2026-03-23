import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  avatar: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
    language: {
      type: String,
      default: 'en',
    },
  },
  // Personal development metrics (for YOU project)
  personalMetrics: {
    skills: { type: Number, default: 60, min: 0, max: 100 },
    knowledge: { type: Number, default: 55, min: 0, max: 100 },
    experience: { type: Number, default: 50, min: 0, max: 100 },
    financialStability: { type: Number, default: 40, min: 0, max: 100 },
    health: { type: Number, default: 65, min: 0, max: 100 },
    discipline: { type: Number, default: 45, min: 0, max: 100 },
    network: { type: Number, default: 35, min: 0, max: 100 },
    mentors: { type: Number, default: 20, min: 0, max: 100 },
    locationAdvantage: { type: Number, default: 30, min: 0, max: 100 },
    marketAccess: { type: Number, default: 30, min: 0, max: 100 },
    resources: { type: Number, default: 50, min: 0, max: 100 },
    location: { type: String, default: '' },
    mindset: { type: Number, default: 55, min: 0, max: 100 },
    focus: { type: Number, default: 40, min: 0, max: 100 },
    resilience: { type: Number, default: 50, min: 0, max: 100 },
    riskTolerance: { type: Number, default: 35, min: 0, max: 100 },
    emotionalIntelligence: { type: Number, default: 45, min: 0, max: 100 },
    readingHabits: { type: Number, default: 30, min: 0, max: 100 },
    creativity: { type: Number, default: 60, min: 0, max: 100 },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user's full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', userSchema);

export default User;