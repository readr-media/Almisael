import { isRecallSubtype } from './recallValidator'

/**
 * Data source mapping configuration.
 * Used to manage temporary data source mapping rules for recall subtypes.
 *
 * This configuration file allows for easy management and future modification of data mapping logic.
 * When the API is updated, only the mapping rules in this file need to be modified.
 */

/**
 * Data source mapping configuration for recall subtypes.
 * @typedef {Object} RecallDataSourceMapping
 * @property {string} sourceElectionType - The source election type.
 * @property {string} note - A descriptive note.
 */

/** @type {RecallDataSourceMapping} */
export const recallDataSourceMapping = {
  sourceElectionType: 'legislator',
  note: 'Uses an independent recall data source; the API now supports dynamic recall data.',
}

/**
 * Checks if a data source mapping is required.
 * @param {string} electionType - The election type.
 * @param {string} subtypeKey - The subtype key.
 * @returns {boolean} Whether a mapping is required.
 */
export const shouldMapDataSource = (electionType, subtypeKey) => {
  return electionType === 'legislator' && isRecallSubtype(subtypeKey)
}

/**
 * Gets the mapped data source configuration.
 * @param {string} electionType - The original election type.
 * @param {string} subtypeKey - The original subtype key.
 * @returns {{electionType: string, subtypeKey: string}} The mapped configuration.
 */
export const getMappedDataSource = (electionType, subtypeKey) => {
  if (shouldMapDataSource(electionType, subtypeKey)) {
    return {
      electionType: recallDataSourceMapping.sourceElectionType,
      subtypeKey: subtypeKey,
    }
  }

  return { electionType, subtypeKey }
}

/**
 * Legacy function for backward compatibility.
 * This function maintains compatibility with the existing mockUtils.js.
 * @param {string} electionType - The election type.
 * @returns {string} The mapped election type.
 */
export const mapRecallToLegislator = (electionType) => {
  if (isRecallSubtype(electionType)) {
    return recallDataSourceMapping.sourceElectionType
  }
  return electionType
}
