// Import csv-parser library
const Papa = require('papaparse')
const fs = require('fs')

// get params
const args = process.argv.slice(2)

// Parse command-line arguments into an object
const parsedArgs = args.reduce((acc, arg) => {
  const [key, value] = arg.split('=')
  acc[key] = value
  return acc
}, {})

// Access the variable
const FolderPath = parsedArgs.FolderPath

if (!FolderPath) {
  throw new Error(
    `required param 'FolderPath' not provided\n ex: node script.js FolderPath=./map-mapping/district-width-area/legislator/csv/`
  )
}

const inputPath = FolderPath
const outputPath = `${FolderPath}/output/`

// Loop through each file in inputPath
fs.readdirSync(inputPath).forEach((fileName) => {
  console.log(fileName)
  // Use to generate json file
  const fileNameWithoutFormat = fileName.split('.')[0]
  // Path to each CSV file
  const csvFilePath = inputPath + fileName

  const csvData = fs.readFileSync(csvFilePath, 'utf-8')

  // Process the CSV data here
  Papa.parse(csvData, {
    header: true, // Treat the first row as headers
    complete: function (results) {
      const outputFilePath = outputPath + fileNameWithoutFormat + '.json'
      console.log(outputFilePath)
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath)
      }

      fs.writeFileSync(outputFilePath, JSON.stringify(results.data))
    },
    error: function (error) {
      console.error('Error parsing CSV:', error.message)
    },
  })
})
