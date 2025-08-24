import { UserRepository } from '../../../domain/interfaces/repositories';
import { User, UserRegistration } from '../../../domain/entities/User';
import { IUserDocument, UserDocument } from '../models/UserDocument';
import { UserNotFoundException } from '../../../domain/exceptions/UserNotFoundException';

/**
 * MongoDB implementation of UserRepository
 */
export class MongoUserRepository implements UserRepository {
  /**
   * Create a new user
   * @param userData - User registration data
   * @returns Promise<User> - Created user
   */
  async create(userData: UserRegistration): Promise<User> {
    const userDoc = new UserDocument({
      ...userData,
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined,
    });
    const savedUser = await userDoc.save();
    
    return this.mapToDomainEntity(savedUser);
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns Promise<User | null> - User if found, null otherwise
   */
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserDocument.findOne({ email: email.toLowerCase() });
    return userDoc ? this.mapToDomainEntity(userDoc) : null;
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns Promise<User | null> - User if found, null otherwise
   */
  async findById(id: string): Promise<User | null> {
    const userDoc = await UserDocument.findById(id);
    return userDoc ? this.mapToDomainEntity(userDoc) : null;
  }

  /**
   * Find user by verification token
   * @param token - Verification token
   * @returns Promise<User | null> - User if found, null otherwise
   */
  async findByVerificationToken(token: string): Promise<User | null> {
    const userDoc = await UserDocument.findOne({ 
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });
    return userDoc ? this.mapToDomainEntity(userDoc) : null;
  }

  /**
   * Find user by password reset token
   * @param token - Password reset token
   * @returns Promise<User | null> - User if found, null otherwise
   */
  async findByPasswordResetToken(token: string): Promise<User | null> {
    const userDoc = await UserDocument.findOne({ 
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    });
    return userDoc ? this.mapToDomainEntity(userDoc) : null;
  }

  /**
   * Update user
   * @param id - User ID
   * @param updates - User updates
   * @returns Promise<User | null> - Updated user if found, null otherwise
   */
  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const userDoc = await UserDocument.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    return userDoc ? this.mapToDomainEntity(userDoc) : null;
  }

  /**
   * Add refresh token to user
   * @param userId - User ID
   * @param refreshToken - Refresh token to add
   * @returns Promise<User | null> - Updated user if found, null otherwise
   */
  async addRefreshToken(userId: string, refreshToken: string): Promise<User | null> {
    const userDoc = await UserDocument.findById(userId);
    if (!userDoc) return null;
    
    userDoc.addRefreshToken(refreshToken);
    const savedUser = await userDoc.save();
    return this.mapToDomainEntity(savedUser);
  }

  /**
   * Remove refresh token from user
   * @param userId - User ID
   * @param refreshToken - Refresh token to remove
   * @returns Promise<User | null> - Updated user if found, null otherwise
   */
  async removeRefreshToken(userId: string, refreshToken: string): Promise<User | null> {
    const userDoc = await UserDocument.findById(userId);
    if (!userDoc) return null;
    
    userDoc.removeRefreshToken(refreshToken);
    const savedUser = await userDoc.save();
    return this.mapToDomainEntity(savedUser);
  }

  /**
   * Clear all refresh tokens for user
   * @param userId - User ID
   * @returns Promise<User | null> - Updated user if found, null otherwise
   */
  async clearRefreshTokens(userId: string): Promise<User | null> {
    const userDoc = await UserDocument.findById(userId);
    if (!userDoc) return null;
    
    userDoc.clearRefreshTokens();
    const savedUser = await userDoc.save();
    return this.mapToDomainEntity(savedUser);
  }

  /**
   * Check if user has a specific refresh token
   * @param userId - User ID
   * @param refreshToken - Refresh token to check
   * @returns Promise<boolean> - True if user has the token, false otherwise
   */
  async hasRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const userDoc = await UserDocument.findById(userId);
    if (!userDoc) return false;
    
    return userDoc.hasRefreshToken(refreshToken);
  }

  /**
   * Map Mongoose document to domain entity
   * @param userDoc - Mongoose user document
   * @returns User - Domain user entity
   */
  private mapToDomainEntity(userDoc: IUserDocument): User {
    return {
      id: (userDoc as any)._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      isEmailVerified: userDoc.isEmailVerified,
      emailVerificationToken: userDoc.emailVerificationToken,
      emailVerificationExpires: userDoc.emailVerificationExpires,
      passwordResetToken: userDoc.passwordResetToken,
      passwordResetExpires: userDoc.passwordResetExpires,
      refreshTokens: userDoc.refreshTokens,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    };
  }
}