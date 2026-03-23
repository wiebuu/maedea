import { logger } from '../config/logger.js';

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle MongoDB duplicate key errors
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists. Please use a different ${field}.`;
  
  return new AppError(message, 400);
};

// Handle MongoDB validation errors
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  
  return new AppError(message, 400);
};

// Handle MongoDB cast errors
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle JWT errors
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

// Handle JWT expired errors
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥', err);
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
    });
  }
};

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.code === 11000) error = handleDuplicateKeyError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

// Handle unhandled routes
export const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Async error wrapper
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Validation error handler
export const handleValidationErrors = (errors) => {
  const formattedErrors = {};
  
  errors.forEach(error => {
    const field = error.path || error.param;
    if (!formattedErrors[field]) {
      formattedErrors[field] = [];
    }
    formattedErrors[field].push(error.msg);
  });
  
  return formattedErrors;
};

// Database error handler
export const handleDatabaseError = (err) => {
  if (err.code === 11000) {
    return handleDuplicateKeyError(err);
  }
  
  if (err.name === 'ValidationError') {
    return handleValidationError(err);
  }
  
  if (err.name === 'CastError') {
    return handleCastError(err);
  }
  
  return new AppError('Database operation failed', 500);
};

// File upload error handler
export const handleFileUploadError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large. Maximum size allowed is 10MB.', 400);
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files. Maximum 5 files allowed.', 400);
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected file field.', 400);
  }
  
  return new AppError('File upload failed', 500);
};

// Rate limit error handler
export const handleRateLimitError = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.round(req.rateLimit.resetTime / 1000),
  });
};