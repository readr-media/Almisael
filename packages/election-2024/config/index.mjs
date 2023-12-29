// 'mirrorMedia' | 'mirrorTV' | 'readr'
const releaseTarget = process.env.NEXT_PUBLIC_RELEASE_TARGET
const projectName = 'dev-election2024-homepage-1229-5'
let assetPrefixPath = ''
let jsonEndpoint = ''
let staticFileDestination = ''
let watchMoreLinkSrc = ''
let breakpoint = '1200px'
switch (releaseTarget) {
  case 'dev-mirrorMedia':
    assetPrefixPath = `https://dev.mirrormedia.mg/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://dev.mirrormedia.mg/projects/${projectName}`
    watchMoreLinkSrc =
      'https://www.mirrormedia.mg/projects/election2024/index.html?utm_source=mmweb&utm_medium=dev_election2024'
    breakpoint = '1200px'
    break

  case 'mirrorMedia':
    assetPrefixPath = `https://www.mirrormedia.mg/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://www.mirrormedia.mg/projects/${projectName}`
    watchMoreLinkSrc =
      'https://www.mirrormedia.mg/projects/election2024/index.html?utm_source=mmweb&utm_medium=election2024'
    breakpoint = '1200px'
    break

  case 'dev-mirrorTV':
    assetPrefixPath = `https://dev.mnews.tw/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://dev.mnews.tw/projects/${projectName}`
    watchMoreLinkSrc =
      'https://dev.mnews.tw/projects/dev-election2024/index.html?utm_source=homepage&utm_medium=election2024'
    breakpoint = '1127px'
    break

  case 'mirrorTV':
    assetPrefixPath = `https://www.mnews.tw/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://www.mnews.tw/projects/${projectName}`
    watchMoreLinkSrc =
      'https://www.mnews.tw/projects/election2024/index.html?utm_source=homepage&utm_medium=election2024'
    breakpoint = '1127px'

    break
  case 'readr':
    assetPrefixPath = `https://www.readr.tw/project/3/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024cec_homepage.json'
    staticFileDestination = `https://www.readr.tw/project/3/${projectName}`
    watchMoreLinkSrc =
      'https://www.readr.tw/project/3/election2024/index.html?utm_source=READr&utm_medium=election2024'
    breakpoint = '1200px'

    break
  default:
    assetPrefixPath = '.'
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `http://localhost:3000`
    watchMoreLinkSrc = '.'
    breakpoint = '1200px'

    break
}

export {
  assetPrefixPath,
  jsonEndpoint,
  staticFileDestination,
  projectName,
  watchMoreLinkSrc,
  breakpoint,
}
