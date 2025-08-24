import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AuthService } from '../services/authService';
import { AuthenticationError } from '../utils/errors';
import { IAuthenticatedRequest } from '../types';

/**
 * Authentication middleware
 * Verifies JWT access token and attaches user information to request
 */
export const authenticateToken = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AuthenticationError('Access token is required');
    }

    // Verify access token
    const decoded = verifyAccessToken(token);

    // Get user profile
    const user = await AuthService.getUserProfile(decoded.userId);

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      next(new AuthenticationError('Invalid access token'));
    }
  }
};

/**
 * Optional authentication middleware
 * Similar to authenticateToken but doesn't throw error if token is missing
 * Useful for routes that can work with or without authentication
 */
export const optionalAuth = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await AuthService.getUserProfile(decoded.userId);
      req.user = user;
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

/**
 * Email verification required middleware
 * Ensures user's email is verified before accessing protected routes
 */
export const requireEmailVerification = (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    next(new AuthenticationError('Authentication required'));
    return;
  }

  if (!req.user.isEmailVerified) {
    next(new AuthenticationError('Email verification required'));
    return;
  }

  next();
};

/**
 * Role-based authorization middleware (for future use)
 * @param roles - Array of allowed roles
 */
export const requireRole = (roles: string[]) => {
  return (req: IAuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AuthenticationError('Authentication required'));
      return;
    }

    // For now, we don't have roles implemented, but this is ready for future expansion
    // if (!roles.includes(req.user.role)) {
    //   next(new AuthorizationError('Insufficient permissions'));
    //   return;
    // }

    next();
  };
};
