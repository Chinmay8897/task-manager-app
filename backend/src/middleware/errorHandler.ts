import { Request, Response, NextFunction } from 'express';

interface ValidationErrorItem {
  message: string;
  path: string;
  type: string;
}

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: number | string;
  errors?: Record<string, ValidationErrorItem>;
  keyValue?: Record<string, any>;
}

const handleValidationError = (err: CustomError): { statusCode: number; message: string } => {
  const errors = err.errors ? Object.values(err.errors).map((el: ValidationErrorItem) => ({
    field: el.path,
    message: el.message,
    type: el.type
  })) : [];

  return {
    statusCode: 400,
    message: errors.length > 0 
      ? `Validation Error: ${errors.map(e => e.message).join(', ')}`
      : 'Validation Error: Invalid input data'
  };
};

const handleDuplicateKeyError = (err: CustomError): { statusCode: number; message: string } => {
  const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
  return {
    statusCode: 400,
    message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different value.`
  };
};

const handleJWTError = (): { statusCode: number; message: string } => ({
  statusCode: 401,
  message: 'Invalid token. Please log in again.'
});

const handleJWTExpiredError = (): { statusCode: number; message: string } => ({
  statusCode: 401,
  message: 'Your token has expired. Please log in again.'
});

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred';
  let errorDetails: Record<string, any> = {};

  // Log the error for debugging
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    user: (req as any).user?._id
  });

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    const validationError = handleValidationError(err);
    statusCode = validationError.statusCode;
    message = validationError.message;
    errorDetails.errors = err.errors;
  } else if (err.code === 11000) {
    const duplicateError = handleDuplicateKeyError(err);
    statusCode = duplicateError.statusCode;
    message = duplicateError.message;
    errorDetails.duplicateField = Object.keys(err.keyValue || {})[0];
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  // MongoDB CastError
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Prepare error response
  const errorResponse = {
    success: false,
    status: statusCode,
    message,
    ...(Object.keys(errorDetails).length > 0 && { details: errorDetails }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err.message
    })
  };

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Stack:', err.stack);
    console.error('Error Details:', {
      statusCode,
      message,
      originalError: err.message,
      path: req.path,
      method: req.method
    });
  }

  // Remove stack trace in production
  if (process.env.NODE_ENV !== 'development') {
    delete errorResponse.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Wraps async route handlers to automatically catch errors
 * and pass them to the error handling middleware
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch((err) => {
    // Log the error for debugging
    console.error(`[${new Date().toISOString()}] Async Handler Error:`, {
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      path: req.path,
      method: req.method
    });
    next(err);
  });
};

/**
 * Handles 404 errors
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`) as CustomError;
  error.statusCode = 404;
  
  // Log 404 errors
  console.warn(`[${new Date().toISOString()}] 404 Not Found: ${req.method} ${req.originalUrl}`);
  
  next(error);
};
