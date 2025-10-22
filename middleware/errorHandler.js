import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resurs topilmadi';
    error = { message, statusCode: 404 };
    logger.error('CastError', { error: err.message, path: err.path });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} allaqachon mavjud`;
    error = { message, statusCode: 400 };
    logger.error('Duplicate key error', { field, value: err.keyValue[field] });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
    logger.error('Validation error', { errors: message });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token yaroqsiz';
    error = { message, statusCode: 401 };
    logger.error('JWT error', { error: err.message });
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token muddati tugagan';
    error = { message, statusCode: 401 };
    logger.error('Token expired', { error: err.message });
  }

  // Log error
  logger.error('Error handler', {
    message: error.message || err.message,
    statusCode: error.statusCode || 500,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server xatosi',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
