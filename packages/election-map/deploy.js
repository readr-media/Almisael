const { default: chalk } = require('chalk')
const { checkbox } = require('@inquirer/prompts')

const ConfigService = require('./services/config-service')
const BuildService = require('./services/build-service')
const GCSService = require('./services/gcs-service')
const ValidationService = require('./services/validation-service')
const logger = require('./utils/logger')

async function run() {
  const configService = new ConfigService()
  const buildService = new BuildService()
  const gcsService = new GCSService()
  const validationService = new ValidationService()

  try {
    // Load valid options from configuration
    const { organizations, environments } = await configService.getValidOptions()

    // Get user selections with validation
    const orgs = await validationService.promptOrganizations(organizations)
    const envs = await validationService.promptEnvironments(environments)
    
    // Check for DRY_RUN environment variable or prompt user
    const dryRun = process.env.DRY_RUN === 'true' || await validationService.promptDryRun()

    if (orgs.length === 0 || envs.length === 0) {
      logger.warn('No organization or environment selected. Exiting.')
      return
    }

    if (dryRun) {
      logger.info('Running in DRY RUN mode - builds will be created but not deployed to GCS')
    }

    // Process deployments sequentially for builds, parallel for GCS
    const results = []
    
    for (const org of orgs) {
      for (const env of envs) {
        try {
          const result = await processDeployment(org, env, configService, buildService, gcsService, dryRun)
          results.push({ status: 'fulfilled', value: result })
        } catch (error) {
          results.push({ 
            status: 'rejected', 
            value: { org, env, status: 'failed', error: error.message }
          })
        }
      }
    }
    
    // Report final results
    reportResults(results, orgs, envs)

  } catch (error) {
    logger.error('Deployment process failed', { error: error.message })
    process.exit(1)
  }
}

async function processDeployment(org, env, configService, buildService, gcsService, dryRun = false) {
  const outDir = `${org}-${env}-out`
  
  try {
    // Generate configuration file
    await configService.generateConfigFile(org, env)
    logger.success(`Generated config.js for ${org} (${env})`)

    // Build and export
    const buildResult = await buildService.buildAndExport(org, env, outDir)
    if (!buildResult.success) {
      throw new Error(`Build failed: ${buildResult.error.message}`)
    }

    // Get deployment configuration
    const deployConfig = await configService.getDeploymentConfig(org, env)

    // Deploy to GCS (or simulate in dry-run mode)
    const deployResult = await gcsService.deployToGCS(org, env, outDir, deployConfig, dryRun)
    if (!deployResult.success) {
      throw new Error(`GCS deployment failed: ${deployResult.error.message}`)
    }

    return { org, env, status: 'success' }

  } catch (error) {
    logger.error(`Deployment failed for ${org} (${env})`, { error: error.message })
    return { org, env, status: 'failed', error: error.message }
  }
}

function reportResults(results, orgs, envs) {
  const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 'success')
  const failed = results.filter(r => r.status === 'rejected' || r.value.status === 'failed')

  logger.info('Deployment Summary', {
    total: results.length,
    successful: successful.length,
    failed: failed.length,
    organizations: orgs,
    environments: envs
  })

  if (failed.length > 0) {
    logger.error('Failed deployments:', {
      failures: failed.map(f => ({
        org: f.value?.org || 'unknown',
        env: f.value?.env || 'unknown',
        error: f.value?.error || f.reason
      }))
    })
    process.exit(1)
  }

  logger.success('All deployments completed successfully!')
}

run()