/**
 * Centralized Logger Utility for Placify Backend
 * 
 * This logger provides structured logging with different log levels,
 * environment-based control, and formatted output with timestamps.
 * 
 * Usage:
 *   import logger from './utils/logger.js';
 *   logger.info('Server started', { port: 3000 });
 *   logger.error('Database connection failed', error);
 * 
 * Log Levels:
 *   - DEBUG: Detailed information for debugging
 *   - INFO: General informational messages
 *   - WARN: Warning messages for potential issues
 *   - ERROR: Error messages for failures
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// ANSI color codes for terminal output
const COLORS = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  
  // Foreground colors
  BLACK: '\x1b[30m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  
  // Background colors
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m'
};

class Logger {
  constructor() {
    // Determine log level based on environment
    this.level = this.getLogLevel();
    this.isDevelopment = process.env.NODE_ENV !== 'production';
    this.useColors = this.shouldUseColors();
  }

  /**
   * Check if colors should be used in output
   * @returns {boolean} Whether to use colors
   */
  shouldUseColors() {
    // Disable colors in production or if NO_COLOR env var is set
    if (process.env.NO_COLOR || !this.isDevelopment) {
      return false;
    }
    
    // Check if stdout is a TTY (terminal)
    return process.stdout.isTTY;
  }

  /**
   * Get the current log level based on environment
   * @returns {number} Log level
   */
  getLogLevel() {
    // Check for explicit log level in environment
    const envLogLevel = process.env.LOG_LEVEL;
    if (envLogLevel && LOG_LEVELS[envLogLevel.toUpperCase()] !== undefined) {
      return LOG_LEVELS[envLogLevel.toUpperCase()];
    }

    // Default log levels based on environment
    const env = process.env.NODE_ENV || 'development';
    switch (env) {
      case 'production':
        return LOG_LEVELS.INFO; // Info, warnings, and errors in production
      case 'test':
        return LOG_LEVELS.ERROR; // Only errors in test
      case 'development':
      default:
        return LOG_LEVELS.DEBUG; // All logs in development
    }
  }

  /**
   * Format timestamp for log messages
   * @returns {string} Formatted timestamp
   */
  getTimestamp() {
    const now = new Date();
    return now.toISOString();
  }

  /**
   * Apply color to text
   * @param {string} text - Text to colorize
   * @param {string} color - Color code
   * @returns {string} Colorized text
   */
  colorize(text, color) {
    if (!this.useColors) return text;
    return `${color}${text}${COLORS.RESET}`;
  }

  /**
   * Get color for log level
   * @param {string} level - Log level
   * @returns {string} Color code
   */
  getLevelColor(level) {
    const colors = {
      DEBUG: COLORS.CYAN,
      INFO: COLORS.GREEN,
      WARN: COLORS.YELLOW,
      ERROR: COLORS.RED
    };
    return colors[level] || COLORS.WHITE;
  }

  /**
   * Get emoji for log level
   * @param {string} level - Log level
   * @returns {string} Emoji
   */
  getEmoji(level) {
    const emojis = {
      DEBUG: '🔍',
      INFO: '✅',
      WARN: '⚠️',
      ERROR: '❌'
    };
    return emojis[level] || '';
  }

  /**
   * Format log message with timestamp and level
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {any} data - Additional data
   * @returns {string} Formatted log message
   */
  formatMessage(level, message, data) {
    const timestamp = this.colorize(this.getTimestamp(), COLORS.DIM);
    const emoji = this.getEmoji(level);
    const levelColor = this.getLevelColor(level);
    const levelText = this.colorize(`[${level}]`, levelColor);
    
    let logMessage = `${timestamp} ${levelText} ${emoji} ${message}`;

    if (data !== undefined) {
      // Format data for logging
      if (data instanceof Error) {
        logMessage += `\n${this.colorize('Error:', COLORS.RED)} ${data.message}`;
        if (this.isDevelopment && data.stack) {
          logMessage += `\n${this.colorize('Stack:', COLORS.DIM)}\n${data.stack}`;
        }
      } else if (typeof data === 'object') {
        try {
          logMessage += `\n${JSON.stringify(data, null, 2)}`;
        } catch (err) {
          logMessage += `\n[Unserializable Object]`;
        }
      } else {
        logMessage += ` ${data}`;
      }
    }

    return logMessage;
  }

  /**
   * Check if a log level should be output
   * @param {number} level - Log level to check
   * @returns {boolean} Whether to log
   */
  shouldLog(level) {
    return level >= this.level;
  }

  /**
   * Log debug message (detailed information for debugging)
   * @param {string} message - Log message
   * @param {any} data - Additional data to log
   */
  debug(message, data) {
    if (!this.shouldLog(LOG_LEVELS.DEBUG)) return;

    const formattedMessage = this.formatMessage('DEBUG', message, data);
    /* eslint-disable no-console */
    console.log(formattedMessage);
    /* eslint-enable no-console */
  }

  /**
   * Log info message (general informational messages)
   * @param {string} message - Log message
   * @param {any} data - Additional data to log
   */
  info(message, data) {
    if (!this.shouldLog(LOG_LEVELS.INFO)) return;

    const formattedMessage = this.formatMessage('INFO', message, data);
    /* eslint-disable no-console */
    console.info(formattedMessage);
    /* eslint-enable no-console */
  }

  /**
   * Log warning message (potential issues)
   * @param {string} message - Log message
   * @param {any} data - Additional data to log
   */
  warn(message, data) {
    if (!this.shouldLog(LOG_LEVELS.WARN)) return;

    const formattedMessage = this.formatMessage('WARN', message, data);
    /* eslint-disable no-console */
    console.warn(formattedMessage);
    /* eslint-enable no-console */
  }

  /**
   * Log error message (failures and exceptions)
   * @param {string} message - Log message
   * @param {any} error - Error object or additional data
   */
  error(message, error) {
    if (!this.shouldLog(LOG_LEVELS.ERROR)) return;

    const formattedMessage = this.formatMessage('ERROR', message, error);
    /* eslint-disable no-console */
    console.error(formattedMessage);
    /* eslint-enable no-console */

    // In production, you might want to send errors to a monitoring service
    if (!this.isDevelopment && error instanceof Error) {
      this.reportError(error, message);
    }
  }

  /**
   * Report error to monitoring service (placeholder for future implementation)
   * @param {Error} error - Error object
   * @param {string} context - Error context
   */
  reportError(error, context) {
    // TODO: Integrate with error monitoring service (e.g., Sentry, Winston, Pino)
    // Example:
    // Sentry.captureException(error, { extra: { context } });
  }

  /**
   * Create a grouped log (useful for related log messages)
   * @param {string} label - Group label
   * @param {Function} callback - Function containing log statements
   */
  group(label, callback) {
    if (!this.isDevelopment) {
      callback();
      return;
    }

    const separator = this.colorize('═'.repeat(50), COLORS.DIM);
    /* eslint-disable no-console */
    console.log(`\n${separator}`);
    console.log(this.colorize(`▶ ${label}`, COLORS.BRIGHT));
    console.log(separator);
    callback();
    console.log(`${separator}\n`);
    /* eslint-enable no-console */
  }

  /**
   * Log HTTP request
   * @param {Object} req - Express request object
   * @param {number} statusCode - Response status code
   * @param {number} duration - Request duration in ms
   */
  http(req, statusCode, duration) {
    if (!this.shouldLog(LOG_LEVELS.INFO)) return;

    const method = req.method;
    const url = req.originalUrl || req.url;
    const statusColor = statusCode >= 400 ? COLORS.RED : COLORS.GREEN;
    
    const message = `${method} ${url} ${this.colorize(statusCode, statusColor)} - ${duration}ms`;
    this.info(message);
  }

  /**
   * Start a timer
   * @param {string} label - Timer label
   * @returns {Function} Function to end timer
   */
  time(label) {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      this.debug(`⏱️  ${label}: ${duration}ms`);
      return duration;
    };
  }
}

// Create singleton instance
const logger = new Logger();

// Export default instance
export default logger;

// Also export LOG_LEVELS for advanced usage
export { LOG_LEVELS };
