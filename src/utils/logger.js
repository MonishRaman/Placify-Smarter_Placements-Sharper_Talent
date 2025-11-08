/**
 * Centralized Logger Utility for Placify Frontend
 * 
 * This logger provides structured logging with different log levels,
 * environment-based control, and formatted output with timestamps.
 * 
 * Usage:
 *   import logger from '@/utils/logger';
 *   logger.info('User logged in', { userId: 123 });
 *   logger.error('Failed to fetch data', error);
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

class Logger {
  constructor() {
    // Determine log level based on environment
    // In production, only show warnings and errors
    // In development, show all logs
    this.level = this.getLogLevel();
    this.isDevelopment = import.meta.env.MODE === 'development';
  }

  /**
   * Get the current log level based on environment
   * @returns {number} Log level
   */
  getLogLevel() {
    const env = import.meta.env.MODE;
    
    // Check for explicit log level in environment
    const envLogLevel = import.meta.env.VITE_LOG_LEVEL;
    if (envLogLevel && LOG_LEVELS[envLogLevel.toUpperCase()] !== undefined) {
      return LOG_LEVELS[envLogLevel.toUpperCase()];
    }

    // Default log levels based on environment
    switch (env) {
      case 'production':
        return LOG_LEVELS.WARN; // Only warnings and errors in production
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
   * Format log message with timestamp and level
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {any} data - Additional data
   * @returns {Array} Formatted log arguments
   */
  formatMessage(level, message, data) {
    const timestamp = this.getTimestamp();
    const prefix = `[${timestamp}] [${level}]`;

    if (data !== undefined) {
      return [prefix, message, data];
    }
    return [prefix, message];
  }

  /**
   * Get appropriate emoji for log level
   * @param {string} level - Log level
   * @returns {string} Emoji
   */
  getEmoji(level) {
    const emojis = {
      DEBUG: '🔍',
      INFO: 'ℹ️',
      WARN: '⚠️',
      ERROR: '❌'
    };
    return emojis[level] || '';
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

    const emoji = this.getEmoji('DEBUG');
    const args = this.formatMessage('DEBUG', `${emoji} ${message}`, data);
    
    // Use console methods directly only in development
    if (this.isDevelopment) {
      /* eslint-disable no-console */
      console.log(...args);
      /* eslint-enable no-console */
    }
  }

  /**
   * Log info message (general informational messages)
   * @param {string} message - Log message
   * @param {any} data - Additional data to log
   */
  info(message, data) {
    if (!this.shouldLog(LOG_LEVELS.INFO)) return;

    const emoji = this.getEmoji('INFO');
    const args = this.formatMessage('INFO', `${emoji} ${message}`, data);
    
    if (this.isDevelopment) {
      /* eslint-disable no-console */
      console.info(...args);
      /* eslint-enable no-console */
    }
  }

  /**
   * Log warning message (potential issues)
   * @param {string} message - Log message
   * @param {any} data - Additional data to log
   */
  warn(message, data) {
    if (!this.shouldLog(LOG_LEVELS.WARN)) return;

    const emoji = this.getEmoji('WARN');
    const args = this.formatMessage('WARN', `${emoji} ${message}`, data);
    
    /* eslint-disable no-console */
    console.warn(...args);
    /* eslint-enable no-console */
  }

  /**
   * Log error message (failures and exceptions)
   * @param {string} message - Log message
   * @param {any} error - Error object or additional data
   */
  error(message, error) {
    if (!this.shouldLog(LOG_LEVELS.ERROR)) return;

    const emoji = this.getEmoji('ERROR');
    const args = this.formatMessage('ERROR', `${emoji} ${message}`, error);
    
    /* eslint-disable no-console */
    console.error(...args);
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
    // TODO: Integrate with error monitoring service (e.g., Sentry, LogRocket)
    // Example:
    // Sentry.captureException(error, { extra: { context } });
  }

  /**
   * Create a grouped log (useful for related log messages)
   * @param {string} label - Group label
   * @param {Function} callback - Function containing log statements
   */
  group(label, callback) {
    if (!this.isDevelopment) return;

    /* eslint-disable no-console */
    console.group(label);
    callback();
    console.groupEnd();
    /* eslint-enable no-console */
  }

  /**
   * Log table data (useful for arrays and objects)
   * @param {any} data - Data to display as table
   */
  table(data) {
    if (!this.isDevelopment) return;

    /* eslint-disable no-console */
    console.table(data);
    /* eslint-enable no-console */
  }

  /**
   * Start a timer
   * @param {string} label - Timer label
   */
  time(label) {
    if (!this.isDevelopment) return;

    /* eslint-disable no-console */
    console.time(label);
    /* eslint-enable no-console */
  }

  /**
   * End a timer and log elapsed time
   * @param {string} label - Timer label
   */
  timeEnd(label) {
    if (!this.isDevelopment) return;

    /* eslint-disable no-console */
    console.timeEnd(label);
    /* eslint-enable no-console */
  }
}

// Create singleton instance
const logger = new Logger();

// Export default instance
export default logger;

// Also export LOG_LEVELS for advanced usage
export { LOG_LEVELS };
