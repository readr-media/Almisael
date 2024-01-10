import { organization } from './config'

export const defaultColor = '#AFAFAF'

export const partiesColor = [
  {
    index: 1,
    name: '中國國民黨',
    color: '#002FD7',
    colors: ['#183193', '#122F9A', '#3356D8', '#5478FF', '#89A2FF'],
  },
  {
    index: 2,
    name: '民主進步黨',
    color: '#005F48',
    colors: ['#18513B', '#165642', '#337C65', '#5CB096', '#80D4BA'],
  },
  {
    index: 3,
    name: '台灣民眾黨',
    color: '#0093C1',
    colors: ['#0E879D', '#1BA2BF', '#47C1E3', '#80DDF1', '#AAF0FF'],
  },
  {
    index: 4,
    name: '時代力量',
    color: '#DAAA00',
    colors: ['#C88F00', '#DDA310', '#F9BE01', '#FFDA7B', '#FFE7A8'],
  },
  {
    index: 5,
    name: '台灣團結聯盟',
    color: '#AF5E14',
    colors: ['#633E09', '#693D00', '#AB6300', '#D28A27', '#F6BB6A'],
  },
  {
    index: 6,
    name: '社會民主黨',
    color: '#ED0071',
    colors: ['#A7093B', '#C90D4C', '#E7316E', '#FA5F93', '#FF86AE'],
  },
  {
    index: 7,
    name: '勞動黨',
    color: '#AB1616',
    colors: ['#8C1F18', '#9C241F', '#BC423D', '#D9716C', '#F6A39F'],
  },
  {
    index: 8,
    name: '親民黨',
    color: '#FF7A00',
    colors: ['#DF5609', '#E25100', '#F27C0E', '#FE9634', '#FFAF64'],
  },
  {
    index: 9,
    name: '台灣基進',
    color: '#E25100',
    colors: ['#77250E', '#952C11', '#A73F24', '#CE674C', '#DD856E'],
  },
  {
    index: 10,
    name: '新黨',
    color: '#ECF100',
    colors: ['#DCC603', '#EFD915', '#FFF500', '#FFFA81', '#FFFCA9'],
  },
  {
    index: 11,
    name: '綠黨',
    color: '#69D437',
    colors: ['#3B920F', '#51C21C', '#77E046', '#9FFF73', '#69D437'],
  },
  {
    index: 12,
    name: '無黨團結聯盟',
    color: '#922673',
    colors: ['#600000', '#92001A', '#C20F51', '#DF4981', '#D18DA6'],
  },
  {
    index: 998,
    name: '席次尚未確認',
    color: '#fff',
  },
  {
    index: 999,
    name: '無黨籍',
    color: '#5C5C5C',
    colors: ['#272727', '#4A4A4A', '#666666', '#818181', '#B1B1B1'],
  },
  {
    index: 1000,
    name: '其他政黨',
    color: '#958090',
    colors: ['#634455', '#966982', '#958090', '#C3B4BD', '#E8DFE4'],
  },
]

export const hexToRgba = (hex, alpha) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) console.error('hexToRgba not accept non hex color', hex)

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: alpha,
  }
}

export const getAlphaByPercent = (percent) => {
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

const getColorIndexByPercent = (percent) => {
  if (percent <= 20) {
    return 4
  } else if (percent <= 40) {
    return 3
  } else if (percent <= 60) {
    return 2
  } else if (percent <= 80) {
    return 1
  } else if (percent <= 100) {
    return 0
  }
}

// get rgb from rgba with white(rgba(255,255,255,1)) background
export const rgbaToRgb = (rgbaObj, bg = { r: 255, g: 255, b: 255, a: 1 }) => {
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
    partiesColor.find((partyColor) => party?.startsWith(partyColor.name))
      ?.colors[2] || partiesColor[partiesColor.length - 1].colors[2]
  return color
}

export const getGradiantPartyColor = (party, percent) => {
  const colorIndex = getColorIndexByPercent(percent)
  const color =
    partiesColor.find((partyColor) => party?.startsWith(partyColor.name))
      ?.colors[colorIndex] ||
    partiesColor[partiesColor.length - 1].colors[colorIndex]

  return color
}

const referendumColor = [
  {
    index: 1,
    name: '同意',
    color: '#006DED',
    colors: ['#1A69C6', '#448DE3', '#61A5F5', '#9CCAFF', '#BEDCFF'],
  },
  {
    index: 2,
    name: '不同意',
    color: '#FF2121',
    colors: ['#D74A47', '#ED4541', '#E55C5C', '#FA9E9C', '#FFC3C1'],
  },
]

export const getGradiantReferendumColor = (agree, percent) => {
  const [agreeColor, disagreeColor] = referendumColor
  const colorIndex = getColorIndexByPercent(percent)
  const color = agree
    ? agreeColor.colors[colorIndex]
    : disagreeColor.colors[colorIndex]
  return color
}

export const electionMapColor =
  organization === 'readr-media' ? '#fff1db' : '#fff'
