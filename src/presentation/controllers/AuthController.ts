import { Request, Response, NextFunction } from 'express';
import {
  UserRegistrationDTO,
  UserLoginDTO,
  UserResponseDTO
} from '../../application/dtos';
import { AuthService } from '../../application/services/AuthService';
import { IAuthenticatedRequest } from '../middleware';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication-related operations
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * POST /api/auth/register
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: UserRegistrationDTO = req.body;

      // Register user
      const user = await this.authService.registerUser(userData);

      // Send response
      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   * POST /api/auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginData: UserLoginDTO = req.body;

      // Login user
      const { user, tokens } = await this.authService.loginUser(loginData);

      // Send response
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { user, tokens },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify email address
   * GET /api/auth/verify-email
   */
  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Token is required',
        });
        return;
      }

      // Verify email
      const user = await this.authService.verifyEmail(token);

      // Redirect to success page
      res.redirect('/pages/email-verification-success');
    } catch (error) {
      // Redirect to failure page
      res.redirect('/pages/email-verification-failed');
    }
  };

  /**
   * Resend verification email
   * POST /api/auth/resend-verification
   */
  resendVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required',
        });
        return;
      }

      // Resend verification email
      await this.authService.resendVerificationEmail(email);

      // Send response
      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      // Refresh token
      const tokens = await this.authService.refreshToken(refreshToken);

      // Send response
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { tokens },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      // Logout user
      await this.authService.logout(req.user.id, refreshToken);

      // Send response
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout from all devices
   * POST /api/auth/logout-all
   */
  logoutAllDevices = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      // Logout from all devices
      await this.authService.logoutAllDevices(req.user.id);

      // Send response
      res.status(200).json({
        success: true,
        message: 'Logged out from all devices successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user profile
   * GET /api/auth/profile
   */
  getProfile = async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      // Get user profile
      const user = await this.authService.getUserProfile(req.user.id);

      // Send response
      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required',
        });
        return;
      }

      // Request password reset
      await this.authService.requestPasswordReset(email);

      // Send response (don't reveal if email exists or not for security)
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset email has been sent',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reset password
   * POST /api/auth/reset-password
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Token and new password are required',
        });
        return;
      }

      // Reset password
      const user = await this.authService.resetPassword(token, newPassword);

      // Redirect to success page
      res.redirect('/pages/password-reset-success');
    } catch (error) {
      // Redirect to failure page
      res.redirect('/pages/password-reset-failed');
    }
  };

  /**
   * Health check endpoint
   * GET /api/auth/health
   */
  healthCheck = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      success: true,
      message: 'Authentication service is healthy',
      data: {
        timestamp: new Date().toISOString(),
        service: 'auth',
        version: '1.0.0',
      },
    });
  };
}