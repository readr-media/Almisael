/**
 * 資料源映射配置
 * 用於管理 recall-july subtype 的臨時資料源映射規則
 * 
 * 此配置檔案允許輕鬆管理和未來修改資料映射邏輯
 * 當 API 更新後，只需要修改此檔案中的映射規則即可
 */

/**
 * recall-july subtype 的資料源映射配置
 * @typedef {Object} RecallDataSourceMapping
 * @property {string} sourceElectionType - 來源選舉類型
 * @property {string} sourceSubtype - 來源子類型
 * @property {string} note - 備註說明
 */

/** @type {RecallDataSourceMapping} */
export const recallJulyDataSourceMapping = {
  sourceElectionType: 'legislator',
  sourceSubtype: 'recall-july', // { name: '罷免', key: 'recall-july', mobileOnly: false }
  note: '使用獨立的罷免資料源，API 已支援 recall-july 資料'
}

/**
 * 檢查是否需要進行資料源映射
 * @param {string} electionType - 選舉類型
 * @param {string} subtypeKey - 子類型 key
 * @returns {boolean} 是否需要映射
 */
export const shouldMapDataSource = (electionType, subtypeKey) => {
  return electionType === 'legislator' && subtypeKey === 'recall-july'
}

/**
 * 取得映射後的資料源配置
 * @param {string} electionType - 原始選舉類型
 * @param {string} subtypeKey - 原始子類型 key
 * @returns {{electionType: string, subtypeKey: string}} 映射後的配置
 */
export const getMappedDataSource = (electionType, subtypeKey) => {
  if (shouldMapDataSource(electionType, subtypeKey)) {
    return {
      electionType: recallJulyDataSourceMapping.sourceElectionType,
      subtypeKey: recallJulyDataSourceMapping.sourceSubtype
    }
  }
  
  return { electionType, subtypeKey }
}

/**
 * Legacy 函數：向後相容性
 * 此函數保持與現有 mockUtils.js 的相容性
 * @param {string} electionType - 選舉類型
 * @returns {string} 映射後的選舉類型
 */
export const mapRecallToLegislator = (electionType) => {
  if (electionType === 'recall-july') {
    return recallJulyDataSourceMapping.sourceElectionType
  }
  return electionType
}