// 'mirrorMedia' | 'mirrorTV' | 'readr'
const releaseTarget = process.env.NEXT_PUBLIC_RELEASE_TARGET
const projectName = 'dev-election2024-homepage-0102'
let assetPrefixPath = ''
let jsonEndpoint = ''
let staticFileDestination = ''
let watchMoreLinkSrc = ''
let breakpoint = '1200px'
let imageName = ''
const DARK_BLUE = '#153047'
const BLACK = '#000000'
const COLOR_SETTING_MM_TV = {
  title: DARK_BLUE,
  subTitle: { text: '#ffcc01', background: DARK_BLUE },
  background: { normal: '#f5f5f5', victor: '#EAEAEA' },
  candidateName: DARK_BLUE,
  infoBox: {
    dark: DARK_BLUE,
    light: '#004ebc',
    border: '#c2c2c2',
  },
  caption: DARK_BLUE,
  update: '#9b9b9b',
  watchMore: DARK_BLUE,
}
const COLOR_SETTING_READR = {
  title: BLACK,
  subTitle: { text: '#EBF02C', background: BLACK },
  background: { normal: '#EBF02C', victor: '#E3E836' },
  candidateName: BLACK,
  infoBox: {
    dark: BLACK,
    light: '#727272',
    border: '#FFFFFF',
  },
  caption: BLACK,
  update: '#727272',
  watchMore: BLACK,
}
let color = COLOR_SETTING_MM_TV
switch (releaseTarget) {
  case 'dev-mirrorMedia':
    assetPrefixPath = `https://dev.mirrormedia.mg/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://dev.mirrormedia.mg/projects/${projectName}`
    watchMoreLinkSrc =
      'https://www.mirrormedia.mg/projects/election2024/index.html?utm_source=mmweb&utm_medium=dev_election2024'
    breakpoint = '1200px'
    imageName = 'weekly_1200x630'
    color = COLOR_SETTING_MM_TV

    break

  case 'mirrorMedia':
    assetPrefixPath = `https://www.mirrormedia.mg/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://www.mirrormedia.mg/projects/${projectName}`
    watchMoreLinkSrc =
      'https://www.mirrormedia.mg/projects/election2024/index.html?utm_source=mmweb&utm_medium=election2024'
    breakpoint = '1200px'
    imageName = 'weekly_1200x630'
    color = COLOR_SETTING_MM_TV
    break

  case 'dev-mirrorTV':
    assetPrefixPath = `https://dev.mnews.tw/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://dev.mnews.tw/projects/${projectName}`
    watchMoreLinkSrc =
      'https://dev.mnews.tw/projects/dev-election2024/index.html?utm_source=homepage&utm_medium=election2024'
    breakpoint = '1127px'
    color = COLOR_SETTING_MM_TV
    imageName = 'news_1200x630'
    break

  case 'mirrorTV':
    assetPrefixPath = `https://www.mnews.tw/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://www.mnews.tw/projects/${projectName}`
    watchMoreLinkSrc =
      'https://www.mnews.tw/projects/election2024/index.html?utm_source=homepage&utm_medium=election2024'
    breakpoint = '1127px'
    color = COLOR_SETTING_MM_TV
    imageName = 'news_1200x630'
    break
  case 'readr':
    assetPrefixPath = `https://www.readr.tw/project/3/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024cec_homepage.json'
    staticFileDestination = `https://www.readr.tw/project/3/${projectName}`
    watchMoreLinkSrc =
      'https://www.readr.tw/project/3/election2024/index.html?utm_source=READr&utm_medium=election2024'
    breakpoint = '1200px'
    color = COLOR_SETTING_READR
    imageName = 'readr_1200x630'
    break
  default:
    assetPrefixPath = '.'
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `http://localhost:3000`
    watchMoreLinkSrc = '.'
    breakpoint = '1200px'
    color = COLOR_SETTING_MM_TV
    imageName = 'weekly_1200x630'
    break
}

export {
  assetPrefixPath,
  jsonEndpoint,
  staticFileDestination,
  projectName,
  watchMoreLinkSrc,
  breakpoint,
  color,
  imageName,
}
