import nodemailer from 'nodemailer';
import { EmailService as IEmailService } from '../../domain/interfaces/services/EmailService';
import { config } from '../../infrastructure/config';

/**
 * Nodemailer implementation of EmailService
 */
export class EmailService implements IEmailService {
  /**
   * Email transporter configuration
   * Uses environment variables for SMTP settings
   */
  private createTransporter() {
    return nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      secure: config.emailPort === 465, // true for 465, false for other ports
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });
  }

  /**
   * Email template for verification email
   * @param firstName - User's first name
   * @param verificationUrl - Email verification URL
   * @returns HTML email content
   */
  private createVerificationEmailTemplate(firstName: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            background-color: #4f46e5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to AI Todo App!</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center;color: white;">
            <a href="${verificationUrl}" class="button" style="color: white;">Verify Email Address</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4f46e5;">${verificationUrl}</p>
          
          <p>This link will expire in 24 hours for security reasons.</p>
          
          <p>If you didn't create an account with us, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 AI Todo App. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send verification email to user
   * @param email - Recipient email address
   * @param firstName - User's first name
   * @param verificationToken - Email verification token
   * @returns Promise<void>
   */
  async sendVerificationEmail(email: string, firstName: string, verificationToken: string): Promise<void> {
    try {
      const transporter = this.createTransporter();
      
      const verificationUrl = `${config.appUrl}/api/auth/verify-email?token=${verificationToken}`;
      const htmlContent = this.createVerificationEmailTemplate(firstName, verificationUrl);

      const mailOptions = {
        from: config.emailFrom,
        to: email,
        subject: 'Verify Your Email - AI Todo App',
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send password reset email to user
   * @param email - Recipient email address
   * @param firstName - User's first name
   * @param resetToken - Password reset token
   * @returns Promise<void>
   */
  async sendPasswordResetEmail(email: string, firstName: string, resetToken: string): Promise<void> {
    try {
      const transporter = this.createTransporter();
      
      const resetUrl = `${config.appUrl}/api/auth/reset-password?token=${resetToken}`;
      
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #dc2626;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background-color: #dc2626;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName},</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center;color: white;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #dc2626;">${resetUrl}</p>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            
            <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 AI Todo App. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: config.emailFrom,
        to: email,
        subject: 'Reset Your Password - AI Todo App',
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}