const { execPromise, buildExportCommand } = require('../utils/command-builder')
const logger = require('../utils/logger')
const fs = require('fs').promises

class BuildService {
  /**
   * Clean .next directory to ensure fresh build
   */
  async cleanBuildDir() {
    try {
      await execPromise('rm -rf .next')
      logger.info('Cleaned .next directory for fresh build')
    } catch (error) {
      // Ignore error if .next doesn't exist
      logger.info('No .next directory to clean')
    }
  }

  /**
   * Execute build and export for specific org/env
   * @param {string} org - Organization
   * @param {string} env - Environment
   * @param {string} outDir - Output directory
   * @returns {Promise<{success: boolean, stdout?: string, error?: Error}>}
   */
  async buildAndExport(org, env, outDir) {
    try {
      logger.info(`Starting build for ${org} (${env})`, { outDir })

      // Clean build directory for fresh start
      await this.cleanBuildDir()

      const command = buildExportCommand(outDir)
      const { stdout, stderr } = await execPromise(command)

      if (stderr) {
        logger.warn(`Build warnings for ${org} (${env})`, { stderr })
      }

      logger.success(`Build completed for ${org} (${env})`, { outDir })
      return { success: true, stdout }
    } catch (error) {
      logger.error(`Build failed for ${org} (${env})`, {
        error: error.message,
        stderr: error.stderr,
        outDir,
      })
      return { success: false, error }
    }
  }
}

module.exports = BuildService

