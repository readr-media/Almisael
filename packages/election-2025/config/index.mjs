// 'mirrorMedia' | 'mirrorTV' | 'readr'
const releaseTarget = process.env.NEXT_PUBLIC_RELEASE_TARGET
const projectName = 'election2025-homepage'
let assetPrefixPath = ''
let mnewsJsonEndpoint = ''
let cecJsonEndpoint = ''
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

const COLOR_SETTING_READR = {
  vectorLeft: 'readr-left',
  vectorRight: 'readr-right',
}

let color = COLOR_SETTING_TV
switch (releaseTarget) {
  case 'dev-mirrorMedia':
    assetPrefixPath = `https://dev.mirrormedia.mg/projects/${projectName}`
    cecJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/elections-dev/2025_recall_election_data_final/iframe_data.json'
    mnewsJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/json/202507_recall_iframe.json'
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
    cecJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/elections-dev/2025_recall_election_data_final/iframe_data.json'
    mnewsJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/json/202507_recall_iframe.json'
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
    cecJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/elections-dev/2025_recall_election_data_final/iframe_data.json'
    mnewsJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/json/202507_recall_iframe.json'
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
    cecJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/elections-dev/2025_recall_election_data_final/iframe_data.json'
    mnewsJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/json/202507_recall_iframe.json'
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
    cecJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/elections-dev/2025_recall_election_data_final/iframe_data.json'
    mnewsJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/json/202507_recall_iframe.json'
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
    cecJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/elections-dev/2025_recall_election_data_final/iframe_data.json'
    mnewsJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/json/202507_recall_iframe.json'
    staticFileDestination = `https://www.mnews.tw/projects/${projectName}`
    breakpoint = {
      sm: '768px',
      md: '1200px',
    }
    ga4Id = 'G-SZR4JRJ0G2'
    color = COLOR_SETTING_TV
    break

  case 'dev-readr':
    assetPrefixPath = `https://www.readr.tw/project/3/${projectName}`
    cecJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/elections-dev/2025_recall_election_data_final/iframe_data.json'
    mnewsJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/json/202507_recall_iframe.json'
    staticFileDestination = `https://www.readr.tw/project/3/${projectName}`
    breakpoint = {
      sm: '768px',
      md: '1200px',
    }
    ga4Id = 'G-YDKYSDG3RL'
    color = COLOR_SETTING_READR
    break

  case 'readr':
    assetPrefixPath = `https://www.readr.tw/project/3/${projectName}`
    cecJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/elections-dev/2025_recall_election_data_final/iframe_data.json'
    mnewsJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/json/202507_recall_iframe.json'
    staticFileDestination = `https://www.readr.tw/project/3/${projectName}`
    breakpoint = {
      sm: '768px',
      md: '1200px',
    }
    ga4Id = 'G-4Z12TPZTMB'
    color = COLOR_SETTING_READR
    break

  default:
    assetPrefixPath = '.'
    cecJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/elections-dev/2025_recall_election_data_final/iframe_data.json'
    mnewsJsonEndpoint =
      'https://whoareyou-gcs.readr.tw/json/202507_recall_iframe.json'
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
  cecJsonEndpoint,
  mnewsJsonEndpoint,
  staticFileDestination,
  projectName,
  breakpoint,
  color,
  ga4Id,
}
