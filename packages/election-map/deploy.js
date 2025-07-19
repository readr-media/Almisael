/*
gsutil -m cp -r ./out/* gs://v3-statics.mirrormedia.mg/projects/taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://v3-statics.mirrormedia.mg/projects/dev-taiwan-elections
gsutil -m cp -r ./out/* gs://readr-coverage/project/3/dev-taiwan-elections
--- dev ---
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://v3-statics-dev.mirrormedia.mg/projects/dev-taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://readr-coverage/project/3/dev-taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://static-mnews-tw-dev/projects/dev-taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://statics-dev.mirrordaily.news/projects/dev-taiwan-elections
--- prod ---
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://v3-statics.mirrormedia.mg/projects/taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://readr-coverage/project/3/taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://static-mnews-tw-prod/projects/taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://statics-prod.mirrordaily.news/projects/taiwan-elections
*/
const { default: chalk } = require('chalk')
const { exec } = require('child_process')
const { checkbox } = require('@inquirer/prompts')
const fs = require('fs').promises
const path = require('path')
const util = require('util')
const execPromise = util.promisify(exec)

async function run() {
  const orgs = await checkbox({
    message: 'Select organizations (use space bar to select):',
    choices: [
      { name: 'readr-media', value: 'readr-media' },
      { name: 'mirror-media', value: 'mirror-media' },
      { name: 'mirror-daily', value: 'mirror-daily' },
      { name: 'mirror-tv', value: 'mirror-tv' },
    ],
  })

  const envs = await checkbox({
    message: 'Select environments (use space bar to select):',
    choices: [
      { name: 'dev', value: 'dev' },
      { name: 'prod', value: 'prod' },
    ],
  })

  if (orgs.length === 0 || envs.length === 0) {
    console.log(
      chalk.yellow('No organization or environment selected. Exiting.')
    )
    return
  }

  const templatePath = path.resolve(__dirname, 'consts', 'config.js.template')
  const configPath = path.resolve(__dirname, 'consts', 'config.js')
  const templateData = await fs.readFile(templatePath, 'utf8')

  const pushToGCS = async (outDir) => {
    const dirToBucketMap = {
      'readr-media-dev-out':
        'gsutil -h "Cache-Control:no-store" -m cp -r ./readr-media-dev-out/* gs://readr-coverage/project/3/dev-taiwan-elections',
      'readr-media-prod-out':
        'gsutil -h "Cache-Control:no-store" -m cp -r ./readr-media-prod-out/* gs://readr-coverage/project/3/taiwan-elections',
      'mirror-tv-dev-out':
        'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-tv-dev-out/* gs://static-mnews-tw-dev/projects/dev-taiwan-elections',
      'mirror-tv-prod-out':
        'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-tv-prod-out/* gs://static-mnews-tw-prod/projects/taiwan-elections',
      'mirror-daily-dev-out':
        'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-daily-dev-out/* gs://statics-dev.mirrordaily.news/projects/dev-taiwan-elections',
      'mirror-daily-prod-out':
        'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-daily-prod-out/* gs://statics-prod.mirrordaily.news/projects/taiwan-elections',
      'mirror-media-dev-out':
        'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-media-dev-out/* gs://v3-statics-dev.mirrormedia.mg/projects/dev-taiwan-elections',
      'mirror-media-prod-out':
        'gsutil -h "Cache-Control:no-store" -m cp -r ./mirror-media-prod-out/* gs://v3-statics.mirrormedia.mg/projects/taiwan-elections',
    }
    return dirToBucketMap[outDir]
  }
  for (const org of orgs) {
    for (const env of envs) {
      const outDir = `${org}-${env}-out`
      console.log(
        chalk.blue(`
Building for ${org} in ${env} environment...`)
      )

      // Generate config.js
      const result = templateData
        .replace(/ORGANIZATION_PLACEHOLDER/g, org)
        .replace(/ENVIRONMENT_PLACEHOLDER/g, env)
      await fs.writeFile(configPath, result, 'utf8')
      console.log(chalk.green('Successfully generated config.js'))

      // Run build and export
      console.log(chalk.blue(`Running build and exporting to ${outDir}...`))
      try {
        // We use 'next build && next export' directly to pass the --outdir flag
        const { stdout, stderr } = await execPromise(
          `next build && next export --outdir ${outDir}`
        )
        console.log(stdout)
        if (stderr) {
          console.error(chalk.yellow(stderr))
        }
        console.log(
          chalk.green(
            `Build for ${org} (${env}) completed successfully in '${outDir}' folder.`
          )
        )
      } catch (error) {
        console.error(chalk.red(`Build for ${org} (${env}) failed:`))
        console.error(chalk.red(error.stderr || error.message))
      }
      try {
        const gcsPath = await pushToGCS(outDir)
        const { stdout, stderr } = await execPromise(gcsPath)

        console.log(stdout)
        if (stderr) {
          console.error(chalk.yellow(stderr))
        }
        console.log(chalk.green(`push to ${gcsPath}`))
      } catch (error) {
        console.error(chalk.red(`Build for ${org} (${env}) failed:`))
        console.error(chalk.red(error.stderr || error.message))
      }
    }
  }
}

run()
