import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware';

/**
 * Authentication routes
 */
export class AuthRoutes {
  public router: Router;
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor(authController: AuthController, authMiddleware: AuthMiddleware) {
    this.router = Router();
    this.authController = authController;
    this.authMiddleware = authMiddleware;
    this.initializeRoutes();
  }

  /**
   * Initialize all authentication routes
   */
  private initializeRoutes(): void {
    // Public routes
    this.router.post('/register', this.authController.register);
    this.router.post('/login', this.authController.login);
    this.router.get('/verify-email', this.authController.verifyEmail);
    this.router.post('/resend-verification', this.authController.resendVerification);
    this.router.post('/refresh', this.authController.refreshToken);
    this.router.post('/forgot-password', this.authController.forgotPassword);
    this.router.post('/reset-password', this.authController.resetPassword);
    
    // Protected routes
    this.router.post('/logout', 
      this.authMiddleware.authenticateToken, 
      this.authController.logout
    );
    
    this.router.post('/logout-all', 
      this.authMiddleware.authenticateToken, 
      this.authController.logoutAllDevices
    );
    
    this.router.get('/profile', 
      this.authMiddleware.authenticateToken, 
      this.authController.getProfile
    );
    
    // Health check
    this.router.get('/health', this.authController.healthCheck);
  }
}