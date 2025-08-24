import { UserResponseDTO } from '../../dtos';
import { UserRepository } from '../../../domain/interfaces/repositories';
import { UserNotFoundException } from '../../../domain/exceptions';

/**
 * Use case for verifying a user's email
 */
export class VerifyEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Execute the verify email use case
   * @param token - Email verification token
   * @returns Promise<UserResponseDTO> - Updated user data
   */
  async execute(token: string): Promise<UserResponseDTO> {
    // Find user by verification token
    const user = await this.userRepository.findByVerificationToken(token);
    if (!user) {
      throw new UserNotFoundException('Invalid or expired verification token');
    }

    // Mark email as verified and clear verification token
    const updatedUser = await this.userRepository.update(user.id, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined,
    });

    if (!updatedUser) {
      throw new UserNotFoundException('User not found');
    }

    // Return updated user data
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