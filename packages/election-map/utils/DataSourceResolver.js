import { getMappedDataSource, shouldMapDataSource } from './dataSourceMapping'

/**
 * DataSourceResolver - 統一處理資料源映射的工具類
 * 
 * 此類別封裝了所有與資料源映射相關的邏輯，
 * 提供統一的介面來處理 recall-july 等特殊情況的資料源映射
 */
export class DataSourceResolver {
  /**
   * 解析並返回正確的資料源配置
   * @param {Object} params - 參數物件
   * @param {string} params.electionType - 選舉類型
   * @param {string} params.subtypeKey - 子類型 key
   * @param {number} params.year - 年份
   * @returns {Object} 解析後的資料源配置
   */
  static resolveDataSource({ electionType, subtypeKey, year }) {
    const mappedSource = getMappedDataSource(electionType, subtypeKey)
    
    return {
      originalElectionType: electionType,
      originalSubtypeKey: subtypeKey,
      resolvedElectionType: mappedSource.electionType,
      resolvedSubtypeKey: mappedSource.subtypeKey,
      year,
      isMapped: shouldMapDataSource(electionType, subtypeKey)
    }
  }

  /**
   * 為 API 調用準備參數
   * @param {Object} params - 原始參數
   * @param {string} params.electionType - 選舉類型
   * @param {string} params.subtypeKey - 子類型 key
   * @param {number} params.year - 年份
   * @returns {Object} API 調用用的參數
   */
  static prepareApiParams({ electionType, subtypeKey, year }) {
    const resolved = this.resolveDataSource({ electionType, subtypeKey, year })
    
    return {
      electionType: resolved.resolvedElectionType,
      subtypeKey: resolved.resolvedSubtypeKey,
      year: resolved.year,
      _originalElectionType: resolved.originalElectionType,
      _originalSubtypeKey: resolved.originalSubtypeKey,
      _isMapped: resolved.isMapped
    }
  }

  /**
   * 檢查給定的組合是否需要資料映射
   * @param {string} electionType - 選舉類型
   * @param {string} subtypeKey - 子類型 key
   * @returns {boolean} 是否需要映射
   */
  static needsMapping(electionType, subtypeKey) {
    return shouldMapDataSource(electionType, subtypeKey)
  }

  /**
   * 取得映射說明文字（用於 debug 或日誌）
   * @param {string} electionType - 選舉類型
   * @param {string} subtypeKey - 子類型 key
   * @returns {string} 映射說明
   */
  static getMappingDescription(electionType, subtypeKey) {
    if (!this.needsMapping(electionType, subtypeKey)) {
      return `${electionType}.${subtypeKey} - 無需映射`
    }
    
    const resolved = this.resolveDataSource({ electionType, subtypeKey })
    return `${electionType}.${subtypeKey} -> ${resolved.resolvedElectionType}.${resolved.resolvedSubtypeKey} (臨時映射)`
  }
}

export default DataSourceResolver