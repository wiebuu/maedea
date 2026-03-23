import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger.js';
import { catchAsync, AppError, handleFileUploadError } from '../middleware/errorHandler.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/csv',
    'application/json',
    'application/zip',
    'application/x-rar-compressed',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('File type not allowed', 400), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5, // Maximum 5 files per request
  },
});

// @desc    Upload single file
// @route   POST /api/upload/single
// @access  Private
router.post('/single', upload.single('file'), catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  const fileInfo = {
    id: uuidv4(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    size: req.file.size,
    mimeType: req.file.mimetype,
    uploadedAt: new Date(),
    uploadedBy: req.user._id,
  };

  logger.info(`File uploaded: ${req.file.originalname} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      file: fileInfo,
    },
  });
}));

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', upload.array('files', 5), catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded',
    });
  }

  const files = req.files.map(file => ({
    id: uuidv4(),
    filename: file.filename,
    originalName: file.originalname,
    url: `/uploads/${file.filename}`,
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date(),
    uploadedBy: req.user._id,
  }));

  logger.info(`${files.length} files uploaded by ${req.user.email}`);

  res.json({
    success: true,
    message: 'Files uploaded successfully',
    data: {
      files,
    },
  });
}));

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:filename
// @access  Private
router.delete('/:filename', catchAsync(async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File not found',
    });
  }

  // Delete file
  fs.unlinkSync(filePath);

  logger.info(`File deleted: ${filename} by ${req.user.email}`);

  res.json({
    success: true,
    message: 'File deleted successfully',
  });
}));

// @desc    Get file info
// @route   GET /api/upload/:filename/info
// @access  Private
router.get('/:filename/info', catchAsync(async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File not found',
    });
  }

  // Get file stats
  const stats = fs.statSync(filePath);
  const fileInfo = {
    filename,
    url: `/uploads/${filename}`,
    size: stats.size,
    createdAt: stats.birthtime,
    modifiedAt: stats.mtime,
  };

  res.json({
    success: true,
    data: {
      file: fileInfo,
    },
  });
}));

// @desc    Download file
// @route   GET /api/upload/:filename/download
// @access  Private
router.get('/:filename/download', catchAsync(async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'File not found',
    });
  }

  // Set appropriate headers
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');

  // Stream file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  logger.info(`File downloaded: ${filename} by ${req.user.email}`);
}));

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const multerError = handleFileUploadError(error);
    return res.status(multerError.statusCode).json({
      success: false,
      message: multerError.message,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

export default router;