import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IJWTPayload, ITokenResponse } from '../types';
import { AuthenticationError } from './errors';

/**
 * Generate JWT access token
 * @param userId - User's unique identifier
 * @param email - User's email address
 * @returns JWT access token
 */
export const generateAccessToken = (userId: string, email: string): string => {
  const payload: IJWTPayload = {
    userId,
    email,
    type: 'access',
  };

  return jwt.sign(payload, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpiresIn,
  } as jwt.SignOptions);
};

/**
 * Generate JWT refresh token
 * @param userId - User's unique identifier
 * @param email - User's email address
 * @returns JWT refresh token
 */
export const generateRefreshToken = (userId: string, email: string): string => {
  const payload: IJWTPayload = {
    userId,
    email,
    type: 'refresh',
  };

  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  } as jwt.SignOptions);
};

/**
 * Generate both access and refresh tokens
 * @param userId - User's unique identifier
 * @param email - User's email address
 * @returns Object containing access token, refresh token, and expiration time
 */
export const generateTokens = (userId: string, email: string): ITokenResponse => {
  const accessToken = generateAccessToken(userId, email);
  const refreshToken = generateRefreshToken(userId, email);

  // Calculate expiration time in seconds
  const expiresIn = parseInt(config.jwtAccessExpiresIn.replace(/[^0-9]/g, '')) * 60;

  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
};

/**
 * Verify JWT access token
 * @param token - JWT access token to verify
 * @returns Decoded token payload
 * @throws AuthenticationError if token is invalid or expired
 */
export const verifyAccessToken = (token: string): IJWTPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtAccessSecret) as IJWTPayload;
    
    if (decoded.type !== 'access') {
      throw new AuthenticationError('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Access token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid access token');
    }
    throw error;
  }
};

/**
 * Verify JWT refresh token
 * @param token - JWT refresh token to verify
 * @returns Decoded token payload
 * @throws AuthenticationError if token is invalid or expired
 */
export const verifyRefreshToken = (token: string): IJWTPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtRefreshSecret) as IJWTPayload;
    
    if (decoded.type !== 'refresh') {
      throw new AuthenticationError('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Refresh token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Decode JWT token without verification (for debugging purposes)
 * @param token - JWT token to decode
 * @returns Decoded token payload (not verified)
 */
export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};

/**
 * Check if a token is expired
 * @param token - JWT token to check
 * @returns True if token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};
