export default {}

/**
 *  @typedef  {Object}             ResizedImages
 *  @property {string}             [original]
 *  @property {string}             [w480]
 *  @property {string}             [w800]
 *  @property {string}             [w1200]
 *  @property {string}             [w1600]
 *  @property {string}             [w2400]
 */

/**
 *  @typedef  {Object}              ImageFile
 *  @property {string}              [url]
 */

/**
 *  @typedef  {Object}              Photo
 *  @property {string}              [id]
 *  @property {string}              [name]
 *  @property {string}              [urlOriginal]
 *  @property {ResizedImages|null}  [resized]
 *  @property {ImageFile|null}      [imageFile]
 */

/**
 *  @typedef  {Object}              Post
 *  @property {number|string}       id
 *  @property {string}              [name]
 *  @property {string}              [title]
 *  @property {number}              [readingTime]
 *  @property {string}              [publishTime]
 *  @property {Photo|null}          [heroImage]
 *  @property {string}              [link]
 */
