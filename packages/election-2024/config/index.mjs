// 'mirrorMedia' | 'mirrorTV' | 'readr'
const releaseTarget = process.env.NEXT_PUBLIC_RELEASE_TARGET
const projectName = 'dev-election2024-homepage-0110-8'
let assetPrefixPath = ''
let jsonEndpoint = ''
let staticFileDestination = ''
let watchMoreLinkSrc = ''
let breakpoint = '1200px'
let imageName = ''
let alwaysShow = false
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
      'https://www.mirrormedia.mg/projects/taiwan-elections/index.html?utm_source=mmapp&utm_medium=election2024'
    breakpoint = '1024px'
    imageName = 'weekly_970x250'
    color = COLOR_SETTING_MM_TV
    alwaysShow = true
    break

  case 'mirrorMedia':
    assetPrefixPath = `https://www.mirrormedia.mg/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://www.mirrormedia.mg/projects/${projectName}`
    watchMoreLinkSrc =
      'https://www.mirrormedia.mg/projects/taiwan-elections/index.html?utm_source=mmapp&utm_medium=election2024'
    breakpoint = '1024px'
    imageName = 'weekly_970x250'
    color = COLOR_SETTING_MM_TV
    alwaysShow = false
    break

  case 'dev-mirrorTV':
    assetPrefixPath = `https://dev.mnews.tw/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://dev.mnews.tw/projects/${projectName}`
    watchMoreLinkSrc =
      'https://dev.mnews.tw/projects/dev-election2024/index.html?utm_source=homepage&utm_medium=election2024'
    breakpoint = '1120px'
    color = COLOR_SETTING_MM_TV
    imageName = 'news_970x250'
    alwaysShow = true
    break

  case 'mirrorTV':
    assetPrefixPath = `https://www.mnews.tw/projects/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = `https://www.mnews.tw/projects/${projectName}`
    watchMoreLinkSrc =
      'https://www.mnews.tw/projects/election2024/index.html?utm_source=homepage&utm_medium=election2024'
    breakpoint = '1120px'
    color = COLOR_SETTING_MM_TV
    imageName = 'news_970x250'
    alwaysShow = false
    break
  case 'readr':
    assetPrefixPath = `https://www.readr.tw/project/3/${projectName}`
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024cec_homepage.json'
    staticFileDestination = `https://www.readr.tw/project/3/${projectName}`
    watchMoreLinkSrc =
      'https://www.readr.tw/project/3/taiwan-elections?utm_source=READr&utm_medium=election2024'
    breakpoint = '1200px'
    color = COLOR_SETTING_READR
    imageName = 'readr_970x250'
    break
  default:
    assetPrefixPath = '.'
    jsonEndpoint = 'https://whoareyou-gcs.readr.tw/json/2024homepage.json'
    staticFileDestination = ``
    watchMoreLinkSrc = '.'
    breakpoint = '1024px'
    color = COLOR_SETTING_MM_TV
    imageName = 'weekly_970x250'
    alwaysShow = true
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
  alwaysShow,
}
