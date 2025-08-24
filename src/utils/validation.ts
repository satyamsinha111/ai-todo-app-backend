import { z } from 'zod';
import { ValidationError } from './errors';

/**
 * User registration validation schema
 */
export const userRegistrationSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
});

/**
 * User login validation schema
 */
export const userLoginSchema = z.object({
  email: z
    .string()
    .email('Please provide a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

/**
 * Email verification validation schema
 */
export const emailVerificationSchema = z.object({
  token: z
    .string()
    .min(1, 'Verification token is required'),
});

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token is required'),
});

/**
 * Generic validation function that uses Zod schemas
 * Throws ValidationError if validation fails
 */
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      throw new ValidationError(errorMessages);
    }
    throw new ValidationError('Validation failed');
  }
};

/**
 * Safe validation function that returns validation result instead of throwing
 */
export const safeValidate = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

/**
 * Validate MongoDB ObjectId format
 */
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

/**
 * Pagination validation schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

/**
 * Search query validation schema
 */
export const searchQuerySchema = z.object({
  q: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});
