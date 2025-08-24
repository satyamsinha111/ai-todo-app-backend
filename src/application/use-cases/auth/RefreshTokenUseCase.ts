import { UserRepository } from '../../../domain/interfaces/repositories';
import { TokenService } from '../../../domain/interfaces/services';
import { UserNotFoundException } from '../../../domain/exceptions';

/**
 * Use case for refreshing access token using refresh token
 */
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService
  ) {}

  /**
   * Execute the refresh token use case
   * @param refreshToken - Refresh token
   * @returns Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> - New tokens
   */
  async execute(refreshToken: string): Promise<{ 
    accessToken: string; 
    refreshToken: string; 
    expiresIn: number 
  }> {
    // Verify refresh token
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);

    // Find user
    const user = await this.userRepository.findById(decoded.userId);
    if (!user) {
      throw new UserNotFoundException('User not found');
    }

    // Check if refresh token exists in user's refresh tokens array
    const hasToken = await this.userRepository.hasRefreshToken(user.id, refreshToken);
    if (!hasToken) {
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens
    const newTokens = this.tokenService.generateTokens(user.id, user.email);

    // Remove old refresh token and add new one
    await this.userRepository.removeRefreshToken(user.id, refreshToken);
    await this.userRepository.addRefreshToken(user.id, newTokens.refreshToken);

    return newTokens;
  }
}