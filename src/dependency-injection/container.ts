import { AuthService } from '../application/services/AuthService';
import { MongoUserRepository } from '../infrastructure/persistence/repositories/MongoUserRepository';
import { EmailService } from '../infrastructure/services/EmailService';
import { TokenService } from '../infrastructure/services/TokenService';
import { AuthController } from '../presentation/controllers/AuthController';
import { AuthMiddleware } from '../presentation/middleware/AuthMiddleware';
import { AuthRoutes } from '../presentation/routes/auth.routes';

/**
 * Dependency Injection Container
 * Manages the creation and wiring of application dependencies
 */
export class DIContainer {
  private static instance: DIContainer;
  
  // Repositories
  private userRepository: MongoUserRepository;
  
  // Services
  private emailService: EmailService;
  private tokenService: TokenService;
  private authService: AuthService;
  
  // Presentation layer
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;
  private authRoutes: AuthRoutes;

  private constructor() {
    // Initialize infrastructure layer
    this.userRepository = new MongoUserRepository();
    this.emailService = new EmailService();
    this.tokenService = new TokenService();
    
    // Initialize application layer
    // Note: In a real implementation, we would inject the use cases here
    // For now, we're using a simplified approach with the AuthService facade
    this.authService = new AuthService(
      null as any, // RegisterUserUseCase
      null as any, // LoginUserUseCase
      null as any, // VerifyEmailUseCase
      null as any, // ResendVerificationUseCase
      null as any, // RefreshTokenUseCase
      null as any, // LogoutUseCase
      null as any, // LogoutAllDevicesUseCase
      null as any, // GetUserProfileUseCase
      null as any, // RequestPasswordResetUseCase
      null as any  // ResetPasswordUseCase
    );
    
    // Initialize presentation layer
    this.authController = new AuthController(this.authService);
    this.authMiddleware = new AuthMiddleware(this.authService);
    this.authRoutes = new AuthRoutes(this.authController, this.authMiddleware);
  }

  /**
   * Get singleton instance of the container
   * @returns DIContainer instance
   */
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Repository getters
  getUserRepository(): MongoUserRepository {
    return this.userRepository;
  }

  // Service getters
  getEmailService(): EmailService {
    return this.emailService;
  }

  getTokenService(): TokenService {
    return this.tokenService;
  }

  getAuthService(): AuthService {
    return this.authService;
  }

  // Presentation layer getters
  getAuthController(): AuthController {
    return this.authController;
  }

  getAuthMiddleware(): AuthMiddleware {
    return this.authMiddleware;
  }

  getAuthRoutes(): AuthRoutes {
    return this.authRoutes;
  }
}