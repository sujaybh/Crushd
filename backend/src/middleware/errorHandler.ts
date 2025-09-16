import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('❌ Error:', err);

  // Default error
  let statusCode = error.status || error.statusCode || 500;
  let message = error.message || 'Server Error';

  // PostgreSQL errors
  if (err.code === '23505') {
    // Duplicate key error
    statusCode = 400;
    message = 'Resource already exists';
  }

  if (err.code === '23503') {
    // Foreign key constraint error
    statusCode = 400;
    message = 'Invalid reference';
  }

  if (err.code === '23502') {
    // Not null constraint error
    statusCode = 400;
    message = 'Missing required field';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  }

  // Authentication errors
  if (message.includes('Invalid email or password')) {
    statusCode = 401;
  }

  if (message.includes('already registered') || message.includes('already taken')) {
    statusCode = 409;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};