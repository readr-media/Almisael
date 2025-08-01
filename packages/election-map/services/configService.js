const fs = require('fs').promises
const path = require('path')

class ConfigService {
  constructor() {
    this.config = null
    this.configPath = path.resolve(__dirname, '../config/deploymentConfig.json')
    this.templatePath = path.resolve(__dirname, '../consts/config.js.template')
    this.outputPath = path.resolve(__dirname, '../consts/config.js')
  }

  /**
   * Load deployment configuration
   * @returns {Promise<Object>} Deployment configuration
   */
  async loadConfig() {
    if (!this.config) {
      const configData = await fs.readFile(this.configPath, 'utf8')
      this.config = JSON.parse(configData)
    }
    return this.config
  }

  /**
   * Get valid organizations and environments
   * @returns {Promise<{organizations: string[], environments: string[]}>}
   */
  async getValidOptions() {
    const config = await this.loadConfig()
    const organizations = Object.keys(config.organizations)
    const environments = Object.keys(
      config.organizations[organizations[0]] || {}
    )

    return { organizations, environments }
  }

  /**
   * Get deployment configuration for specific org/env
   * @param {string} org - Organization key
   * @param {string} env - Environment key
   * @returns {Promise<Object>} Deployment configuration
   */
  async getDeploymentConfig(org, env) {
    const config = await this.loadConfig()

    if (!config.organizations[org] || !config.organizations[org][env]) {
      throw new Error(
        `Invalid organization/environment combination: ${org}/${env}`
      )
    }

    return config.organizations[org][env]
  }

  /**
   * Generate config.js from template
   * @param {string} org - Organization key
   * @param {string} env - Environment key
   * @returns {Promise<void>}
   */
  async generateConfigFile(org, env) {
    const templateData = await fs.readFile(this.templatePath, 'utf8')
    const result = templateData
      .replace(/ORGANIZATION_PLACEHOLDER/g, org)
      .replace(/ENVIRONMENT_PLACEHOLDER/g, env)

    await fs.writeFile(this.outputPath, result, 'utf8')
  }
}

module.exports = ConfigService
