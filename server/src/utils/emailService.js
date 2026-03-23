import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';

// Create email transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // For development, use a test account or mock
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass',
      },
    });
  }
};

// Send email verification
export const sendEmailVerification = async (email, name, verificationToken) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.CORS_ORIGIN}/verify-email/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@helloworldwonder.com',
      to: email,
      subject: 'Verify Your Email Address - Hello World Wonder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Hello World Wonder!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            If you didn't create an account with Hello World Wonder, please ignore this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email verification sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Email verification error:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordReset = async (email, name, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.CORS_ORIGIN}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@helloworldwonder.com',
      to: email,
      subject: 'Reset Your Password - Hello World Wonder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 10 minutes.</p>
          <p><strong>If you didn't request a password reset, please ignore this email.</strong></p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            For security reasons, this link will only work once.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Password reset email error:', error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@helloworldwonder.com',
      to: email,
      subject: 'Welcome to Hello World Wonder! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Hello World Wonder!</h2>
          <p>Hi ${name},</p>
          <p>Congratulations! Your email has been verified and your account is now active.</p>
          <p>You're ready to start turning your ideas into reality! Here's what you can do:</p>
          <ul>
            <li>Create your first idea and get AI-powered guidance</li>
            <li>Track your progress with structured roadmaps</li>
            <li>Connect with our AI assistant for personalized advice</li>
            <li>Monitor your personal development journey</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CORS_ORIGIN}/dashboard" 
               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Get Started
            </a>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Happy building!</p>
          <p>The Hello World Wonder Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Welcome email sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Welcome email error:', error);
    return false;
  }
};

// Send idea shared notification
export const sendIdeaSharedNotification = async (email, name, ideaTitle, shareUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@helloworldwonder.com',
      to: email,
      subject: `Your idea "${ideaTitle}" has been shared`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Idea Shared Successfully!</h2>
          <p>Hi ${name},</p>
          <p>Your idea "<strong>${ideaTitle}</strong>" has been shared successfully.</p>
          <p>Share this link with others:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="word-break: break-all; color: #007bff;">${shareUrl}</p>
          </div>
          <p>Anyone with this link can view your idea and provide feedback.</p>
          <p>If you want to stop sharing this idea, you can change its visibility settings in your dashboard.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from Hello World Wonder.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Idea shared notification sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Idea shared notification error:', error);
    return false;
  }
};

// Send weekly progress report
export const sendWeeklyProgressReport = async (email, name, progressData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@helloworldwonder.com',
      to: email,
      subject: 'Your Weekly Progress Report - Hello World Wonder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Weekly Progress Report</h2>
          <p>Hi ${name},</p>
          <p>Here's your progress summary for this week:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📊 This Week's Achievements</h3>
            <ul>
              <li>Ideas created: ${progressData.ideasCreated || 0}</li>
              <li>Tasks completed: ${progressData.tasksCompleted || 0}</li>
              <li>Fields finished: ${progressData.fieldsCompleted || 0}</li>
              <li>Overall progress: ${progressData.overallProgress || 0}%</li>
            </ul>
          </div>

          <div style="background-color: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">🎯 Next Week's Focus</h3>
            <p>Keep up the great work! Consider focusing on:</p>
            <ul>
              ${progressData.suggestions?.map(suggestion => `<li>${suggestion}</li>`).join('') || '<li>Continue working on your active projects</li>'}
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CORS_ORIGIN}/dashboard" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Full Dashboard
            </a>
          </div>

          <p>Keep building amazing things!</p>
          <p>The Hello World Wonder Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Weekly progress report sent to: ${email}`);
    return true;
  } catch (error) {
    logger.error('Weekly progress report error:', error);
    return false;
  }
};

export default {
  sendEmailVerification,
  sendPasswordReset,
  sendWelcomeEmail,
  sendIdeaSharedNotification,
  sendWeeklyProgressReport,
};