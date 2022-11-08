export const defaultColor = '#AFAFAF'

export const partiesColor = [
  {
    index: 1,
    name: '國民黨',
    color: '#7CA1FF',
  },
  {
    index: 2,
    name: '民進黨',
    color: '#499A6C',
  },
  {
    index: 3,
    name: '民眾黨',
    color: '#7EDBDB',
  },
  {
    index: 4,
    name: '時代力量',
    color: '#FFD337',
  },
  {
    index: 5,
    name: '台灣團結聯盟',
    color: '#CB9869',
  },
  {
    index: 6,
    name: '社會民主黨',
    color: '#F777B4',
  },
  {
    index: 7,
    name: '勞動黨',
    color: '#E24747',
  },
  {
    index: 8,
    name: '親民黨',
    color: '#F7973F',
  },
  {
    index: 9,
    name: '台灣基進',
    color: '#BB4429',
  },
  {
    index: 10,
    name: '新黨',
    color: '#FCFF70',
  },
  {
    index: 11,
    name: '綠黨',
    color: '#B4FA94',
  },
  {
    index: 12,
    name: '無黨團結聯盟',
    color: '#B43F93',
  },
  {
    index: 999,
    name: '無黨籍',
    color: '#333333',
  },
]

const hexToRgba = (hex, alpha) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) console.error('hexToRgba not accept non hex color')
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  const a = alpha

  return `rgba(${r}, ${g}, ${b}, ${a})`
}

const getAlphaByPercent = (percent) => {
  if (percent <= 20) {
    return 0.2
  } else if (percent <= 40) {
    return 0.4
  } else if (percent <= 60) {
    return 0.6
  } else if (percent <= 80) {
    return 0.8
  } else if (percent <= 100) {
    return 1
  }
}

export const getGradiantPartyColor = (party, percent) => {
  const color =
    partiesColor.find((partyColor) => partyColor.name === party)?.color ||
    defaultColor

  return hexToRgba(color, getAlphaByPercent(percent))
}

const referendaColor = [
  {
    index: 1,
    name: '同意',
    color: '#6099DC',
  },
  {
    index: 2,
    name: '不同意',
    color: '#FF8585',
  },
]

export const getGradiantReferendaColor = (agree, percent) => {
  const [agreeColor, disagreeColor] = referendaColor
  const color = agree ? agreeColor.color : disagreeColor.color
  return hexToRgba(color, getAlphaByPercent(percent))
}
