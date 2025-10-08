import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Email Service Module
 * 
 * Provides email functionality using Gmail SMTP with app-specific passwords.
 * Can be easily extended to support other email providers like SendGrid, AWS SES, etc.
 * 
 * Environment Variables Required:
 * - GMAIL_USER: Gmail address to send emails from
 * - GMAIL_APP_PASSWORD: Gmail app-specific password (not regular password)
 * - EMAIL_FROM_NAME: Display name for sender (optional, defaults to "Placify")
 * 
 * Future Extensions:
 * - Add HTML email templates
 * - Support for email attachments
 * - Integration with SendGrid or AWS SES
 * - Email queue management for bulk emails
 * - Email analytics and tracking
 */

class EmailService {
    constructor() {
        this.transporter = null;
        this.isConfigured = false;
        this.fromName = process.env.EMAIL_FROM_NAME || 'Placify';
        this.fromEmail = process.env.GMAIL_USER;

        this.initializeTransporter();
    }

    /**
     * Initialize the email transporter with Gmail SMTP configuration
     * @private
     */
    initializeTransporter() {
        try {
            if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
                console.warn('⚠️  Email service not configured: Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables');
                return;
            }

            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
                // Additional security options
                tls: {
                    rejectUnauthorized: false,
                    ciphers: 'SSLv3'
                }
            });

            this.isConfigured = true;
            console.log('✅ Email service configured successfully');
        } catch (error) {
            console.error('❌ Failed to configure email service:', error.message);
            this.isConfigured = false;
        }
    }

    /**
     * Verify email service connection
     * @returns {Promise<boolean>} True if connection is successful
     */
    async verifyConnection() {
        if (!this.isConfigured || !this.transporter) {
            console.error('❌ Email service not configured');
            return false;
        }

        try {
            await this.transporter.verify();
            console.log('✅ Email service connection verified');
            return true;
        } catch (error) {
            console.error('❌ Email service verification failed:', error.message);
            return false;
        }
    }

    /**
     * Send password reset email with reset link
     * @param {string} to - Recipient email address
     * @param {string} resetLink - Password reset link URL
     * @param {Object} options - Additional email options
     * @param {string} options.userName - User's name for personalization
     * @param {number} options.expiryMinutes - Token expiry time in minutes (default: 15)
     * @returns {Promise<Object>} Email sending result
     */
    async sendPasswordResetEmail(to, resetLink, options = {}) {
        const { userName = 'User', expiryMinutes = 15 } = options;

        if (!this.isConfigured) {
            throw new Error('Email service not configured. Please check environment variables.');
        }

        if (!to || !resetLink) {
            throw new Error('Recipient email and reset link are required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            throw new Error('Invalid email address format');
        }

        try {
            const mailOptions = {
                from: `"${this.fromName}" <${this.fromEmail}>`,
                to: to,
                subject: 'Password Reset Request - Placify',
                text: this.generatePlainTextResetEmail(userName, resetLink, expiryMinutes),
                html: this.generateHtmlResetEmail(userName, resetLink, expiryMinutes)
            };

            console.log(`📧 Sending password reset email to: ${to}`);
            const info = await this.transporter.sendMail(mailOptions);

            console.log('✅ Password reset email sent successfully:', info.messageId);
            return {
                success: true,
                messageId: info.messageId,
                recipient: to,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Failed to send password reset email:', error.message);
            throw new Error(`Failed to send password reset email: ${error.message}`);
        }
    }

    /**
     * Generate plain text version of password reset email
     * @private
     * @param {string} userName - User's name
     * @param {string} resetLink - Password reset link
     * @param {number} expiryMinutes - Token expiry time in minutes
     * @returns {string} Plain text email content
     */
    generatePlainTextResetEmail(userName, resetLink, expiryMinutes) {
        return `
Hello ${userName},

We received a request to reset your password for your Placify account.

To reset your password, please click on the following link:
${resetLink}

This link will expire in ${expiryMinutes} minutes for security reasons.

If you did not request this password reset, please ignore this email and your password will remain unchanged.

For security purposes, please do not share this link with anyone.

Best regards,
The Placify Team

---
If you're having trouble clicking the link, copy and paste the following URL into your browser:
${resetLink}
    `.trim();
    }

    /**
     * Generate HTML version of password reset email
     * @private
     * @param {string} userName - User's name
     * @param {string} resetLink - Password reset link
     * @param {number} expiryMinutes - Token expiry time in minutes
     * @returns {string} HTML email content
     */
    generateHtmlResetEmail(userName, resetLink, expiryMinutes) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - Placify</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .button:hover { background-color: #3730A3; }
        .warning { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 10px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        .link-fallback { background-color: #F3F4F6; padding: 15px; border-radius: 4px; margin: 15px 0; word-break: break-all; font-family: monospace; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔐 Password Reset Request</h1>
    </div>
    <div class="content">
        <h2>Hello ${userName},</h2>
        <p>We received a request to reset your password for your Placify account.</p>
        <p>To reset your password, please click the button below:</p>
        
        <div style="text-align: center;">
            <a href="${resetLink}" class="button">Reset My Password</a>
        </div>
        
        <div class="warning">
            <strong>⚠️ Important:</strong> This link will expire in <strong>${expiryMinutes} minutes</strong> for security reasons.
        </div>
        
        <p>If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
        <p>For security purposes, please do not share this link with anyone.</p>
        
        <div class="link-fallback">
            <strong>Having trouble with the button?</strong><br>
            Copy and paste this link into your browser:<br>
            ${resetLink}
        </div>
    </div>
    <div class="footer">
        <p>Best regards,<br>The Placify Team</p>
        <p>This is an automated email. Please do not reply to this message.</p>
    </div>
</body>
</html>
    `.trim();
    }

    /**
     * Send a generic email (for future extensibility)
     * @param {Object} emailOptions - Email configuration
     * @param {string} emailOptions.to - Recipient email
     * @param {string} emailOptions.subject - Email subject
     * @param {string} emailOptions.text - Plain text content
     * @param {string} emailOptions.html - HTML content (optional)
     * @returns {Promise<Object>} Email sending result
     */
    async sendEmail({ to, subject, text, html }) {
        if (!this.isConfigured) {
            throw new Error('Email service not configured. Please check environment variables.');
        }

        if (!to || !subject || !text) {
            throw new Error('Recipient email, subject, and text content are required');
        }

        try {
            const mailOptions = {
                from: `"${this.fromName}" <${this.fromEmail}>`,
                to,
                subject,
                text,
                ...(html && { html })
            };

            console.log(`📧 Sending email to: ${to}`);
            const info = await this.transporter.sendMail(mailOptions);

            console.log('✅ Email sent successfully:', info.messageId);
            return {
                success: true,
                messageId: info.messageId,
                recipient: to,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Failed to send email:', error.message);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}

// Export singleton instance
const emailService = new EmailService();
export default emailService;

// Export class for testing purposes
export { EmailService };