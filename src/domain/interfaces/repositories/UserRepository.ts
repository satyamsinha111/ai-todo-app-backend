import { User, UserRegistration, UserResponse } from '../../entities/User';

/**
 * Repository interface for User entity
 * Defines the contract for user data access operations
 */
export interface UserRepository {
  /**
   * Create a new user
   * @param userData - User registration data
   * @returns Promise<User> - Created user
   */
  create(userData: UserRegistration): Promise<User>;

  /**
   * Find user by email
   * @param email - User email
   * @returns Promise<User | null> - User if found, null otherwise
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find user by ID
   * @param id - User ID
   * @returns Promise<User | null> - User if found, null otherwise
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find user by verification token
   * @param token - Verification token
   * @returns Promise<User | null> - User if found, null otherwise
   */
  findByVerificationToken(token: string): Promise<User | null>;

  /**
   * Find user by password reset token
   * @param token - Password reset token
   * @returns Promise<User | null> - User if found, null otherwise
   */
  findByPasswordResetToken(token: string): Promise<User | null>;

  /**
   * Update user
   * @param id - User ID
   * @param updates - User updates
   * @returns Promise<User | null> - Updated user if found, null otherwise
   */
  update(id: string, updates: Partial<User>): Promise<User | null>;

  /**
   * Add refresh token to user
   * @param userId - User ID
   * @param refreshToken - Refresh token to add
   * @returns Promise<User | null> - Updated user if found, null otherwise
   */
  addRefreshToken(userId: string, refreshToken: string): Promise<User | null>;

  /**
   * Remove refresh token from user
   * @param userId - User ID
   * @param refreshToken - Refresh token to remove
   * @returns Promise<User | null> - Updated user if found, null otherwise
   */
  removeRefreshToken(userId: string, refreshToken: string): Promise<User | null>;

  /**
   * Clear all refresh tokens for user
   * @param userId - User ID
   * @returns Promise<User | null> - Updated user if found, null otherwise
   */
  clearRefreshTokens(userId: string): Promise<User | null>;

  /**
   * Check if user has a specific refresh token
   * @param userId - User ID
   * @param refreshToken - Refresh token to check
   * @returns Promise<boolean> - True if user has the token, false otherwise
   */
  hasRefreshToken(userId: string, refreshToken: string): Promise<boolean>;
}