// 'mirrorMedia' | 'mirrorTV' | 'readr'
const releaseTarget = process.env.NEXT_PUBLIC_RELEASE_TARGET
const projectName = 'dev-election2024-homepage-1222-2'
let assetPrefixPath = ''
let jsonEndpoint = ''
let staticFileDestination = ''
switch (releaseTarget) {
  case 'mirrorMedia':
    assetPrefixPath = `https://www.mirrormedia.mg/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://www.mirrormedia.mg/projects/${projectName}`
    break
  case 'mirrorTV':
    assetPrefixPath = `https://www.mnews.tw/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://www.mnews.tw/projects/${projectName}`

    break
  case 'readr':
    assetPrefixPath = `https://www.readr.tw/projects/3/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://www.readr.tw/projects/3/${projectName}`
    break
  default:
    assetPrefixPath = '.'
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `http://localhost:3000`

    break
}

export { assetPrefixPath, jsonEndpoint, staticFileDestination }
