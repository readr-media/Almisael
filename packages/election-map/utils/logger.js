const { default: chalk } = require('chalk')

/**
 * Structured logger with colored output and context support
 */
class Logger {
  /**
   * Log info message with optional context
   * @param {string} message - Main log message
   * @param {Object} context - Additional context data
   */
  info(message, context = {}) {
    console.log(chalk.blue(`[INFO] ${message}`))
    if (Object.keys(context).length > 0) {
      console.log(chalk.gray(JSON.stringify(context, null, 2)))
    }
  }

  /**
   * Log success message with optional context
   * @param {string} message - Main log message
   * @param {Object} context - Additional context data
   */
  success(message, context = {}) {
    console.log(chalk.green(`[SUCCESS] ${message}`))
    if (Object.keys(context).length > 0) {
      console.log(chalk.gray(JSON.stringify(context, null, 2)))
    }
  }

  /**
   * Log warning message with optional context
   * @param {string} message - Main log message
   * @param {Object} context - Additional context data
   */
  warn(message, context = {}) {
    console.log(chalk.yellow(`[WARN] ${message}`))
    if (Object.keys(context).length > 0) {
      console.log(chalk.gray(JSON.stringify(context, null, 2)))
    }
  }

  /**
   * Log error message with optional context
   * @param {string} message - Main log message
   * @param {Object} context - Additional context data
   */
  error(message, context = {}) {
    console.error(chalk.red(`[ERROR] ${message}`))
    if (Object.keys(context).length > 0) {
      console.error(chalk.gray(JSON.stringify(context, null, 2)))
    }
  }
}

// Export singleton instance
module.exports = new Logger()