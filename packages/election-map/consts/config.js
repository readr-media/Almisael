// export const organization = 'mirror-media'
/**
 * @typedef {'readr-media' | 'mirror-media'} Organization
 * @typedef {'prod' | 'dev'} Env
 *
 */
/** @type {Organization} */
export const organization = 'readr-media'
/** @type {Env} */
export const environment = 'prod' // 'dev | prod'

/*
gsutil -m cp -r -a public-read ./out/* gs://statics.mirrormedia.mg/projects/election2022
gsutil -m cp -r -a public-read ./out/* gs://readr-coverages/3/election2022
*/
