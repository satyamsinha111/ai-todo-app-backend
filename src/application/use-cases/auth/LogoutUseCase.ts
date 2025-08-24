import { UserRepository } from '../../../domain/interfaces/repositories';
import { UserNotFoundException } from '../../../domain/exceptions';

/**
 * Use case for logging out a user (invalidate refresh token)
 */
export class LogoutUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Execute the logout use case
   * @param userId - User ID
   * @param refreshToken - Refresh token to invalidate
   * @returns Promise<void>
   */
  async execute(userId: string, refreshToken: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException('User not found');
    }

    // Remove the specific refresh token
    await this.userRepository.removeRefreshToken(userId, refreshToken);
  }
}