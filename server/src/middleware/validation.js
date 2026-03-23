import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    
    errors.array().forEach(error => {
      const field = error.path || error.param;
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      formattedErrors[field].push(error.msg);
    });
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
  
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .toLowerCase(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  handleValidationErrors,
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .toLowerCase(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors,
];

export const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  
  body('preferences.theme')
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Theme must be light, dark, or system'),
  
  body('preferences.language')
    .optional()
    .isLength({ min: 2, max: 5 })
    .withMessage('Language must be a valid language code'),
  
  handleValidationErrors,
];

// Idea validation rules
export const validateIdeaCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Idea title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Idea description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('type')
    .isIn([
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
    ])
    .withMessage('Invalid idea type'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return true;
    }),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
  
  handleValidationErrors,
];

export const validateIdeaUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('status')
    .optional()
    .isIn(['draft', 'active', 'completed', 'paused', 'archived'])
    .withMessage('Invalid status'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  
  body('visibility')
    .optional()
    .isIn(['private', 'shared', 'public'])
    .withMessage('Invalid visibility setting'),
  
  handleValidationErrors,
];

// Field validation rules
export const validateFieldCreation = [
  body('fieldId')
    .trim()
    .notEmpty()
    .withMessage('Field ID is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Field ID can only contain lowercase letters, numbers, and hyphens'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Field title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Field description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  
  handleValidationErrors,
];

export const validateFieldUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('aiGenerated')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('AI generated content cannot exceed 1000 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters'),
  
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  
  handleValidationErrors,
];

// Task validation rules
export const validateTaskCreation = [
  body('taskId')
    .trim()
    .notEmpty()
    .withMessage('Task ID is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Task ID can only contain lowercase letters, numbers, and hyphens'),
  
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Task description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('weight')
    .isInt({ min: 1, max: 10 })
    .withMessage('Weight must be between 1 and 10'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  
  body('category')
    .optional()
    .isIn(['research', 'planning', 'development', 'testing', 'deployment', 'marketing', 'other'])
    .withMessage('Invalid category'),
  
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer'),
  
  handleValidationErrors,
];

export const validateTaskUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('weight')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Weight must be between 1 and 10'),
  
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled', 'on-hold'])
    .withMessage('Invalid status'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  handleValidationErrors,
];

// Chat message validation rules
export const validateChatMessage = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ min: 1, max: 4000 })
    .withMessage('Message must be between 1 and 4000 characters'),
  
  body('type')
    .isIn(['user', 'ai'])
    .withMessage('Message type must be either user or ai'),
  
  body('context.fieldId')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Field ID can only contain lowercase letters, numbers, and hyphens'),
  
  body('context.taskId')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Task ID can only contain lowercase letters, numbers, and hyphens'),
  
  handleValidationErrors,
];

// Parameter validation rules
export const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors,
];

export const validateIdeaId = validateObjectId('ideaId');
export const validateFieldId = validateObjectId('fieldId');
export const validateTaskId = validateObjectId('taskId');
export const validateUserId = validateObjectId('userId');

// Query validation rules
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'title', '-title'])
    .withMessage('Invalid sort field'),
  
  handleValidationErrors,
];

export const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('type')
    .optional()
    .isIn([
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
    ])
    .withMessage('Invalid idea type'),
  
  query('status')
    .optional()
    .isIn(['draft', 'active', 'completed', 'paused', 'archived'])
    .withMessage('Invalid status'),
  
  handleValidationErrors,
];

// File upload validation
export const validateFileUpload = [
  body('filename')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Filename must be between 1 and 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  handleValidationErrors,
];

// Personal metrics validation
export const validatePersonalMetrics = [
  body('skills')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Skills must be between 0 and 100'),
  
  body('knowledge')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Knowledge must be between 0 and 100'),
  
  body('experience')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Experience must be between 0 and 100'),
  
  body('financialStability')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Financial stability must be between 0 and 100'),
  
  body('health')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Health must be between 0 and 100'),
  
  body('discipline')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Discipline must be between 0 and 100'),
  
  body('network')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Network must be between 0 and 100'),
  
  body('mentors')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Mentors must be between 0 and 100'),
  
  body('locationAdvantage')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Location advantage must be between 0 and 100'),
  
  body('marketAccess')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Market access must be between 0 and 100'),
  
  body('resources')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Resources must be between 0 and 100'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  
  body('mindset')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Mindset must be between 0 and 100'),
  
  body('focus')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Focus must be between 0 and 100'),
  
  body('resilience')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Resilience must be between 0 and 100'),
  
  body('riskTolerance')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Risk tolerance must be between 0 and 100'),
  
  body('emotionalIntelligence')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Emotional intelligence must be between 0 and 100'),
  
  body('readingHabits')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Reading habits must be between 0 and 100'),
  
  body('creativity')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Creativity must be between 0 and 100'),
  
  handleValidationErrors,
];