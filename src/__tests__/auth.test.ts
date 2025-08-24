import { AuthService } from '../services/authService';

// Mock the modules
jest.mock('../models/User');
jest.mock('../utils/jwt');
jest.mock('../utils/email');

// Import mocked modules
const { User } = require('../models/User');
const { generateTokens } = require('../utils/jwt');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);

      // Mock User constructor and save
      const mockUser = {
        _id: 'user123',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isEmailVerified: false,
        createdAt: new Date(),
        save: jest.fn().mockResolvedValue(true),
      };
      User.mockImplementation(() => mockUser);

      const result = await AuthService.registerUser(userData);

      expect(result).toEqual({
        id: 'user123',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isEmailVerified: false,
        createdAt: mockUser.createdAt,
      });
    });

    it('should throw ConflictError if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Mock User.findOne to return existing user
      User.findOne.mockResolvedValue({ email: userData.email });

      await expect(AuthService.registerUser(userData)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const mockUser = {
        _id: 'user123',
        email: loginData.email,
        firstName: 'John',
        lastName: 'Doe',
        isEmailVerified: true,
        createdAt: new Date(),
        comparePassword: jest.fn().mockResolvedValue(true),
        addRefreshToken: jest.fn(),
        save: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);
      generateTokens.mockReturnValue({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        expiresIn: 900,
      });

      const result = await AuthService.loginUser(loginData);

      expect(result.user).toEqual({
        id: 'user123',
        email: loginData.email,
        firstName: 'John',
        lastName: 'Doe',
        isEmailVerified: true,
        createdAt: mockUser.createdAt,
      });
      expect(result.tokens).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        expiresIn: 900,
      });
    });

    it('should throw AuthenticationError with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      // Mock User.findOne to return user
      const mockUser = {
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);

      await expect(AuthService.loginUser(loginData)).rejects.toThrow('Invalid email or password');
    });
  });
});
