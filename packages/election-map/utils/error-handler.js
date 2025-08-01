/**
 * Custom error classes for different types of deployment errors
 */

class DeploymentError extends Error {
  constructor(message, context = {}) {
    super(message)
    this.name = 'DeploymentError'
    this.context = context
  }
}

class ConfigurationError extends Error {
  constructor(message, context = {}) {
    super(message)
    this.name = 'ConfigurationError'
    this.context = context
  }
}

class BuildError extends Error {
  constructor(message, context = {}) {
    super(message)
    this.name = 'BuildError'
    this.context = context
  }
}

class GCSError extends Error {
  constructor(message, context = {}) {
    super(message)
    this.name = 'GCSError'
    this.context = context
  }
}

class ValidationError extends Error {
  constructor(message, context = {}) {
    super(message)
    this.name = 'ValidationError'
    this.context = context
  }
}

/**
 * Centralized error handler with context preservation
 */
class ErrorHandler {
  /**
   * Handle and format errors with context
   * @param {Error} error - The error to handle
   * @param {Object} additionalContext - Additional context to include
   * @returns {Object} Formatted error response
   */
  handleError(error, additionalContext = {}) {
    const errorResponse = {
      name: error.name || 'Error',
      message: error.message,
      context: {
        ...error.context,
        ...additionalContext,
      },
    }

    // Add stack trace in development
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.stack = error.stack
    }

    return errorResponse
  }

  /**
   * Create a build error with context
   * @param {string} message - Error message
   * @param {Object} context - Error context
   * @returns {BuildError} Build error instance
   */
  createBuildError(message, context = {}) {
    return new BuildError(message, context)
  }

  /**
   * Create a GCS deployment error with context
   * @param {string} message - Error message
   * @param {Object} context - Error context
   * @returns {GCSError} GCS error instance
   */
  createGCSError(message, context = {}) {
    return new GCSError(message, context)
  }

  /**
   * Create a configuration error with context
   * @param {string} message - Error message
   * @param {Object} context - Error context
   * @returns {ConfigurationError} Configuration error instance
   */
  createConfigurationError(message, context = {}) {
    return new ConfigurationError(message, context)
  }

  /**
   * Create a validation error with context
   * @param {string} message - Error message
   * @param {Object} context - Error context
   * @returns {ValidationError} Validation error instance
   */
  createValidationError(message, context = {}) {
    return new ValidationError(message, context)
  }

  /**
   * Create a general deployment error with context
   * @param {string} message - Error message
   * @param {Object} context - Error context
   * @returns {DeploymentError} Deployment error instance
   */
  createDeploymentError(message, context = {}) {
    return new DeploymentError(message, context)
  }
}

// Export singleton instance and error classes
module.exports = {
  errorHandler: new ErrorHandler(),
  DeploymentError,
  ConfigurationError,
  BuildError,
  GCSError,
  ValidationError,
}

