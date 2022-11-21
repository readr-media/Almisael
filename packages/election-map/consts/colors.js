export const defaultColor = '#AFAFAF'

export const partiesColor = [
  {
    index: 1,
    name: '中國國民黨',
    color: '#7CA1FF',
  },
  {
    index: 2,
    name: '民主進步黨',
    color: '#499A6C',
  },
  {
    index: 3,
    name: '台灣民眾黨',
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
  {
    index: 1000,
    name: '其他政黨',
    color: '#958090',
  },
  {
    index: 1001,
    name: '開票中',
    color: '#fff',
  },
]

const hexToRgba = (hex, alpha) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) console.error('hexToRgba not accept non hex color')

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: alpha,
  }
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

// get rgb from rgba with white(rgba(255,255,255,1)) background
const rgbaToRgb = (rgbaObj, bg = { r: 255, g: 255, b: 255, a: 1 }) => {
  bg.a = 1 - rgbaObj.a
  const r = Math.round(
    (rgbaObj.a * (rgbaObj.r / 255) + bg.a * (bg.r / 255)) * 255
  )
  const g = Math.round(
    (rgbaObj.a * (rgbaObj.g / 255) + bg.a * (bg.g / 255)) * 255
  )
  const b = Math.round(
    (rgbaObj.a * (rgbaObj.b / 255) + bg.a * (bg.b / 255)) * 255
  )
  return `rgb(${r}, ${g}, ${b})`
}

export const getPartyColor = (party) => {
  const color =
    partiesColor.find((partyColor) => party.startsWith(partyColor.name))
      ?.color || partiesColor[partiesColor.length - 1].color
  return color
}

export const getGradiantPartyColor = (party, percent) => {
  const color =
    partiesColor.find((partyColor) => partyColor.name === party)?.color ||
    partiesColor[partiesColor.length - 1].color

  return rgbaToRgb(hexToRgba(color, getAlphaByPercent(percent)))
}

const referendumColor = [
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

export const getGradiantReferendumColor = (agree, percent) => {
  const [agreeColor, disagreeColor] = referendumColor
  const color = agree ? agreeColor.color : disagreeColor.color
  return rgbaToRgb(hexToRgba(color, getAlphaByPercent(percent)))
}

export const electionMapColor = '#fff1db'
