const { exec } = require('child_process')
const util = require('util')

const execPromise = util.promisify(exec)

/**
 * Builds gsutil commands for GCS deployment
 * @param {string} sourceDir - Source directory path
 * @param {string} bucket - Target GCS bucket
 * @param {string} cacheControl - Cache control header value
 * @returns {string} Complete gsutil command
 */
function buildGsutilCommand(sourceDir, bucket, cacheControl = null) {
  const cacheHeader = cacheControl ? `-h "Cache-Control:${cacheControl}"` : ''
  const baseCommand = 'gsutil'
  const flags = '-m cp -r'
  const source = `./${sourceDir}/*`

  // Correct order: gsutil [cache-header] [flags] source dest
  return `${baseCommand} ${cacheHeader} ${flags} ${source} ${bucket}`
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Builds Next.js export command
 * @param {string} outDir - Output directory name
 * @returns {string} Complete export command
 */
function buildExportCommand(outDir) {
  return `next build && next export --outdir ${outDir}`
}

module.exports = {
  buildGsutilCommand,
  buildExportCommand,
  execPromise,
}

