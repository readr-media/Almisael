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
export const isBackup = false
/** @type {Env} */
export const environment = 'prod' // 'dev | prod'
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
      ? 'https://v3-statics.mirrormedia.mg/images/80c88d20-5028-4116-bfd9-19a51b7f17ce-w1600.webP'
      : organization === 'mirror-daily'
      ? 'https://v3-statics.mirrormedia.mg/images/4986c143-616d-49f2-a669-a58f474e4fb7-w1600.webP'
      : organization === 'mirror-tv'
      ? 'https://v3-statics.mirrormedia.mg/images/a10a31de-a44f-4972-84cd-63b4c0a48249-w1600.webP'
      : 'https://v3-statics.mirrormedia.mg/images/ae4e3049-5ddf-4469-bfe1-2377cbc9debf-w1600.webP',
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
