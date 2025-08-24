import dotenv from 'dotenv';
import { IConfig } from '../types';

// Load environment variables
dotenv.config();

/**
 * Configuration object with all environment variables
 * Validates required environment variables and provides defaults
 */
export const config: IConfig = {
  // Server Configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  // MongoDB Configuration
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-todo-app',

  // JWT Configuration
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'default-access-secret-change-in-production',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Email Configuration
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  emailFrom: process.env.EMAIL_FROM || '',

  // Application Configuration
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',

  // Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
};

/**
 * Validate required environment variables
 * Throws error if critical variables are missing
 */
export const validateConfig = (): void => {
  const requiredVars = [
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'EMAIL_USER',
    'EMAIL_PASS',
    'EMAIL_FROM'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env file or environment configuration.'
    );
  }
};

/**
 * Check if the application is running in production mode
 */
export const isProduction = (): boolean => config.nodeEnv === 'production';

/**
 * Check if the application is running in development mode
 */
export const isDevelopment = (): boolean => config.nodeEnv === 'development';
