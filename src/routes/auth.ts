import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   responses:
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             success: false
 *             message: Validation failed
 *             error: "email: Please provide a valid email address"
 *     ConflictError:
 *       description: Resource conflict error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             success: false
 *             message: User with this email already exists
 *     AuthenticationError:
 *       description: Authentication error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             success: false
 *             message: Invalid email or password
 *     UnauthorizedError:
 *       description: Unauthorized error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *             success: false
 *             message: Authentication required
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email verification
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *           example:
 *             email: "user@example.com"
 *             password: "SecurePass123!"
 *             firstName: "John"
 *             lastName: "Doe"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: "User registered successfully. Please check your email to verify your account."
 *               data:
 *                 user:
 *                   id: "507f1f77bcf86cd799439011"
 *                   email: "user@example.com"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   isEmailVerified: false
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/ConflictError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and return access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *           example:
 *             email: "user@example.com"
 *             password: "SecurePass123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         tokens:
 *                           $ref: '#/components/schemas/Tokens'
 *             example:
 *               success: true
 *               message: "Login successful"
 *               data:
 *                 user:
 *                   id: "507f1f77bcf86cd799439011"
 *                   email: "user@example.com"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   isEmailVerified: true
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *                 tokens:
 *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   expiresIn: 900
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/AuthenticationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Verify email address
 *     description: Verify user email address using verification token
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *         example: "abc123def456ghi789"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: "Email verified successfully"
 *               data:
 *                 user:
 *                   id: "507f1f77bcf86cd799439011"
 *                   email: "user@example.com"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   isEmailVerified: true
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         description: Invalid or expired verification token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid or expired verification token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/verify-email', AuthController.verifyEmail);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend verification email
 *     description: Resend email verification link to user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendVerificationRequest'
 *           example:
 *             email: "user@example.com"
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Verification email sent successfully"
 *       400:
 *         description: Email is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Email is required"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/resend-verification', AuthController.resendVerification);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Get new access token using refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *           example:
 *             refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         tokens:
 *                           $ref: '#/components/schemas/Tokens'
 *             example:
 *               success: true
 *               message: "Token refreshed successfully"
 *               data:
 *                 tokens:
 *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   expiresIn: 900
 *       400:
 *         description: Refresh token is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Refresh token is required"
 *       401:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid refresh token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/refresh', AuthController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidate refresh token for current device
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogoutRequest'
 *           example:
 *             refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Logged out successfully"
 *       400:
 *         description: Refresh token is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Refresh token is required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/logout', authenticateToken, AuthController.logout);

/**
 * @swagger
 * /auth/logout-all:
 *   post:
 *     summary: Logout from all devices
 *     description: Invalidate all refresh tokens for the user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Logged out from all devices successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/logout-all', authenticateToken, AuthController.logoutAllDevices);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Send a password reset email to the user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *                 example: "user@example.com"
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "If an account with that email exists, a password reset email has been sent"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/forgot-password', AuthController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset password using reset token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token from email
 *                 example: "abc123def456"
 *               newPassword:
 *                 type: string
 *                 description: New password (minimum 8 characters)
 *                 example: "NewSecurePass123!"
 *             required:
 *               - token
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: "Password reset successfully"
 *               data:
 *                 user:
 *                   id: "507f1f77bcf86cd799439011"
 *                   email: "user@example.com"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   isEmailVerified: true
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/reset-password', AuthController.resetPassword);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve current user profile information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: "Profile retrieved successfully"
 *               data:
 *                 user:
 *                   id: "507f1f77bcf86cd799439011"
 *                   email: "user@example.com"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   isEmailVerified: true
 *                   createdAt: "2024-01-01T00:00:00.000Z"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/profile', authenticateToken, AuthController.getProfile);

/**
 * @swagger
 * /auth/health:
 *   get:
 *     summary: Authentication service health check
 *     description: Check if the authentication service is healthy
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Authentication service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                         service:
 *                           type: string
 *                         version:
 *                           type: string
 *             example:
 *               success: true
 *               message: "Authentication service is healthy"
 *               data:
 *                 timestamp: "2024-01-01T00:00:00.000Z"
 *                 service: "auth"
 *                 version: "1.0.0"
 */
router.get('/health', AuthController.healthCheck);

export default router;
