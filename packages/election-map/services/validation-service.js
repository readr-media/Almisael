const { checkbox, confirm } = require('@inquirer/prompts')
const { errorHandler } = require('../utils/error-handler')

class ValidationService {
  /**
   * Prompt user to select organizations
   * @param {string[]} availableOrganizations - Available organization options
   * @returns {Promise<string[]>} Selected organizations
   */
  async promptOrganizations(availableOrganizations) {
    try {
      const choices = availableOrganizations.map((org) => ({
        name: org,
        value: org,
      }))

      return await checkbox({
        message: 'Select organizations (use space bar to select):',
        choices,
      })
    } catch (error) {
      throw errorHandler.createValidationError(
        'Failed to get organization selection from user',
        { availableOrganizations, error: error.message }
      )
    }
  }

  /**
   * Prompt user to select environments
   * @param {string[]} availableEnvironments - Available environment options
   * @returns {Promise<string[]>} Selected environments
   */
  async promptEnvironments(availableEnvironments) {
    try {
      const choices = availableEnvironments.map((env) => ({
        name: env,
        value: env,
      }))

      return await checkbox({
        message: 'Select environments (use space bar to select):',
        choices,
      })
    } catch (error) {
      throw errorHandler.createValidationError(
        'Failed to get environment selection from user',
        { availableEnvironments, error: error.message }
      )
    }
  }

  /**
   * Validate organization and environment combination
   * @param {string} org - Organization to validate
   * @param {string} env - Environment to validate
   * @param {string[]} validOrganizations - List of valid organizations
   * @param {string[]} validEnvironments - List of valid environments
   * @returns {boolean} True if combination is valid
   */
  validateOrgEnvCombination(org, env, validOrganizations, validEnvironments) {
    if (!validOrganizations.includes(org)) {
      throw errorHandler.createValidationError(`Invalid organization: ${org}`, {
        org,
        validOrganizations,
      })
    }

    if (!validEnvironments.includes(env)) {
      throw errorHandler.createValidationError(`Invalid environment: ${env}`, {
        env,
        validEnvironments,
      })
    }

    return true
  }

  /**
   * Validate that user made at least one selection
   * @param {string[]} orgs - Selected organizations
   * @param {string[]} envs - Selected environments
   * @returns {boolean} True if selections are valid
   */
  validateSelections(orgs, envs) {
    if (!orgs || orgs.length === 0) {
      throw errorHandler.createValidationError('No organizations selected', {
        orgs,
      })
    }

    if (!envs || envs.length === 0) {
      throw errorHandler.createValidationError('No environments selected', {
        envs,
      })
    }

    return true
  }

  /**
   * Prompt user for dry-run mode
   * @returns {Promise<boolean>} True if dry-run mode is enabled
   */
  async promptDryRun() {
    try {
      return await confirm({
        message: 'Run in dry-run mode? (build only, skip GCS deployment)',
        default: false
      })
    } catch (error) {
      throw errorHandler.createValidationError(
        'Failed to get dry-run selection from user',
        { error: error.message }
      )
    }
  }
}

module.exports = ValidationService

