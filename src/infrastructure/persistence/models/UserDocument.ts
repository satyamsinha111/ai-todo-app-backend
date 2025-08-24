import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../../domain/entities/User';

// Define the interface for User document with methods
// Omit 'id' from User interface to avoid conflict with Document's _id
export interface IUserDocument extends Omit<User, 'id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  addRefreshToken(refreshToken: string): void;
  removeRefreshToken(refreshToken: string): void;
  hasRefreshToken(refreshToken: string): boolean;
  clearRefreshTokens(): void;
}

/**
 * User Schema
 * Defines the structure and behavior of user documents in MongoDB
 */
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters'],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    default: null,
  },
  emailVerificationExpires: {
    type: Date,
    default: null,
  },
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
  refreshTokens: [{
    type: String,
    default: [],
  }],
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
  toJSON: {
    transform: function(doc, ret: any) {
      // Remove sensitive fields when converting to JSON
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpires;
      delete ret.refreshTokens;
      return ret;
    },
  },
});

/**
 * Index for better query performance
 */
userSchema.index({ email: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });

/**
 * Pre-save middleware to hash password before saving
 * Only hash the password if it has been modified (or is new)
 */
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Instance method to compare password with hashed password
 * @param candidatePassword - Password to compare
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * Instance method to add refresh token to user's refresh tokens array
 * @param refreshToken - Refresh token to add
 */
userSchema.methods.addRefreshToken = function(refreshToken: string): void {
  this.refreshTokens.push(refreshToken);
};

/**
 * Instance method to remove refresh token from user's refresh tokens array
 * @param refreshToken - Refresh token to remove
 */
userSchema.methods.removeRefreshToken = function(refreshToken: string): void {
  this.refreshTokens = this.refreshTokens.filter((token: string) => token !== refreshToken);
};

/**
 * Instance method to check if user has a specific refresh token
 * @param refreshToken - Refresh token to check
 * @returns boolean - True if token exists, false otherwise
 */
userSchema.methods.hasRefreshToken = function(refreshToken: string): boolean {
  return this.refreshTokens.includes(refreshToken);
};

/**
 * Instance method to clear all refresh tokens (useful for logout)
 */
userSchema.methods.clearRefreshTokens = function(): void {
  this.refreshTokens = [];
};

// Import bcrypt here to avoid circular dependencies
import bcrypt from 'bcryptjs';

// Create and export the User model
export const UserDocument = mongoose.model<IUserDocument>('User', userSchema);