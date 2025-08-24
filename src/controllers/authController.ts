import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { 
  validateRequest, 
  userRegistrationSchema, 
  userLoginSchema, 
  emailVerificationSchema,
  refreshTokenSchema 
} from '../utils/validation';
import { asyncHandler } from '../utils/errors';
import { IAuthenticatedRequest, IApiResponse } from '../types';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication-related operations
 */
export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Validate request body
    const userData = validateRequest(userRegistrationSchema, req.body);

    // Register user
    const user = await AuthService.registerUser(userData);

    // Send response
    const response: IApiResponse = {
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      data: { user },
    };

    res.status(201).json(response);
  });

  /**
   * Login user
   * POST /api/auth/login
   */
  static login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Validate request body
    const loginData = validateRequest(userLoginSchema, req.body);

    // Login user
    const { user, tokens } = await AuthService.loginUser(loginData);

    // Send response
    const response: IApiResponse = {
      success: true,
      message: 'Login successful',
      data: { user, tokens },
    };

    res.status(200).json(response);
  });

  /**
   * Verify email address
   * GET /api/auth/verify-email
   */
  static verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Validate query parameters
    const { token } = validateRequest(emailVerificationSchema, req.query);

    try {
      // Verify email
      const user = await AuthService.verifyEmail(token);

      // Redirect to success page
      res.redirect('/pages/email-verification-success');
    } catch (error) {
      // Redirect to failure page
      res.redirect('/pages/email-verification-failed');
    }
  });

  /**
   * Resend verification email
   * POST /api/auth/resend-verification
   */
  static resendVerification = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    // Resend verification email
    await AuthService.resendVerificationEmail(email);

    // Send response
    const response: IApiResponse = {
      success: true,
      message: 'Verification email sent successfully',
    };

    res.status(200).json(response);
  });

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Validate request body
    const { refreshToken } = validateRequest(refreshTokenSchema, req.body);

    // Refresh token
    const tokens = await AuthService.refreshToken(refreshToken);

    // Send response
    const response: IApiResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: { tokens },
    };

    res.status(200).json(response);
  });

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static logout = asyncHandler(async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
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
    await AuthService.logout(req.user.id, refreshToken);

    // Send response
    const response: IApiResponse = {
      success: true,
      message: 'Logged out successfully',
    };

    res.status(200).json(response);
  });

  /**
   * Logout from all devices
   * POST /api/auth/logout-all
   */
  static logoutAllDevices = asyncHandler(async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    // Logout from all devices
    await AuthService.logoutAllDevices(req.user.id);

    // Send response
    const response: IApiResponse = {
      success: true,
      message: 'Logged out from all devices successfully',
    };

    res.status(200).json(response);
  });

  /**
   * Get user profile
   * GET /api/auth/profile
   */
  static getProfile = asyncHandler(async (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    // Get user profile
    const user = await AuthService.getUserProfile(req.user.id);

    // Send response
    const response: IApiResponse = {
      success: true,
      message: 'Profile retrieved successfully',
      data: { user },
    };

    res.status(200).json(response);
  });

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  static forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      });
      return;
    }

    // Request password reset
    await AuthService.requestPasswordReset(email);

    // Send response (don't reveal if email exists or not for security)
    const response: IApiResponse = {
      success: true,
      message: 'If an account with that email exists, a password reset email has been sent',
    };

    res.status(200).json(response);
  });

  /**
   * Reset password
   * POST /api/auth/reset-password
   */
  static resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
      return;
    }

    try {
      // Reset password
      const user = await AuthService.resetPassword(token, newPassword);

      // Redirect to success page
      res.redirect('/pages/password-reset-success');
    } catch (error) {
      // Redirect to failure page
      res.redirect('/pages/password-reset-failed');
    }
  });

  /**
   * Health check endpoint
   * GET /api/auth/health
   */
  static healthCheck = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response: IApiResponse = {
      success: true,
      message: 'Authentication service is healthy',
      data: {
        timestamp: new Date().toISOString(),
        service: 'auth',
        version: '1.0.0',
      },
    };

    res.status(200).json(response);
  });
}
