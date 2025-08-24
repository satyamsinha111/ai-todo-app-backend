import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { config, EnvironmentConfig } from './infrastructure/config';
import { specs } from './config/swagger';
import { DatabaseConnection } from './infrastructure/database';
import { globalErrorHandler } from './utils/errors';
import { DIContainer } from './dependency-injection';

/**
 * Express Application
 * Main application setup with middleware and route configuration
 */
class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize all middleware
   */
  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: [config.frontendUrl, 'http://localhost:3001'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimitWindowMs, // 15 minutes
      max: config.rateLimitMaxRequests, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static file serving
    this.app.use(express.static(path.join(__dirname, '../public')));

    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Initialize all routes
   */
  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
      });
    });

    // Swagger API documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'AI-Powered Todo App API Documentation',
      customfavIcon: '/favicon.ico',
      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true,
      },
    }));

    // OpenAPI specification JSON endpoint
    this.app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(specs);
    });

    // HTML page routes
    this.app.get('/pages/email-verification-success', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/pages/email-verification-success.html'));
    });

    this.app.get('/pages/email-verification-failed', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/pages/email-verification-failed.html'));
    });

    this.app.get('/pages/password-reset-success', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/pages/password-reset-success.html'));
    });

    this.app.get('/pages/password-reset-failed', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/pages/password-reset-failed.html'));
    });
    
    // API routes
    const container = DIContainer.getInstance();
    this.app.use('/api/auth', container.getAuthRoutes().router);

    // 404 handler for undefined routes
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
      });
    });
  }

  /**
   * Initialize error handling middleware
   */
  private initializeErrorHandling(): void {
    // Global error handler (must be last)
    this.app.use(globalErrorHandler);
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Validate configuration
      config.validate();

      // Connect to database
      await DatabaseConnection.connect();

      // Start server
      this.app.listen(config.port, () => {
        console.log(`🚀 Server is running on port ${config.port}`);
        console.log(`📊 Environment: ${config.nodeEnv}`);
        console.log(`🔗 API Base URL: http://localhost:${config.port}/api`);
        console.log(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
        console.log(`🏥 Health Check: http://localhost:${config.port}/health`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}

export default App;
