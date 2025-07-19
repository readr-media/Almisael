const chalk = require('chalk')
const { exec } = require('child_process')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const fs = require('fs')
const path = require('path')

const argv = yargs(hideBin(process.argv))
  .option('org', {
    alias: 'o',
    type: 'string',
    description: 'Organization name',
    demandOption: true,
    choices: ['readr-media', 'mirror-media', 'mirror-daily', 'mirror-tv'],
  })
  .option('env', {
    alias: 'e',
    type: 'string',
    description: 'Environment',
    demandOption: true,
    choices: ['dev', 'prod'],
  }).argv

const { org, env } = argv

console.log(
  chalk.blue(`Start building process for ${org} in ${env} environment`)
)

// Generate config.js from template
const templatePath = path.resolve(__dirname, 'consts', 'config.js.template')
const configPath = path.resolve(__dirname, 'consts', 'config.js')

fs.readFile(templatePath, 'utf8', (err, data) => {
  if (err) {
    return console.log(chalk.red(err))
  }
  const result = data
    .replace(/ORGANIZATION_PLACEHOLDER/g, org)
    .replace(/ENVIRONMENT_PLACEHOLDER/g, env)

  fs.writeFile(configPath, result, 'utf8', (err) => {
    if (err) return console.log(chalk.red(err))

    console.log(chalk.green('Successfully generated config.js'))
    console.log(chalk.blue('Running yarn build...'))

    const buildProcess = exec('yarn export')

    buildProcess.stdout.on('data', (data) => {
      console.log(data)
    })

    buildProcess.stderr.on('data', (data) => {
      console.error(chalk.red(data))
    })

    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('Build completed successfully.'))
      } else {
        console.log(chalk.red(`Build process exited with code ${code}`))
      }
    })
  })
})
