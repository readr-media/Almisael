export const defaultElectionType = 'mayor'

// election configs
export const elections = [
  {
    electionType: 'president',
    electionName: '總統',
    years: [{ year: 2020 }, { year: 2016 }, { year: 2012 }],
  },
  {
    electionType: 'mayor',
    electionName: '縣市首長',
    years: [{ year: 2022 }, { year: 2018 }, { year: 2014 }, { year: 2010 }],
    meta: {
      evc: { district: 'all' },
      map: {
        folderNames: {
          0: '',
          1: 'county',
          2: 'town',
        },
        fileNames: {
          0: 'country',
          1: '',
          2: '',
        },
      },
    },
  },
  {
    electionType: 'legislator',
    electionName: '立法委員',
    subTypes: [
      { name: '區域', key: 'normal' },
      { name: '原住民', key: 'indigenous' },
    ],
    years: [{ year: 2020 }, { year: 2016 }, { year: 2012 }],
    seats: { wrapperTitle: '立法委員席次圖', componentTitle: '立法委員選舉' },
  },
  {
    electionType: 'legislatorParty',
    electionName: '立法委員（不分區）',
    years: [{ year: 2020 }, { year: 2016 }, { year: 2012 }],
    seats: { wrapperTitle: '立法委員席次圖', componentTitle: '立法委員選舉' },
  },
  {
    electionType: 'councilMember',
    subTypes: [
      { name: '區域', key: 'normal' },
      { name: '原住民', key: 'indigenous' },
    ],
    electionName: '縣市議員',
    years: [{ year: 2022 }, { year: 2018 }, { year: 2014 }, { year: 2010 }],
    seats: { wrapperTitle: '縣市議員席次圖', componentTitle: '議員選舉' },
    meta: {
      evc: {},
      map: {
        folderNames: {
          0: null, // councilMember has no country level file
          1: 'county',
          2: 'town',
        },
        fileNames: {
          0: null, // councilMember has no country level file
          1: '',
          2: '',
        },
      },
      seat: {
        wrapperTitle: '縣市議員席次圖',
        componentTitle: '議員選舉',
      },
    },
  },
  {
    electionType: 'referendum',
    electionName: '全國性公民投票',
    years: [
      { year: 2022, numbers: ['F1'] },
      { year: 2021, numbers: ['20', '19', '18', '17'] },
      {
        year: 2018,
        numbers: ['16', '15', '14', '13', '12', '11', '10', '9', '8', '7'],
      },
    ],
    meta: {
      evc: { district: 'all' },
      map: {
        folderNames: {
          0: '',
          1: 'county',
          2: 'town',
        },
        fileNames: {
          0: 'country',
          1: '',
          2: '',
        },
      },
    },
  },
  {
    electionType: 'referendumLocal',
    electionName: '地方性公民投票',
    years: [{ year: 2021, numbers: ['Hsinchu-1'] }],
  },
]

export const defaultMapData = { isRunning: false, 0: null, 1: {}, 2: {} }

export const deepCloneObj = (obj) => JSON.parse(JSON.stringify(obj))

export const generateDefaultElectionMapData = () => {
  return elections.reduce((emData, election) => {
    const { electionType, years } = election
    let singleElectionMapData
    switch (electionType) {
      case 'president':
      case 'mayor':
      case 'legislatorParty': {
        singleElectionMapData = years.reduce((obj, { year }) => {
          obj[year] = deepCloneObj(defaultMapData)
          return obj
        }, {})
        break
      }

      case 'legislator':
      case 'councilMember': {
        const { subTypes } = election
        singleElectionMapData = years.reduce((obj, { year }) => {
          obj[year] = subTypes.reduce((obj, { key }) => {
            obj[key] = deepCloneObj(defaultMapData)
            return obj
          }, {})
          return obj
        }, {})
        break
      }

      case 'referendum':
      case 'referendumLocal': {
        singleElectionMapData = years.reduce((obj, { year, numbers }) => {
          obj[year] = numbers.reduce((obj, number) => {
            obj[number] = deepCloneObj(defaultMapData)
            return obj
          }, {})
          return obj
        }, {})
        break
      }
      default:
        break
    }
    emData[electionType] = singleElectionMapData
    return emData
  }, {})
}
/* electionMapData
  {
    president: {
      2020: {
        isRunning: false,
        0: countryObj,
        1: {
          [countyId]: countyObj
        },
        2: {
          [townId]: townObj
        }
      }
    },
    mayor: {
      2022: {
        isRunning: true,
        0: countryObj,
        1: {
          [countyId]: countyObj
        },
        2: {
          [townId]: townObj
        }
      },
    },
    legislator: {
      2020: {
        normal: {
          isRunning: false,
          0: null,
          1: {
            [countyId]: countyObj
          },
          2: {
            [townId]: townObj
          }
        },
        indigenous: {
          isRunning: false,
          0: null,
          1: {
            [countyId]: countyObj
          },
          2: {
            [townId]: townObj
          }
        }
      },
    },
    legislatorParty: {
      2020: {
        isRunning: false,
        0: countryObj,
        1: {
          [countyId]: countyObj
        },
        2: {
          [townId]: townObj
        }
      }
    },
    councilMember: {
      2022: {
        normal: {
          isRunning: true,
          0: null,
          1: {
            [countyId]: countyObj
          },
          2: {
            [townId]: townObj
          }
        },
        indigenous: {
          isRunning: true,
          0: null,
          1: {
            [countyId]: countyObj
          },
          2: {
            [townId]: townObj
          }
        }
      },
    },
    referendum: {
      2022: {
        F1: {
          isRunning: true,
          0: countryObj,
          1: {
            [countyId]: countyObj
          },
          2: {
            [townId]: townObj
          }
        }
      },
      2021: {
        17: {
          isRunning: true,
          0: countryObj,
          1: {
            [countyId]: countyObj
          },
          2: {
            [townId]: townObj
          }
        },
      },
      2022: {
        7: {
          isRunning: true,
          0: countryObj,
          1: {
            [countyId]: countyObj
          },
          2: {
            [townId]: townObj
          }
        },
      },
    },
    referendum-local: {
      2021: {
        hsinchu: {
          isRunning: true,
          0: null,
          1: {
            [countyId]: countyObj
          },
          2: {
            [townId]: townObj
          }
        }
      }
    }
  }
 */

