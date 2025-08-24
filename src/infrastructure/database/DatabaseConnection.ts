import mongoose from 'mongoose';
import { config } from '../config';

/**
 * MongoDB connection options
 */
const connectionOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

/**
 * Database connection manager
 */
export class DatabaseConnection {
  /**
   * Connect to MongoDB database
   * @returns Promise<void>
   */
  static async connect(): Promise<void> {
    try {
      // Set mongoose options
      mongoose.set('strictQuery', false);
      
      // Connect to MongoDB
      await mongoose.connect(config.mongoUri, connectionOptions);
      
      console.log('✅ Successfully connected to MongoDB');
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  /**
   * Disconnect from MongoDB database
   * @returns Promise<void>
   */
  static async disconnect(): Promise<void> {
    try {
      await mongoose.connection.close();
      console.log('✅ Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
    }
  }

  /**
   * Check if database is connected
   * @returns boolean
   */
  static isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Get database connection status
   * @returns string
   */
  static getStatus(): string {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
  }
}