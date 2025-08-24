import { UserRegistrationDTO, UserLoginDTO, UserResponseDTO } from '../dtos';

/**
 * Application service for authentication operations
 * This service acts as a facade for the authentication use cases
 */
export class AuthService {
  constructor(
    private readonly registerUserUseCase: any, // Will be properly typed when we implement DI
    private readonly loginUserUseCase: any,
    private readonly verifyEmailUseCase: any,
    private readonly resendVerificationUseCase: any,
    private readonly refreshTokenUseCase: any,
    private readonly logoutUseCase: any,
    private readonly logoutAllDevicesUseCase: any,
    private readonly getUserProfileUseCase: any,
    private readonly requestPasswordResetUseCase: any,
    private readonly resetPasswordUseCase: any
  ) {}

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise<UserResponseDTO> - Created user data
   */
  async registerUser(userData: UserRegistrationDTO): Promise<UserResponseDTO> {
    return this.registerUserUseCase.execute(userData);
  }

  /**
   * Login user
   * @param loginData - User login data
   * @returns Promise<{ user: UserResponseDTO; tokens: { accessToken: string; refreshToken: string; expiresIn: number } }> - User data and tokens
   */
  async loginUser(loginData: UserLoginDTO): Promise<{ 
    user: UserResponseDTO; 
    tokens: { accessToken: string; refreshToken: string; expiresIn: number } 
  }> {
    return this.loginUserUseCase.execute(loginData);
  }

  /**
   * Verify user email
   * @param token - Email verification token
   * @returns Promise<UserResponseDTO> - Updated user data
   */
  async verifyEmail(token: string): Promise<UserResponseDTO> {
    return this.verifyEmailUseCase.execute(token);
  }

  /**
   * Resend verification email
   * @param email - User's email address
   * @returns Promise<void>
   */
  async resendVerificationEmail(email: string): Promise<void> {
    return this.resendVerificationUseCase.execute(email);
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Refresh token
   * @returns Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> - New tokens
   */
  async refreshToken(refreshToken: string): Promise<{ 
    accessToken: string; 
    refreshToken: string; 
    expiresIn: number 
  }> {
    return this.refreshTokenUseCase.execute(refreshToken);
  }

  /**
   * Logout user (invalidate refresh token)
   * @param userId - User ID
   * @param refreshToken - Refresh token to invalidate
   * @returns Promise<void>
   */
  async logout(userId: string, refreshToken: string): Promise<void> {
    return this.logoutUseCase.execute(userId, refreshToken);
  }

  /**
   * Logout user from all devices (clear all refresh tokens)
   * @param userId - User ID
   * @returns Promise<void>
   */
  async logoutAllDevices(userId: string): Promise<void> {
    return this.logoutAllDevicesUseCase.execute(userId);
  }

  /**
   * Get user profile by ID
   * @param userId - User ID
   * @returns Promise<UserResponseDTO> - User profile data
   */
  async getUserProfile(userId: string): Promise<UserResponseDTO> {
    return this.getUserProfileUseCase.execute(userId);
  }

  /**
   * Request password reset
   * @param email - User email
   * @returns Promise<void>
   */
  async requestPasswordReset(email: string): Promise<void> {
    return this.requestPasswordResetUseCase.execute(email);
  }

  /**
   * Reset password
   * @param token - Password reset token
   * @param newPassword - New password
   * @returns Promise<UserResponseDTO> - Updated user data
   */
  async resetPassword(token: string, newPassword: string): Promise<UserResponseDTO> {
    return this.resetPasswordUseCase.execute(token, newPassword);
  }
}