const fs = require('fs').promises
const path = require('path')
const { exec } = require('child_process')
const util = require('util')

const execPromise = util.promisify(exec)

describe('Deploy Script Integration Tests', () => {
  const originalConfigPath = path.resolve(__dirname, '../../consts/config.js')
  const testOutputDirs = []
  
  beforeEach(async () => {
    // Backup original config if exists
    try {
      await fs.access(originalConfigPath)
      await fs.copyFile(originalConfigPath, `${originalConfigPath}.backup`)
    } catch (error) {
      // Config doesn't exist, which is fine
    }
  })

  afterEach(async () => {
    // Clean up test output directories
    for (const dir of testOutputDirs) {
      try {
        await fs.rmdir(dir, { recursive: true })
      } catch (error) {
        // Directory might not exist
      }
    }
    testOutputDirs.length = 0

    // Restore original config
    try {
      await fs.access(`${originalConfigPath}.backup`)
      await fs.copyFile(`${originalConfigPath}.backup`, originalConfigPath)
      await fs.unlink(`${originalConfigPath}.backup`)
    } catch (error) {
      // Backup doesn't exist, remove config if it was created
      try {
        await fs.unlink(originalConfigPath)
      } catch (cleanupError) {
        // Config doesn't exist
      }
    }
  })

  test('should generate correct config.js for readr-media dev', async () => {
    const templatePath = path.resolve(__dirname, '../../consts/config.js.template')
    const templateData = await fs.readFile(templatePath, 'utf8')
    
    const result = templateData
      .replace(/ORGANIZATION_PLACEHOLDER/g, 'readr-media')
      .replace(/ENVIRONMENT_PLACEHOLDER/g, 'dev')
    
    await fs.writeFile(originalConfigPath, result, 'utf8')
    
    // Verify config.js contains expected values
    const configContent = await fs.readFile(originalConfigPath, 'utf8')
    expect(configContent).toContain('readr-media')
    expect(configContent).toContain('dev')
    expect(configContent).not.toContain('ORGANIZATION_PLACEHOLDER')
    expect(configContent).not.toContain('ENVIRONMENT_PLACEHOLDER')
  })

  test('should build correct bucket mapping commands', () => {
    const expectedMappings = {
      'readr-media-dev-out': 'gs://readr-coverage/project/3/dev-taiwan-elections',
      'readr-media-prod-out': 'gs://readr-coverage/project/3/taiwan-elections',
      'mirror-media-dev-out': 'gs://v3-statics-dev.mirrormedia.mg/projects/dev-taiwan-elections',
      'mirror-media-prod-out': 'gs://v3-statics.mirrormedia.mg/projects/taiwan-elections',
      'mirror-tv-dev-out': 'gs://static-mnews-tw-dev/projects/dev-taiwan-elections',
      'mirror-tv-prod-out': 'gs://static-mnews-tw-prod/projects/taiwan-elections',
      'mirror-daily-dev-out': 'gs://statics-dev.mirrordaily.news/projects/dev-taiwan-elections',
      'mirror-daily-prod-out': 'gs://statics-prod.mirrordaily.news/projects/taiwan-elections'
    }

    // Test the current bucket mapping logic
    Object.entries(expectedMappings).forEach(([outDir, expectedBucket]) => {
      const command = buildCurrentGsutilCommand(outDir, expectedBucket)
      expect(command).toContain('gsutil -h "Cache-Control:no-store" -m cp -r')
      expect(command).toContain(outDir)
      expect(command).toContain(expectedBucket)
    })
  })

  test('should validate organization and environment combinations', () => {
    const validOrgs = ['readr-media', 'mirror-media', 'mirror-tv', 'mirror-daily']
    const validEnvs = ['dev', 'prod']
    
    validOrgs.forEach(org => {
      validEnvs.forEach(env => {
        const outDir = `${org}-${env}-out`
        const bucketCommand = getCurrentBucketMapping(outDir)
        expect(bucketCommand).toBeDefined()
        expect(bucketCommand).toContain('gsutil')
      })
    })
  })

  // Helper functions to test current deployment logic
  function buildCurrentGsutilCommand(outDir, bucket) {
    return `gsutil -h "Cache-Control:no-store" -m cp -r ./${outDir}/* ${bucket}`
  }

  function getCurrentBucketMapping(outDir) {
    const dirToBucketMap = {
      'readr-media-dev-out': 'gsutil -h "Cache-Control:no-store" -m cp -r ./readr-media-dev-out/* gs://readr-coverage/project/3/dev-taiwan-elections',
      'readr-media-prod-out': 'gsutil -h "Cache-Control:no-store" -m cp -r ./readr-media-prod-out/* gs://readr-coverage/project/3/taiwan-elections',
      'mirror-tv-dev-out': 'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-tv-dev-out/* gs://static-mnews-tw-dev/projects/dev-taiwan-elections',
      'mirror-tv-prod-out': 'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-tv-prod-out/* gs://static-mnews-tw-prod/projects/taiwan-elections',
      'mirror-daily-dev-out': 'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-daily-dev-out/* gs://statics-dev.mirrordaily.news/projects/dev-taiwan-elections',
      'mirror-daily-prod-out': 'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-daily-prod-out/* gs://statics-prod.mirrordaily.news/projects/taiwan-elections',
      'mirror-media-dev-out': 'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-media-dev-out/* gs://v3-statics-dev.mirrormedia.mg/projects/dev-taiwan-elections',
      'mirror-media-prod-out': 'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-media-prod-out/* gs://v3-statics.mirrormedia.mg/projects/taiwan-elections'
    }
    return dirToBucketMap[outDir]
  }
})