export const updateElectionMapData = (
  electionMapData,
  newMapData,
  electionType,
  year,
  subType,
  number
) => {
  const newElectionMapData = deepCloneObj(electionMapData)
  switch (electionType) {
    case 'president':
    case 'mayor':
    case 'legislatorParty': {
      newElectionMapData[electionType][year] = newMapData
      break
    }

    case 'legislator':
    case 'councilMember': {
      newElectionMapData[electionType][year][subType.key] = newMapData
      break
    }

    case 'referendum':
    case 'referendumLocal': {
      newElectionMapData[electionType][year][number] = newMapData
      break
    }
    default:
      break
  }
  return newElectionMapData
}

export const getMapData = (
  electionMapData,
  electionType,
  year,
  subType,
  number
) => {
  let mapData
  switch (electionType) {
    case 'president':
    case 'mayor':
    case 'legislatorParty': {
      mapData = electionMapData[electionType][year]
      break
    }

    case 'legislator':
    case 'councilMember': {
      mapData = electionMapData[electionType][year][subType]
      break
    }

    case 'referendum':
    case 'referendumLocal': {
      mapData = electionMapData[electionType][year][number]
      break
    }
    default:
      break
  }
  return mapData
}

export const countyMappingData = [
  {
    countyCode: '10007',
    countyName: '彰化縣',
    countyNameEng: 'changhuaCounty',
  },
  {
    countyCode: '10020',
    countyName: '嘉義市',
    countyNameEng: 'chiayiCity',
  },
  {
    countyCode: '10010',
    countyName: '嘉義縣',
    countyNameEng: 'chiayiCounty',
  },
  {
    countyCode: '10018',
    countyName: '新竹市',
    countyNameEng: 'hsinchuCity',
  },
  {
    countyCode: '10004',
    countyName: '新竹縣',
    countyNameEng: 'hsinchuCounty',
  },
  {
    countyCode: '10015',
    countyName: '花蓮縣',
    countyNameEng: 'hualienCounty',
  },
  {
    countyCode: '64000',
    countyName: '高雄市',
    countyNameEng: 'kaohsiungCity',
  },
  {
    countyCode: '10017',
    countyName: '基隆市',
    countyNameEng: 'keelungCity',
  },
  {
    countyCode: '09020',
    countyName: '金門縣',
    countyNameEng: 'kinmenCounty',
  },
  {
    countyCode: '09007',
    countyName: '連江縣',
    countyNameEng: 'lienchiangCounty',
  },
  {
    countyCode: '10005',
    countyName: '苗栗縣',
    countyNameEng: 'miaoliCounty',
  },
  {
    countyCode: '10008',
    countyName: '南投縣',
    countyNameEng: 'nantouCounty',
  },
  {
    countyCode: '65000',
    countyName: '新北市',
    countyNameEng: 'newTaipeiCity',
  },
  {
    countyCode: '10016',
    countyName: '澎湖縣',
    countyNameEng: 'penghuCounty',
  },
  {
    countyCode: '10013',
    countyName: '屏東縣',
    countyNameEng: 'pingtungCounty',
  },
  {
    countyCode: '66000',
    countyName: '臺中市',
    countyNameEng: 'taichungCity',
  },
  {
    countyCode: '67000',
    countyName: '臺南市',
    countyNameEng: 'tainanCity',
  },
  {
    countyCode: '63000',
    countyName: '臺北市',
    countyNameEng: 'taipeiCity',
  },
  {
    countyCode: '10014',
    countyName: '臺東縣',
    countyNameEng: 'taitungCounty',
  },
  {
    countyCode: '68000',
    countyName: '桃園市',
    countyNameEng: 'taoyuanCity',
  },
  {
    countyCode: '10002',
    countyName: '宜蘭縣',
    countyNameEng: 'yilanCounty',
  },
  {
    countyCode: '10009',
    countyName: '雲林縣',
    countyNameEng: 'yunlinCounty',
  },
]
