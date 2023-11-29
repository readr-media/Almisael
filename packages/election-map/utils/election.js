/**
 * Merge all referendum number in all years.
 * @param {import("../consts/electionsConifg").ElectionConfig} electionConfig
 * @returns {Array<import("../consts/electionsConifg").ReferendumNumber>}
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
