import crypto from 'crypto';
import { User } from '../models/User';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import { 
  IUserRegistration, 
  IUserLogin, 
  IUserResponse, 
  ITokenResponse 
} from '../types';
import { 
  ConflictError, 
  AuthenticationError, 
  NotFoundError,
  ValidationError 
} from '../utils/errors';

/**
 * Authentication Service
 * Handles user registration, login, email verification, and token management
 */
export class AuthService {
  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise<IUserResponse> - Created user data
   */
  static async registerUser(userData: IUserRegistration): Promise<IUserResponse> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create new user
      const user = new User({
        ...userData,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      });

      await user.save();

      // Send verification email
      try {
        await sendVerificationEmail(user.email, user.firstName, verificationToken);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't throw error here, user can request email verification later
      }

      // Return user data without sensitive information
      return {
        id: (user as any)._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      };
    } catch (error) {
      // Log error for debugging (remove in production)
      console.error('Registration error:', error);
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new Error('Failed to register user');
    }
  }

  /**
   * Login user
   * @param loginData - User login data
   * @returns Promise<{ user: IUserResponse; tokens: ITokenResponse }> - User data and tokens
   */
  static async loginUser(loginData: IUserLogin): Promise<{ 
    user: IUserResponse; 
    tokens: ITokenResponse 
  }> {
    try {
      // Find user by email
      const user = await User.findOne({ email: loginData.email.toLowerCase() });
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(loginData.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Generate tokens
      const tokens = generateTokens((user as any)._id.toString(), user.email);

      // Add refresh token to user's refresh tokens array
      user.addRefreshToken(tokens.refreshToken);
      await user.save();

      // Return user data and tokens
      return {
        user: {
          id: (user as any)._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
        tokens,
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new Error('Failed to login user');
    }
  }

  /**
   * Verify user email
   * @param token - Email verification token
   * @returns Promise<IUserResponse> - Updated user data
   */
  static async verifyEmail(token: string): Promise<IUserResponse> {
    try {
      // Find user by verification token
      const user = await User.findOne({ 
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() }
      });
      if (!user) {
        throw new ValidationError('Invalid or expired verification token');
      }

      // Mark email as verified and clear verification token
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      // Return updated user data
      return {
        id: (user as any)._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error('Failed to verify email');
    }
  }

  /**
   * Resend verification email
   * @param email - User's email address
   * @returns Promise<void>
   */
  static async resendVerificationEmail(email: string): Promise<void> {
    try {
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.isEmailVerified) {
        throw new ValidationError('Email is already verified');
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update user with new verification token
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = verificationExpires;
      await user.save();

      // Send verification email
      await sendVerificationEmail(user.email, user.firstName, verificationToken);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new Error('Failed to resend verification email');
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Refresh token
   * @returns Promise<ITokenResponse> - New tokens
   */
  static async refreshToken(refreshToken: string): Promise<ITokenResponse> {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      // Check if refresh token exists in user's refresh tokens array
      if (!user.hasRefreshToken(refreshToken)) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Generate new tokens
      const newTokens = generateTokens((user as any)._id.toString(), user.email);

      // Remove old refresh token and add new one
      user.removeRefreshToken(refreshToken);
      user.addRefreshToken(newTokens.refreshToken);
      await user.save();

      return newTokens;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * Logout user (invalidate refresh token)
   * @param userId - User ID
   * @param refreshToken - Refresh token to invalidate
   * @returns Promise<void>
   */
  static async logout(userId: string, refreshToken: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Remove the specific refresh token
      user.removeRefreshToken(refreshToken);
      await user.save();
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Failed to logout');
    }
  }

  /**
   * Logout user from all devices (clear all refresh tokens)
   * @param userId - User ID
   * @returns Promise<void>
   */
  static async logoutAllDevices(userId: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Clear all refresh tokens
      user.clearRefreshTokens();
      await user.save();
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Failed to logout from all devices');
    }
  }

  /**
   * Get user profile by ID
   * @param userId - User ID
   * @returns Promise<IUserResponse> - User profile data
   */
  static async getUserProfile(userId: string): Promise<IUserResponse> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      return {
        id: (user as any)._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Failed to get user profile');
    }
  }

  /**
   * Request password reset
   * @param email - User email
   * @returns Promise<void>
   */
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal if user exists or not for security
        return;
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetExpires;
      await user.save();

      // Send password reset email
      await sendPasswordResetEmail(user.email, user.firstName, resetToken);
    } catch (error) {
      throw new Error('Failed to request password reset');
    }
  }

  /**
   * Reset password
   * @param token - Password reset token
   * @param newPassword - New password
   * @returns Promise<IUserResponse> - Updated user data
   */
  static async resetPassword(token: string, newPassword: string): Promise<IUserResponse> {
    try {
      const user = await User.findOne({ 
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() }
      });
      
      if (!user) {
        throw new ValidationError('Invalid or expired reset token');
      }

      // Update password
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      
      // Clear all refresh tokens for security
      user.clearRefreshTokens();
      
      await user.save();

      return {
        id: (user as any)._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error('Failed to reset password');
    }
  }
}
