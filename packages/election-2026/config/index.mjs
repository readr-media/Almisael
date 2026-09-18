// 'mirrorMedia' | 'mirrorTV' | 'mirrorDaily'
const releaseTarget = process.env.NEXT_PUBLIC_RELEASE_TARGET
const projectName = 'election2026-homepage'
let assetPrefixPath = ''
let mayorJsonEndpoint = ''
const DEV_MAYOR_JSON_ENDPOINT =
  'https://whoareyou-gcs.readr.tw/elections-dev/2025/legislator/iframe/recall-july/iframe.json'
const PROD_MAYOR_JSON_ENDPOINT =
  'https://whoareyou-gcs.readr.tw/elections/2025/legislator/iframe/recall-july/iframe.json'
let staticFileDestination = ''
let breakpoint = {
  sm: '768px',
  md: '1200px',
}
let ga4Id = ''

const COLOR_SETTING_TV = {
  vectorLeft: 'tv-left',
  vectorRight: 'tv-right',
}

const COLOR_SETTING_MIRROR = {
  vectorLeft: 'mirror-left',
  vectorRight: 'mirror-right',
}

const COLOR_SETTING_DAILY = {
  vectorLeft: 'daily-left',
  vectorRight: 'daily-right',
}

let color = COLOR_SETTING_TV
switch (releaseTarget) {
  case 'dev-mirrorMedia':
    assetPrefixPath = `https://dev.mirrormedia.mg/projects/${projectName}`
    mayorJsonEndpoint = DEV_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://dev.mirrormedia.mg/projects/${projectName}`
    breakpoint = {
      sm: '768px',
      md: '1200px',
    }
    ga4Id = 'G-36HYH6NF6P'
    color = COLOR_SETTING_MIRROR
    break

  case 'mirrorMedia':
    assetPrefixPath = `https://www.mirrormedia.mg/projects/${projectName}`
    mayorJsonEndpoint = PROD_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://www.mirrormedia.mg/projects/${projectName}`
    breakpoint = {
      sm: '768px',
      md: '1200px',
    }
    ga4Id = 'G-341XFN0675'
    color = COLOR_SETTING_MIRROR
    break

  case 'dev-mirrorDaily':
    assetPrefixPath = `https://dev.mirrordaily.news/projects/${projectName}`
    mayorJsonEndpoint = DEV_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://dev.mirrordaily.news/projects/${projectName}`
    breakpoint = {
      sm: '768px',
      md: '1200px',
    }
    ga4Id = 'G-0CGKWKQTJG'
    color = COLOR_SETTING_DAILY
    break

  case 'mirrorDaily':
    assetPrefixPath = `https://www.mirrordaily.news/projects/${projectName}`
    mayorJsonEndpoint = PROD_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://www.mirrordaily.news/projects/${projectName}`
    breakpoint = {
      sm: '768px',
      md: '1200px',
    }
    ga4Id = 'G-26WVTWCT5X'
    color = COLOR_SETTING_DAILY
    break

  case 'dev-mirrorTV':
    assetPrefixPath = `https://dev.mnews.tw/projects/${projectName}`
    mayorJsonEndpoint = DEV_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://dev.mnews.tw/projects/${projectName}`
    breakpoint = {
      sm: '768px',
      md: '1200px',
    }
    ga4Id = 'G-YZ07T9YJ6T'
    color = COLOR_SETTING_TV
    break

  case 'mirrorTV':
    assetPrefixPath = `https://www.mnews.tw/projects/${projectName}`
    mayorJsonEndpoint = PROD_MAYOR_JSON_ENDPOINT
    staticFileDestination = `https://www.mnews.tw/projects/${projectName}`
    breakpoint = {
      sm: '768px',
      md: '1200px',
    }
    ga4Id = 'G-SZR4JRJ0G2'
    color = COLOR_SETTING_TV
    break

  default:
    assetPrefixPath = '.'
    mayorJsonEndpoint = DEV_MAYOR_JSON_ENDPOINT
    staticFileDestination = ``
    breakpoint = {
      sm: '768px',
      md: '1200px',
    }
    color = COLOR_SETTING_TV
    break
}

export {
  assetPrefixPath,
  mayorJsonEndpoint,
  staticFileDestination,
  projectName,
  breakpoint,
  color,
  ga4Id,
}
