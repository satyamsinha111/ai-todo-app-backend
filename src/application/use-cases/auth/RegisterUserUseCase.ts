import { UserRegistrationDTO, UserResponseDTO } from '../../dtos';
import { UserRepository } from '../../../domain/interfaces/repositories';
import { EmailService } from '../../../domain/interfaces/services';
import { UserNotFoundException } from '../../../domain/exceptions';

/**
 * Use case for registering a new user
 */
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
  ) {}

  /**
   * Execute the register user use case
   * @param userData - User registration data
   * @returns Promise<UserResponseDTO> - Registered user data
   */
  async execute(userData: UserRegistrationDTO): Promise<UserResponseDTO> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new UserNotFoundException('User with this email already exists');
    }

    // Create new user
    const user = await this.userRepository.create(userData);

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.firstName,
        user.emailVerificationToken!
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't throw error here, user can request email verification later
    }

    // Return user data without sensitive information
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