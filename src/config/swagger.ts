import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

/**
 * Swagger configuration options
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI-Powered Todo App API',
      version: '1.0.0',
      description: 'A comprehensive REST API for the AI-Powered Todo App with user authentication and management.',
      contact: {
        name: 'API Support',
        email: 'support@ai-todo-app.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `${config.appUrl}/api`,
        description: 'Development server',
      },
      {
        url: 'https://api.ai-todo-app.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token for authentication',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User unique identifier',
              example: '507f1f77bcf86cd799439011',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
            firstName: {
              type: 'string',
              description: 'User first name',
              example: 'John',
            },
            lastName: {
              type: 'string',
              description: 'User last name',
              example: 'Doe',
            },
            isEmailVerified: {
              type: 'boolean',
              description: 'Whether the user email is verified',
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
          required: ['id', 'email', 'firstName', 'lastName', 'isEmailVerified', 'createdAt'],
        },
                 UserRegistration: {
           type: 'object',
           properties: {
             email: {
               type: 'string',
               format: 'email',
               description: 'User email address (supports + for email aliases)',
               example: 'user+tag@example.com',
             },
            password: {
              type: 'string',
              description: 'User password (min 8 characters, must include uppercase, lowercase, number, and special character)',
              example: 'SecurePass123!',
              minLength: 8,
            },
            firstName: {
              type: 'string',
              description: 'User first name',
              example: 'John',
              maxLength: 50,
            },
            lastName: {
              type: 'string',
              description: 'User last name',
              example: 'Doe',
              maxLength: 50,
            },
          },
          required: ['email', 'password', 'firstName', 'lastName'],
        },
        UserLogin: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'SecurePass123!',
            },
          },
          required: ['email', 'password'],
        },
        Tokens: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              description: 'JWT access token (valid for 15 minutes)',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token (valid for 7 days)',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            expiresIn: {
              type: 'number',
              description: 'Access token expiration time in seconds',
              example: 900,
            },
          },
          required: ['accessToken', 'refreshToken', 'expiresIn'],
        },
        RefreshTokenRequest: {
          type: 'object',
          properties: {
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
          required: ['refreshToken'],
        },
        LogoutRequest: {
          type: 'object',
          properties: {
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token to invalidate',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
          required: ['refreshToken'],
        },
        ResendVerificationRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
            },
          },
          required: ['email'],
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Operation completed successfully',
            },
            data: {
              type: 'object',
              description: 'Response data (optional)',
            },
            error: {
              type: 'string',
              description: 'Error message (if success is false)',
            },
          },
          required: ['success', 'message'],
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Validation failed',
            },
            error: {
              type: 'string',
              description: 'Detailed error information',
              example: 'email: Please provide a valid email address',
            },
          },
          required: ['success', 'message'],
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Health',
        description: 'Health check and system status endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};

/**
 * Generate Swagger specification
 */
export const specs = swaggerJsdoc(options);
