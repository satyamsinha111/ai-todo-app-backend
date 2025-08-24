import { UserLoginDTO, UserResponseDTO } from '../../dtos';
import { UserRepository } from '../../../domain/interfaces/repositories';
import { TokenService } from '../../../domain/interfaces/services';
import { InvalidCredentialsException } from '../../../domain/exceptions';
import * as bcrypt from 'bcryptjs';

/**
 * Use case for logging in a user
 */
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService
  ) {}

  /**
   * Execute the login user use case
   * @param loginData - User login data
   * @returns Promise<{ user: UserResponseDTO; tokens: { accessToken: string; refreshToken: string; expiresIn: number } }> - User data and tokens
   */
  async execute(loginData: UserLoginDTO): Promise<{ 
    user: UserResponseDTO; 
    tokens: { accessToken: string; refreshToken: string; expiresIn: number } 
  }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new InvalidCredentialsException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.tokenService.generateTokens(user.id, user.email);

    // Add refresh token to user's refresh tokens array
    await this.userRepository.addRefreshToken(user.id, tokens.refreshToken);

    // Return user data and tokens
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }
}