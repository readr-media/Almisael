// export const organization = 'mirror-media'
/**
 * @typedef {'readr-media' | 'mirror-media'} Organization
 * @typedef {'prod' | 'dev'} Env
 *
 */
/** @type {Organization} */
export const organization = 'readr-media'
/** @type {Env} */
export const environment = 'dev' // 'dev | prod'

export const og = {
  title: '2024 總統、立委選舉開票即時資訊',
  descriptioin:
    organization === 'readr-media'
      ? '2024 年總統、立法委員結果看 READr！提供最詳盡的選舉票數地圖、歷年比較等功能。'
      : '鏡週刊即時關注 2024 年總統、立法委員結果！並且提供最詳盡的選舉票數地圖、歷年比較功能。',
  image:
    // 待更新
    organization === 'readr-media' ? '' : '',
  url:
    organization === 'readr-media'
      ? 'https://www.mirrormedia.mg/projects/election2023/index.html'
      : 'https://www.readr.tw/project/3/election2023/index.html',
}

/*
gsutil -m cp -r -a public-read ./out/* gs://statics.mirrormedia.mg/projects/election2022
gsutil -m cp -r ./out/* gs://readr-coverage/project/3/election2022
*/
