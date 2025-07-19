const chalk = require('chalk')
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
    }
  }
}

run()
