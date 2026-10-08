// 'mirrorMedia' | 'mirrorTV' | 'mirrorDaily'
const releaseTarget = process.env.NEXT_PUBLIC_RELEASE_TARGET
const projectName = 'election2026-homepage'
let assetPrefixPath = ''
let mayorJsonEndpoint = ''
const DEV_MAYOR_JSON_ENDPOINT =
  'https://whoareyou-gcs.readr.tw/elections-dev/2026/mayor/iframe.json'
const PROD_MAYOR_JSON_ENDPOINT =
  'https://whoareyou-gcs.readr.tw/elections/2026/mayor/iframe.json'
let staticFileDestination = ''
const breakpoint = {
  sm: '768px',
  md: '1200px',
}

switch (releaseTarget) {
  case 'dev-mirrorMedia':
    assetPrefixPath = `https://dev.mirrormedia.mg/projects/${projectName}`
    mayorJsonEndpoint = DEV_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://dev.mirrormedia.mg/projects/${projectName}`
    break

  case 'mirrorMedia':
    assetPrefixPath = `https://www.mirrormedia.mg/projects/${projectName}`
    mayorJsonEndpoint = PROD_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://www.mirrormedia.mg/projects/${projectName}`
    break

  case 'dev-mirrorDaily':
    assetPrefixPath = `https://dev.mirrordaily.news/projects/${projectName}`
    mayorJsonEndpoint = DEV_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://dev.mirrordaily.news/projects/${projectName}`
    break

  case 'mirrorDaily':
    assetPrefixPath = `https://www.mirrordaily.news/projects/${projectName}`
    mayorJsonEndpoint = PROD_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://www.mirrordaily.news/projects/${projectName}`
    break

  case 'dev-mirrorTV':
    assetPrefixPath = `https://dev.mnews.tw/projects/${projectName}`
    mayorJsonEndpoint = DEV_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://dev.mnews.tw/projects/${projectName}`
    break

  case 'mirrorTV':
    assetPrefixPath = `https://www.mnews.tw/projects/${projectName}`
    mayorJsonEndpoint = PROD_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://www.mnews.tw/projects/${projectName}`
    break

  default:
    assetPrefixPath = '.'
    mayorJsonEndpoint = DEV_MAYOR_JSON_ENDPOINT
    staticFileDestination = ``
    break
}

export {
  assetPrefixPath,
  mayorJsonEndpoint,
  staticFileDestination,
  projectName,
  breakpoint,
}
