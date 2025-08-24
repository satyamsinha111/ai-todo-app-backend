import { UserResponseDTO } from '../../dtos';
import { UserRepository } from '../../../domain/interfaces/repositories';
import { UserNotFoundException } from '../../../domain/exceptions';

/**
 * Use case for resetting password
 */
export class ResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Execute the reset password use case
   * @param token - Password reset token
   * @param newPassword - New password
   * @returns Promise<UserResponseDTO> - Updated user data
   */
  async execute(token: string, newPassword: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findByPasswordResetToken(token);
    if (!user) {
      throw new UserNotFoundException('Invalid or expired reset token');
    }

    // Update password
    const updatedUser = await this.userRepository.update(user.id, {
      password: newPassword,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });

    if (!updatedUser) {
      throw new UserNotFoundException('User not found');
    }

    // Clear all refresh tokens for security
    await this.userRepository.clearRefreshTokens(user.id);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      isEmailVerified: updatedUser.isEmailVerified,
      createdAt: updatedUser.createdAt,
    };
  }
}