import { UserResponseDTO } from '../../dtos';
import { UserRepository } from '../../../domain/interfaces/repositories';
import { UserNotFoundException } from '../../../domain/exceptions';

/**
 * Use case for getting user profile
 */
export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Execute the get user profile use case
   * @param userId - User ID
   * @returns Promise<UserResponseDTO> - User profile data
   */
  async execute(userId: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    };
  }
}