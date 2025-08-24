import { Request } from 'express';
import { Document } from 'mongoose';

// User related types
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  createdAt: Date;
}

// JWT related types
export interface IJWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Email related types
export interface IEmailVerification {
  email: string;
  token: string;
}

// Request with user context
export interface IAuthenticatedRequest extends Request {
  user?: IUserResponse;
}

// API Response types
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Error types
export interface IAppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Validation types
export interface IValidationError {
  field: string;
  message: string;
}

// Environment configuration types
export interface IConfig {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtAccessExpiresIn: string;
  jwtRefreshExpiresIn: string;
  emailHost: string;
  emailPort: number;
  emailUser: string;
  emailPass: string;
  emailFrom: string;
  appUrl: string;
  frontendUrl: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}
