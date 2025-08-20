const { execPromise, buildGsutilCommand } = require('../utils/commandBuilder')
const logger = require('../utils/logger')

class GCSService {
  /**
   * Deploy to GCS bucket
   * @param {string} org - Organization
   * @param {string} env - Environment
   * @param {string} outDir - Source directory
   * @param {Object} deployConfig - Deployment configuration
   * @param {boolean} dryRun - If true, skip actual deployment
   * @returns {Promise<{success: boolean, stdout?: string, error?: Error}>}
   */
  async deployToGCS(org, env, outDir, deployConfig, dryRun = false) {
    const command = buildGsutilCommand(
      outDir,
      deployConfig.bucket,
      deployConfig.cacheControl
    )

    if (dryRun) {
      logger.info(`[DRY RUN] Would deploy ${org} (${env}) to GCS`, {
        bucket: deployConfig.bucket,
        command,
        outDir,
      })
      return {
        success: true,
        stdout: `[DRY RUN] Deployment skipped for ${org} (${env})`,
      }
    }

    try {
      logger.info(`Starting GCS deployment for ${org} (${env})`, {
        bucket: deployConfig.bucket,
        command,
      })

      const { stdout, stderr } = await execPromise(command)

      if (stderr) {
        logger.warn(`GCS deployment warnings for ${org} (${env})`, { stderr })
      }

      logger.success(`GCS deployment completed for ${org} (${env})`, {
        bucket: deployConfig.bucket,
      })
      return { success: true, stdout }
    } catch (error) {
      logger.error(`GCS deployment failed for ${org} (${env})`, {
        error: error.message,
        stderr: error.stderr,
        bucket: deployConfig.bucket,
        command,
      })
      return { success: false, error }
    }
  }
}

module.exports = GCSService
