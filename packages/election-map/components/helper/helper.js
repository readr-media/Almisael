/**
 * Deep clone an object using JSON.parse and JSON.stringify.
 *
 * @template T
 * @param {T} obj - The object to be deep cloned.
 * @returns {T} - The deep cloned object.
 */
export const deepCloneObj = (obj) => JSON.parse(JSON.stringify(obj))
