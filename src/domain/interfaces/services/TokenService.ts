/**
 * Service interface for token operations
 * Defines the contract for JWT token generation and verification
 */
export interface TokenService {
  /**
   * Generate JWT access token
   * @param userId - User's unique identifier
   * @param email - User's email address
   * @returns JWT access token
   */
  generateAccessToken(userId: string, email: string): string;

  /**
   * Generate JWT refresh token
   * @param userId - User's unique identifier
   * @param email - User's email address
   * @returns JWT refresh token
   */
  generateRefreshToken(userId: string, email: string): string;

  /**
   * Generate both access and refresh tokens
   * @param userId - User's unique identifier
   * @param email - User's email address
   * @returns Object containing access token, refresh token, and expiration time
   */
  generateTokens(userId: string, email: string): { accessToken: string; refreshToken: string; expiresIn: number };

  /**
   * Verify JWT access token
   * @param token - JWT access token to verify
   * @returns Decoded token payload
   */
  verifyAccessToken(token: string): any;

  /**
   * Verify JWT refresh token
   * @param token - JWT refresh token to verify
   * @returns Decoded token payload
   */
  verifyRefreshToken(token: string): any;

  /**
   * Decode JWT token without verification (for debugging purposes)
   * @param token - JWT token to decode
   * @returns Decoded token payload (not verified)
   */
  decodeToken(token: string): any;

  /**
   * Check if a token is expired
   * @param token - JWT token to check
   * @returns True if token is expired, false otherwise
   */
  isTokenExpired(token: string): boolean;
}