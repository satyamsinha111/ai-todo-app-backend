/**
 * Service interface for email operations
 * Defines the contract for email sending functionality
 */
export interface EmailService {
  /**
   * Send verification email to user
   * @param email - Recipient email address
   * @param firstName - User's first name
   * @param verificationToken - Email verification token
   * @returns Promise<void>
   */
  sendVerificationEmail(email: string, firstName: string, verificationToken: string): Promise<void>;

  /**
   * Send password reset email to user
   * @param email - Recipient email address
   * @param firstName - User's first name
   * @param resetToken - Password reset token
   * @returns Promise<void>
   */
  sendPasswordResetEmail(email: string, firstName: string, resetToken: string): Promise<void>;
}