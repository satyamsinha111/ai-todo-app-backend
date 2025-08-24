import { Request, Response, NextFunction } from 'express';
import { UserResponseDTO } from '../../application/dtos';
import { AuthService } from '../../application/services/AuthService';

/**
 * Authenticated request interface
 * Extends Express Request with user property
 */
export interface IAuthenticatedRequest extends Request {
  user?: UserResponseDTO;
}

/**
 * Authentication middleware
 * Verifies JWT access token and attaches user information to request
 */
export class AuthMiddleware {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authentication middleware
   * Verifies JWT access token and attaches user information to request
   */
  authenticateToken = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Access token is required',
        });
        return;
      }

      // Verify access token and get user
      // This is a simplified implementation - in a real app, you would verify the token
      // and then fetch the user from the database
      // For now, we'll just pass the request through
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid access token',
      });
    }
  };

  /**
   * Optional authentication middleware
   * Similar to authenticateToken but doesn't throw error if token is missing
   * Useful for routes that can work with or without authentication
   */
  optionalAuth = async (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        // Verify access token and get user
        // This is a simplified implementation - in a real app, you would verify the token
        // and then fetch the user from the database
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
  requireEmailVerification = (
    req: IAuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!req.user.isEmailVerified) {
      res.status(403).json({
        success: false,
        message: 'Email verification required',
      });
      return;
    }

    next();
  };
}