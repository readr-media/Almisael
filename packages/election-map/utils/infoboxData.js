/**
 *
 * @typedef {import('./electionsData').ElectionType} ElectionType
 * @typedef {0 | 1 | 2 | 3} Level
 * @typedef {'mobile' | 'desktop'} InfoboxType
 * @typedef {any} ElectionData
 * @typedef {number} Year
 * @typedef {import('./electionsData').MapData['isRunning']} isRunning
 * @typedef {import('./electionsData').MapData['isStarted']} isStarted
 * @typedef {import('../consts/electionsConfig').ElectionSubtype} ElectionSubtype
 */

import { currentYear } from '../consts/electionsConfig'

/**
 * TODOs:
 * 1. add type of params `data`
 * @param {ElectionData} data
 * @param {Level} level
 * @param {number} year
 * @param {isStarted} isStarted
 */
const presidentInfoboxData = (data, level, year, isStarted, isRunning) => {
  if (!data) {
    return '無資料'
  }

  if (!isStarted) {
    return '目前無票數資料'
  }

  if (year === currentYear && !data.profRate && level === 3) {
    return isRunning ? '目前即時開票無村里資料' : '無資料'
  }

  if (data.profRate === null) {
    return '資料錯誤，請確認'
  }

  return data
}
/**
 * TODOs:
 * 1. add type of params `data`
 * @param {ElectionData} data
 * @param {Level} level
 * @param {Year} year
 * @param {isStarted} isStarted
 * @param {InfoboxType} infoboxType
 */
const mayorInfoboxData = (
  data,
  level,
  year,
  isStarted,
  isRunning,
  infoboxType
) => {
  if (level === 0) {
    if (infoboxType === 'mobile') {
      return ''
    }
    return '點擊地圖看更多資料'
  }

  if (year === 2022 && data === '10020') {
    return '嘉義市長選舉改期至2022/12/18'
  }

  if (!isStarted) {
    return '目前無票數資料'
  }

  if (!data) {
    if (year === 2010) {
      return '2010為直轄市長及直轄市議員選舉，此區無資料'
    }
    return '此區無資料'
  }

  if (year === currentYear && !data.profRate && level === 3) {
    return isRunning ? '目前即時開票無村里資料' : '無資料'
  }

  if (data.profRate === null) {
    return '資料錯誤，請確認'
  }

  return data
}

/**
 * TODOs:
 * 1. add type of params `data`
 * @param {ElectionData} data
 * @param {Level} level
 * @param {Year} year
 * @param {isStarted} isStarted
 * @param {InfoboxType} infoboxType
 */
const councilMemberInfoboxData = (
  data,
  level,
  year,
  isStarted,
  isRunning,
  infoboxType
) => {
  if (level === 0) {
    if (infoboxType === 'mobile') {
      return ''
    }
    return '點擊地圖看更多資料'
  }

  if (!isStarted) {
    return '目前無票數資料'
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    if (year === 2010) {
      return '2010為直轄市長及直轄市議員選舉，此區無資料'
    }
    return '此區無資料'
  }

  if (year === currentYear && level === 3 && data[0].profRate === null) {
    return isRunning ? '目前即時開票無村里資料' : '無資料'
  }

  if (data.profRate === null) {
    console.error(`data error for mayor infoboxData in level ${level}`, data)
    return '資料錯誤，請確認'
  }

  return data
}

/**
 * TODOs:
 * 1. add type of params `data`
 * @param {ElectionData} data
 * @param {Level} level
 * @param {Year} year
 * @param {isStarted} isStarted
 * @param {ElectionSubtype} subtype
 * @param {InfoboxType} infoboxType
 */
const legislatorInfoboxData = (
  data,
  level,
  year,
  isStarted,
  isRunning,
  subtype,
  infoboxType
) => {
  // normal level 0 點擊地圖看更多
  if (subtype?.key === 'normal' && level === 0) {
    if (infoboxType === 'mobile') {
      return ''
    }
    return '點擊地圖看更多資料'
  }

  if (!isStarted) {
    return '目前無票數資料'
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return '此區無資料'
  }

  if (year === currentYear && level === 3 && data[0].profRate === null) {
    return isRunning ? '目前即時開票無村里資料' : '無資料'
  }

  if (data.profRate === null) {
    console.error(`data error for mayor infoboxData in level ${level}`, data)
    return '資料錯誤，請確認'
  }

  return data
}

/**
 * TODOs:
 * 1. add type of params `data`
 * @param {ElectionData} data
 * @param {Level} level
 * @param {Year} year
 * @param {isStarted} isStarted
 */
const referendumInfoboxData = (data, level, year, isStarted, isRunning) => {
  if (!isStarted) {
    return '目前無票數資料'
  }

  if (!data) {
    return '此區無資料'
  }

  if (year === currentYear && !data.profRate && level === 3) {
    return isRunning ? '目前即時開票無村里資料' : '無資料'
  }

  if (data.profRate === null) {
    return '資料錯誤，請確認'
  }

  return data
}

/**
 *
 * @param {ElectionType} electionsType
 * @param {InfoboxType} [infoboxType]
 */
const getInfoBoxData = (electionsType, infoboxType = 'desktop') => {
  switch (electionsType) {
    case 'president':
      return (data, level, year, isStarted, isRunning) =>
        presidentInfoboxData(data, level, year, isStarted, isRunning)

    case 'mayor':
      return (data, level, year, isStarted, isRunning) =>
        mayorInfoboxData(data, level, year, isStarted, isRunning, infoboxType)

    case 'legislator':
      return (data, level, year, isStarted, isRunning, subtype) =>
        legislatorInfoboxData(
          data,
          level,
          year,
          isStarted,
          isRunning,
          subtype,
          infoboxType
        )

    case 'councilMember':
      return (data, level, year, isStarted, isRunning) =>
        councilMemberInfoboxData(
          data,
          level,
          year,
          isStarted,
          isRunning,
          infoboxType
        )
    case 'referendum':
      return (data, level, year, isStarted, isRunning) =>
        referendumInfoboxData(data, level, year, isStarted, isRunning)
  }
}

export { getInfoBoxData }
