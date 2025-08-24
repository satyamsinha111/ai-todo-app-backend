import { UserRepository } from '../../../domain/interfaces/repositories';
import { EmailService } from '../../../domain/interfaces/services';
import * as crypto from 'crypto';

/**
 * Use case for requesting password reset
 */
export class RequestPasswordResetUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
  ) {}

  /**
   * Execute the request password reset use case
   * @param email - User email
   * @returns Promise<void>
   */
  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not for security
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    // Update user with reset token
    const updatedUser = await this.userRepository.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    // Send password reset email
    await this.emailService.sendPasswordResetEmail(
      updatedUser.email,
      updatedUser.firstName,
      resetToken
    );
  }
}