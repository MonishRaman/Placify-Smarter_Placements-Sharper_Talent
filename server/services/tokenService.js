import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Token Service Module
 * 
 * Provides secure token generation and validation for password resets and other authentication flows.
 * Supports both JWT tokens and cryptographically secure random tokens.
 * 
 * Features:
 * - Secure random token generation using crypto.randomBytes
 * - JWT token generation with expiry
 * - Token validation with expiry checking
 * - Hashed token storage support
 * - Configurable token length and expiry times
 * 
 * Environment Variables Required:
 * - JWT_SECRET: Secret key for JWT token signing
 * 
 * Future Extensions:
 * - Redis/MongoDB token blacklisting
 * - Rate limiting for token generation
 * - Token usage tracking and analytics
 * - Multiple token types (email verification, 2FA, etc.)
 */

class TokenService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
        if (!this.jwtSecret) {
            console.warn('⚠️  JWT_SECRET not found in environment variables. JWT functionality will be limited.');
        }
    }

    /**
     * Generate a secure random token
     * @param {number} length - Token length in bytes (default: 32)
     * @param {number} expiryMinutes - Token expiry time in minutes (default: 15)
     * @param {string} format - Token format: 'hex', 'base64', 'base64url' (default: 'hex')
     * @returns {Object} Token object with token, expiry, and hash
     */
    generateToken(length = 32, expiryMinutes = 15, format = 'hex') {
        try {
            if (length < 16) {
                throw new Error('Token length must be at least 16 bytes for security');
            }

            if (expiryMinutes <= 0) {
                throw new Error('Expiry time must be greater than 0 minutes');
            }

            // Generate cryptographically secure random bytes
            const randomBytes = crypto.randomBytes(length);

            // Format the token based on requested format
            let token;
            switch (format.toLowerCase()) {
                case 'base64':
                    token = randomBytes.toString('base64');
                    break;
                case 'base64url':
                    token = randomBytes.toString('base64url');
                    break;
                case 'hex':
                default:
                    token = randomBytes.toString('hex');
                    break;
            }

            // Calculate expiry time
            const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

            // Generate hash of the token for secure storage
            const tokenHash = this.hashToken(token);

            console.log(`🔑 Generated secure token (${format}, ${length} bytes, expires in ${expiryMinutes}min)`);

            return {
                token,
                tokenHash,
                expiresAt,
                createdAt: new Date(),
                length,
                format,
                expiryMinutes
            };
        } catch (error) {
            console.error('❌ Failed to generate token:', error.message);
            throw new Error(`Token generation failed: ${error.message}`);
        }
    }

    /**
     * Generate a JWT token with payload and expiry
     * @param {Object} payload - Data to encode in the token
     * @param {number} expiryMinutes - Token expiry time in minutes (default: 15)
     * @param {string} issuer - Token issuer (default: 'placify')
     * @returns {Object} JWT token object
     */
    generateJWTToken(payload, expiryMinutes = 15, issuer = 'placify') {
        if (!this.jwtSecret) {
            throw new Error('JWT_SECRET not configured. Cannot generate JWT tokens.');
        }

        try {
            if (!payload || typeof payload !== 'object') {
                throw new Error('Payload must be a valid object');
            }

            if (expiryMinutes <= 0) {
                throw new Error('Expiry time must be greater than 0 minutes');
            }

            const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
            const expirySeconds = Math.floor(expiresAt.getTime() / 1000);

            const tokenPayload = {
                ...payload,
                iss: issuer,
                iat: Math.floor(Date.now() / 1000),
                exp: expirySeconds
            };

            const token = jwt.sign(tokenPayload, this.jwtSecret, {
                algorithm: 'HS256'
            });

            console.log(`🔐 Generated JWT token (expires in ${expiryMinutes}min)`);

            return {
                token,
                payload: tokenPayload,
                expiresAt,
                createdAt: new Date(),
                type: 'jwt',
                expiryMinutes
            };
        } catch (error) {
            console.error('❌ Failed to generate JWT token:', error.message);
            throw new Error(`JWT token generation failed: ${error.message}`);
        }
    }

    /**
     * Validate a random token against its hash and expiry
     * @param {string} token - Token to validate
     * @param {string} storedHash - Stored hash of the original token
     * @param {Date|string} expiresAt - Token expiry date
     * @returns {Object} Validation result
     */
    validateToken(token, storedHash, expiresAt) {
        try {
            if (!token || !storedHash || !expiresAt) {
                return {
                    valid: false,
                    error: 'Missing token, hash, or expiry date',
                    reason: 'MISSING_PARAMETERS'
                };
            }

            // Check if token has expired
            const expiryDate = new Date(expiresAt);
            const now = new Date();

            if (now > expiryDate) {
                console.log('⏰ Token validation failed: Token has expired');
                return {
                    valid: false,
                    error: 'Token has expired',
                    reason: 'EXPIRED',
                    expiredAt: expiryDate,
                    currentTime: now
                };
            }

            // Validate token hash
            const tokenHash = this.hashToken(token);
            const isHashValid = crypto.timingSafeEqual(
                Buffer.from(tokenHash, 'hex'),
                Buffer.from(storedHash, 'hex')
            );

            if (!isHashValid) {
                console.log('❌ Token validation failed: Invalid token hash');
                return {
                    valid: false,
                    error: 'Invalid token',
                    reason: 'INVALID_HASH'
                };
            }

            console.log('✅ Token validation successful');
            return {
                valid: true,
                expiresAt: expiryDate,
                timeRemaining: expiryDate.getTime() - now.getTime()
            };
        } catch (error) {
            console.error('❌ Token validation error:', error.message);
            return {
                valid: false,
                error: error.message,
                reason: 'VALIDATION_ERROR'
            };
        }
    }

    /**
     * Validate a JWT token
     * @param {string} token - JWT token to validate
     * @returns {Object} Validation result with decoded payload
     */
    validateJWTToken(token) {
        if (!this.jwtSecret) {
            return {
                valid: false,
                error: 'JWT_SECRET not configured',
                reason: 'CONFIGURATION_ERROR'
            };
        }

        try {
            if (!token) {
                return {
                    valid: false,
                    error: 'Token is required',
                    reason: 'MISSING_TOKEN'
                };
            }

            const decoded = jwt.verify(token, this.jwtSecret);

            console.log('✅ JWT token validation successful');
            return {
                valid: true,
                payload: decoded,
                expiresAt: new Date(decoded.exp * 1000),
                issuedAt: new Date(decoded.iat * 1000),
                issuer: decoded.iss
            };
        } catch (error) {
            console.log('❌ JWT token validation failed:', error.message);

            let reason = 'INVALID_TOKEN';
            if (error.name === 'TokenExpiredError') {
                reason = 'EXPIRED';
            } else if (error.name === 'JsonWebTokenError') {
                reason = 'MALFORMED';
            }

            return {
                valid: false,
                error: error.message,
                reason,
                expiredAt: error.expiredAt || null
            };
        }
    }

    /**
     * Generate a cryptographic hash of a token for secure storage
     * @param {string} token - Token to hash
     * @param {string} algorithm - Hash algorithm (default: 'sha256')
     * @returns {string} Hexadecimal hash string
     */
    hashToken(token, algorithm = 'sha256') {
        try {
            if (!token) {
                throw new Error('Token is required for hashing');
            }

            return crypto
                .createHash(algorithm)
                .update(token)
                .digest('hex');
        } catch (error) {
            console.error('❌ Token hashing failed:', error.message);
            throw new Error(`Token hashing failed: ${error.message}`);
        }
    }

    /**
     * Generate a password reset token specifically for password reset flow
     * @param {string} userId - User ID to associate with the token
     * @param {string} email - User email for additional security
     * @param {number} expiryMinutes - Token expiry time in minutes (default: 15)
     * @returns {Object} Password reset token object
     */
    generatePasswordResetToken(userId, email, expiryMinutes = 15) {
        try {
            if (!userId || !email) {
                throw new Error('User ID and email are required for password reset token');
            }

            // Generate a secure random token
            const randomToken = this.generateToken(32, expiryMinutes, 'base64url');

            // Also generate a JWT token with user info for additional verification
            const jwtToken = this.generateJWTToken({
                userId,
                email,
                purpose: 'password_reset',
                tokenId: randomToken.token.substring(0, 8) // First 8 chars as ID
            }, expiryMinutes);

            console.log(`🔐 Generated password reset token for user: ${userId}`);

            return {
                // Random token for URL (more secure for password resets)
                resetToken: randomToken.token,
                resetTokenHash: randomToken.tokenHash,

                // JWT token for verification (contains user info)
                verificationToken: jwtToken.token,

                // Metadata
                userId,
                email,
                expiresAt: randomToken.expiresAt,
                createdAt: randomToken.createdAt,
                purpose: 'password_reset',
                expiryMinutes
            };
        } catch (error) {
            console.error('❌ Failed to generate password reset token:', error.message);
            throw new Error(`Password reset token generation failed: ${error.message}`);
        }
    }

    /**
     * Validate a password reset token
     * @param {string} resetToken - The reset token from URL
     * @param {string} storedHash - Stored hash of the token
     * @param {Date|string} expiresAt - Token expiry date
     * @param {string} verificationToken - JWT verification token (optional)
     * @returns {Object} Validation result
     */
    validatePasswordResetToken(resetToken, storedHash, expiresAt, verificationToken = null) {
        try {
            // Validate the random token
            const tokenValidation = this.validateToken(resetToken, storedHash, expiresAt);

            if (!tokenValidation.valid) {
                return tokenValidation;
            }

            // If verification token is provided, validate it too
            if (verificationToken) {
                const jwtValidation = this.validateJWTToken(verificationToken);

                if (!jwtValidation.valid) {
                    return {
                        valid: false,
                        error: 'Verification token is invalid',
                        reason: 'INVALID_VERIFICATION_TOKEN',
                        jwtError: jwtValidation.error
                    };
                }

                // Check if the purpose matches
                if (jwtValidation.payload.purpose !== 'password_reset') {
                    return {
                        valid: false,
                        error: 'Token is not for password reset',
                        reason: 'INVALID_PURPOSE'
                    };
                }

                return {
                    valid: true,
                    userId: jwtValidation.payload.userId,
                    email: jwtValidation.payload.email,
                    expiresAt: tokenValidation.expiresAt,
                    timeRemaining: tokenValidation.timeRemaining,
                    tokenId: jwtValidation.payload.tokenId
                };
            }

            return tokenValidation;
        } catch (error) {
            console.error('❌ Password reset token validation error:', error.message);
            return {
                valid: false,
                error: error.message,
                reason: 'VALIDATION_ERROR'
            };
        }
    }

    /**
     * Check if a token is close to expiry (within warning threshold)
     * @param {Date|string} expiresAt - Token expiry date
     * @param {number} warningMinutes - Warning threshold in minutes (default: 5)
     * @returns {Object} Expiry warning information
     */
    checkTokenExpiry(expiresAt, warningMinutes = 5) {
        try {
            const expiryDate = new Date(expiresAt);
            const now = new Date();
            const timeRemaining = expiryDate.getTime() - now.getTime();
            const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));

            return {
                isExpired: timeRemaining <= 0,
                isNearExpiry: minutesRemaining <= warningMinutes && minutesRemaining > 0,
                minutesRemaining: Math.max(0, minutesRemaining),
                timeRemaining: Math.max(0, timeRemaining),
                expiresAt: expiryDate
            };
        } catch (error) {
            console.error('❌ Token expiry check failed:', error.message);
            return {
                isExpired: true,
                isNearExpiry: false,
                minutesRemaining: 0,
                timeRemaining: 0,
                error: error.message
            };
        }
    }
}

// Export singleton instance
const tokenService = new TokenService();
export default tokenService;

// Export class for testing purposes
export { TokenService };