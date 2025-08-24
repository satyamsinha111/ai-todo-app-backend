import App from './app';

/**
 * Main application entry point
 * Starts the Express server with all configured middleware and routes
 */
async function bootstrap(): Promise<void> {
  try {
    const app = new App();
    await app.start();
  } catch (error) {
    console.error('❌ Failed to bootstrap application:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
bootstrap();
