/*
gsutil -m cp -r ./out/* gs://v3-statics.mirrormedia.mg/projects/taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://v3-statics.mirrormedia.mg/projects/dev-taiwan-elections
gsutil -m cp -r ./out/* gs://readr-coverage/project/3/dev-taiwan-elections
--- dev ---
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://v3-statics-dev.mirrormedia.mg/projects/dev-taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://readr-coverage/project/3/dev-taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://static-mnews-tw-dev/projects/dev-taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://statics-dev.mirrordaily.news/projects/dev-taiwan-elections
--- prod ---
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://v3-statics.mirrormedia.mg/projects/taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://readr-coverage/project/3/taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://static-mnews-tw-prod/projects/taiwan-elections
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://statics-prod.mirrordaily.news/projects/taiwan-elections
*/
/**
 * @typedef {'readr-media' | 'mirror-media' | 'mirror-daily' | 'mirror-tv'} Organization
 * @typedef {'prod' | 'dev'} Env
 *
 */
/** @type {Organization} */
export const organization = 'readr-media'
// export const organization = 'mirror-media'
// export const organization = 'mirror-daily'
// export const organization = 'mirror-tv'

/** @typedef {boolean} isRunning - fetch isRunning data or not */
export const isRunning = false
export const isBackup = true
/** @type {Env} */
export const environment = 'dev' // 'dev | prod'
const ga4Ids = {
  'readr-media': {
    dev: 'G-YDKYSDG3RL',
    prod: 'G-4Z12TPZTMB',
  },
  'mirror-media': {
    dev: 'G-36HYH6NF6P',
    prod: 'G-341XFN0675',
  },
  'mirror-daily': {
    dev: 'G-0CGKWKQTJG',
    prod: 'G-26WVTWCT5X',
  },
  'mirror-tv': {
    dev: 'G-YZ07T9YJ6T',
    prod: 'G-SZR4JRJ0G2',
  },
}

export const ga4Id = ga4Ids[organization][environment]
const siteUrls = {
  'readr-media': {
    dev: 'https://www.readr.tw/project/3/dev-taiwan-elections',
    prod: 'https://www.readr.tw/project/3/taiwan-elections',
  },
  'mirror-media': {
    dev: 'https://www.mirrormedia.mg/projects/dev-taiwan-elections',
    prod: 'https://www.mirrormedia.mg/projects/taiwan-elections',
  },
  'mirror-tv': {
    dev: 'https://www.dev.mnews.tw/projects/dev-taiwan-elections',
    prod: 'https://www.mnews.tw/projects/taiwan-elections',
  },
  'mirror-daily': {
    dev: 'https://www.dev.mirrordaily.news/projects/dev-taiwan-elections',
    prod: 'https://www.mirrordaily.news/projects/taiwan-elections',
  },
}

export const siteUrl = siteUrls[organization][environment]

export const og = {
  title: '【持續更新】2025 立委罷免開票即時資訊',
  descriptioin:
    organization === 'readr-media'
      ? '2025 年立法委員罷免開票即時資訊、結果看 READr！提供最詳盡的選舉票數地圖、歷年比較等功能。'
      : organization === 'mirror-daily'
      ? '鏡報即時關注 2025 年立法委員罷免結果！提供最詳盡的選舉票數地圖、歷年比較等功能。'
      : organization === 'mirror-tv'
      ? '鏡新聞即時關注 2025 年立法委員罷免結果！提供最詳盡的選舉票數地圖、歷年比較等功能。'
      : '鏡週刊即時關注 2025 年立法委員罷免結果！提供最詳盡的選舉票數地圖、歷年比較等功能。',

  image:
    // 待更新
    organization === 'readr-media'
      ? 'https://v3-statics.mirrormedia.mg/images/ac988365-677b-4593-8c86-c54843f8900b-w1600.webP'
      : organization === 'mirror-daily'
      ? 'https://v3-statics.mirrormedia.mg/images/d1aa8800-3aaf-4d79-b080-b8a7c7e4effc-w1600.webP'
      : organization === 'mirror-tv'
      ? 'https://v3-statics.mirrormedia.mg/images/7775e28c-02c5-424e-9365-34be74fcfae8-w1600.webP'
      : 'https://v3-statics.mirrormedia.mg/images/6253d92d-e133-4222-a2b9-fe2d433a1e71-w1600.webP',
  url:
    organization === 'readr-media'
      ? environment === 'prod'
        ? 'https://www.readr.tw/project/3/taiwan-elections/index.html'
        : 'https://www.readr.tw/project/3/dev-taiwan-elections/index.html'
      : organization === 'mirror-daily'
      ? environment === 'prod'
        ? 'https://www.mirrordaily.news/projects/taiwan-elections/index.html'
        : 'https://dev.mirrordaily.news/projects/dev-taiwan-elections/index.html'
      : organization === 'mirror-tv'
      ? environment === 'prod'
        ? 'https://www.mnews.tw/projects/taiwan-elections/index.html'
        : 'https://dev.mnews.tw/projects/dev-taiwan-elections/index.html'
      : environment === 'prod'
      ? 'https://www.mirrormedia.mg/projects/taiwan-elections/index.html'
      : 'https://dev.mirrormedia.mg/projects/dev-taiwan-elections/index.html',
}
