import { UserRepository } from '../../../domain/interfaces/repositories';
import { EmailService } from '../../../domain/interfaces/services';
import { UserNotFoundException } from '../../../domain/exceptions';
import * as crypto from 'crypto';

/**
 * Use case for resending email verification
 */
export class ResendVerificationUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
  ) {}

  /**
   * Execute the resend verification use case
   * @param email - User's email address
   * @returns Promise<void>
   */
  async execute(email: string): Promise<void> {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException('User not found');
    }

    if (user.isEmailVerified) {
      throw new Error('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Update user with new verification token
    const updatedUser = await this.userRepository.update(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    if (!updatedUser) {
      throw new UserNotFoundException('User not found');
    }

    // Send verification email
    await this.emailService.sendVerificationEmail(
      updatedUser.email,
      updatedUser.firstName,
      verificationToken
    );
  }
}