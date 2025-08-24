import { IAppError, IApiResponse } from '../types';

/**
 * Custom application error class
 * Extends the base Error class with additional properties for HTTP status codes
 */
export class AppError extends Error implements IAppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Specific error classes for different types of errors
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429);
  }
}

/**
 * Format error response for API
 */
export const formatErrorResponse = (error: Error | AppError): IApiResponse => {
  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      error: error.message,
    };
  }

  // Handle unexpected errors
  return {
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  };
};

/**
 * Handle async errors in Express routes
 * Wraps async route handlers to catch and handle errors properly
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handler middleware
 */
export const globalErrorHandler = (
  error: Error | AppError,
  req: any,
  res: any,
  next: any
) => {
  let statusCode = 500;
  let message = 'Internal server error';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  const errorResponse = formatErrorResponse(error);

  res.status(statusCode).json(errorResponse);
};
