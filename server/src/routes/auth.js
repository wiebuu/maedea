import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { logger } from '../config/logger.js';
import { catchAsync, AppError } from '../middleware/errorHandler.js';
import { 
  generateToken, 
  generateRefreshToken, 
  validatePassword,
  generateEmailVerificationToken,
  generatePasswordResetToken 
} from '../middleware/auth.js';
import { 
  validateUserRegistration, 
  validateUserLogin,
  validateObjectId 
} from '../middleware/validation.js';

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateUserRegistration, catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email address',
    });
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Password validation failed',
      errors: passwordValidation.errors,
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    emailVerificationToken: generateEmailVerificationToken(),
  });

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set refresh token in cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  // Remove password from response
  const userResponse = user.getPublicProfile();

  logger.info(`New user registered: ${email}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: userResponse,
      token,
    },
  });
}));

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateUserLogin, catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findByEmail(email).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    return res.status(401).json({
      success: false,
      message: 'Please verify your email address before logging in',
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Set refresh token in cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  // Remove password from response
  const userResponse = user.getPublicProfile();

  logger.info(`User logged in: ${email}`);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse,
      token,
    },
  });
}));

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', catchAsync(async (req, res) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken');

  logger.info(`User logged out: ${req.user?.email || 'Unknown'}`);

  res.json({
    success: true,
    message: 'Logout successful',
  });
}));

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token not provided',
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Generate new access token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
}));

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', catchAsync(async (req, res) => {
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

// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
router.get('/verify-email/:token', catchAsync(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: token,
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token',
    });
  }

  // Verify email
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  logger.info(`Email verified for user: ${user.email}`);

  res.json({
    success: true,
    message: 'Email verified successfully',
  });
}));

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Public
router.post('/resend-verification', catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: 'Email is already verified',
    });
  }

  // Generate new verification token
  user.emailVerificationToken = generateEmailVerificationToken();
  await user.save();

  // TODO: Send verification email
  logger.info(`Verification email resent for: ${email}`);

  res.json({
    success: true,
    message: 'Verification email sent successfully',
  });
}));

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }

  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Generate reset token
  const resetToken = generatePasswordResetToken();
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // TODO: Send password reset email
  logger.info(`Password reset requested for: ${email}`);

  res.json({
    success: true,
    message: 'Password reset email sent successfully',
  });
}));

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
router.post('/reset-password/:token', catchAsync(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
    });
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Password validation failed',
      errors: passwordValidation.errors,
    });
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token',
    });
  }

  // Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  logger.info(`Password reset successful for: ${user.email}`);

  res.json({
    success: true,
    message: 'Password reset successfully',
  });
}));

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required',
    });
  }

  // Validate new password strength
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Password validation failed',
      errors: passwordValidation.errors,
    });
  }

  // Get user with password
  const user = await User.findById(req.user._id).select('+password');
  
  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.info(`Password changed for user: ${user.email}`);

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
}));

export default router;