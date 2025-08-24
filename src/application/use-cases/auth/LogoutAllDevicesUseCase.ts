import { UserRepository } from '../../../domain/interfaces/repositories';
import { UserNotFoundException } from '../../../domain/exceptions';

/**
 * Use case for logging out a user from all devices (clear all refresh tokens)
 */
export class LogoutAllDevicesUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Execute the logout all devices use case
   * @param userId - User ID
   * @returns Promise<void>
   */
  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException('User not found');
    }

    // Clear all refresh tokens
    await this.userRepository.clearRefreshTokens(userId);
  }
}