/**
 * Environment configuration interface
 */
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

/**
 * Environment configuration implementation
 * Loads configuration from environment variables
 */
export class EnvironmentConfig implements IConfig {
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

  constructor() {
    // Load environment variables
    require('dotenv').config();

    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.port = parseInt(process.env.PORT || '3000', 10);
    this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-todo-app';
    this.jwtAccessSecret = process.env.JWT_ACCESS_SECRET || 'default-access-secret-change-in-production';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-in-production';
    this.jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    this.emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
    this.emailPort = parseInt(process.env.EMAIL_PORT || '587', 10);
    this.emailUser = process.env.EMAIL_USER || '';
    this.emailPass = process.env.EMAIL_PASS || '';
    this.emailFrom = process.env.EMAIL_FROM || '';
    this.appUrl = process.env.APP_URL || 'http://localhost:3000';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    this.rateLimitWindowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
    this.rateLimitMaxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
  }

  /**
   * Validate required environment variables
   * Throws error if critical variables are missing
   */
  validate(): void {
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
  }

  /**
   * Check if the application is running in production mode
   */
  isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  /**
   * Check if the application is running in development mode
   */
  isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }
}

// Export a singleton instance
export const config = new EnvironmentConfig();