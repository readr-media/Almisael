import { electionsConfig } from '../consts/electionsConfig'

/**
 * Merge all referendum number in all years.
 * @param {import("../consts/electionsConfig").ElectionConfig} electionConfig
 * @returns {Array<import("../consts/electionsConfig").ReferendumNumber>}
 */
export const getReferendumNumbers = (electionConfig) => {
  if (!electionConfig.electionType.startsWith('referendum')) {
    return []
  }
  return electionConfig.years.reduce((numbers, year) => {
    numbers = numbers.concat(year.numbers)
    return numbers
  }, [])
}

export const electionNamePairs = electionsConfig.map(
  ({ electionType, electionName }) => ({
    electionType,
    electionName,
  })
)
