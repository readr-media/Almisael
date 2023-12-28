// export const organization = 'mirror-media'
/**
 * @typedef {'readr-media' | 'mirror-media'} Organization
 * @typedef {'prod' | 'dev'} Env
 *
 */
/** @type {Organization} */
export const organization = 'readr-media'
// export const organization = 'mirror-media'
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
}

export const ga4Id = ga4Ids[organization][environment]

export const og = {
  title: '2024 總統、立委選舉開票即時資訊',
  descriptioin:
    organization === 'readr-media'
      ? '2024 年總統、立法委員結果看 READr！提供最詳盡的選舉票數地圖、歷年比較等功能。'
      : '鏡週刊即時關注 2024 年總統、立法委員結果！並且提供最詳盡的選舉票數地圖、歷年比較功能。',
  image:
    // 待更新
    organization === 'readr-media'
      ? 'https://v3-statics.mirrormedia.mg/images/16d67652-9355-4a47-b2da-e3b8801802f9-w1600.png'
      : 'https://v3-statics.mirrormedia.mg/images/669355dc-9e08-456e-af3c-19b0dc69a600-w1600.png',
  url:
    organization === 'readr-media'
      ? 'https://www.mirrormedia.mg/projects/election2023/index.html'
      : 'https://www.readr.tw/project/3/election2023/index.html',
}

/*
gsutil -m cp -r ./out/* gs://v3-statics.mirrormedia.mg/projects/election2022
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://v3-statics.mirrormedia.mg/projects/dev-election2024
gsutil -m cp -r ./out/* gs://readr-coverage/project/3/election2022
gsutil -h "Cache-Control:no-store" -m cp -r ./out/* gs://readr-coverage/project/3/dev-election2024
*/
