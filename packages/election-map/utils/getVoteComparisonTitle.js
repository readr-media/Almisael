/**
 * @typedef {import('../consts/electionsConifg').ElectionType} ElectionType
 */

/**
 * Generates the title for vote-comparison based on election `type` and `subtypeKey`.
 *
 * @param {ElectionType} type
 * @param {string} [subtypeKey]
 * @return {string}
 */
export const getVoteComparisonTitle = (type, subtypeKey) => {
  const titleList = {
    mayor: '縣市首長候選人',
    councilMember: '縣市議員候選人',
    president: '正副總統候選人',
    legislator: {
      party: '不分區政黨',
      plainIndigenous: '平地原住民候選人',
      mountainIndigenous: '山地原住民候選人',
      district: '區域立委候選人',
    },
    referendum: '全國性公投',
  }

  return titleList[type] ? titleList[type][subtypeKey] || titleList[type] : ''
}
