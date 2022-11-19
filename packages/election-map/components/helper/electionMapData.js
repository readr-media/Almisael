import { elections } from './election'
import { deepCloneObj } from './helper'

export const defaultMapData = { isRunning: false, 0: null, 1: {}, 2: {} }

export const defaultData = { isRunning: false, 0: null, 1: {}, 2: {} }
export const defaultElectionData = {
  mapData: defaultData,
  evcData: defaultData,
  seatData: defaultData,
}

/* electionMapData
  {
    president: {
      2020: {
        mapData: {
          isRunning: false,
          0: countryMapData,
          1: {
            [countyId]: countyMapData
          },
          2: {
            [townId]: townMapData
          }
        },
        evcData {
          isRunning: false,
          0: countryEvcData,
          1: {},
          2: {}
        },
        seatData {
          isRunning: false,
          0: null,
          1: {},
          2: {}
        },
      }
    },
    mayor: {
      2022: {
        mapData: {
          isRunning: false,
          0: countryMapData,
          1: {
            [countyId]: countyMapData
          },
          2: {
            [townId]: townMapData
          }
        }
        evcData {
          isRunning: false,
          0: countryEvcData,
          1: {},
          2: {}
        }
        seatData {
          isRunning: false,
          0: null,
          1: {},
          2: {}
        },
      }
    },
    legislator: {
      2020: {
        normal: {
          mapData: {
            isRunning: false,
            0: countryMapData,
            1: {
              [countyId]: countyMapData
            },
            2: {
              [townId]: townMapData
            }
          }
          evcData {
            isRunning: false,
            0: null,
            1: {
              [countyId]: countyEvcData
            },
            2: {}
          }
          seatData {
            isRunning: false,
            0: countrySeatData,
            1: {},
            2: {}
          },
        },
        indigenous: {
          mapData: {
            isRunning: false,
            0: countryMapData,
            1: {
              [countyId]: countyMapData
            },
            2: {
              [townId]: townMapData
            }
          }
          evcData {
            isRunning: false,
            0: null,
            1: {
              [countyId]: countyEvcData
            },
            2: {}
          }
          seatData {
            isRunning: false,
            0: countrySeatData,
            1: {},
            2: {}
          },
        }
      },
    },
    legislatorParty: {
      2020: {
        mapData: {
          isRunning: false,
          0: countryMapData,
          1: {
            [countyId]: countyMapData
          },
          2: {
            [townId]: townMapData
          }
        }
        evcData {
          isRunning: false,
          0: countryEvcData,
          1: {},
          2: {}
        }
        seatData {
          isRunning: false,
          0: null,
          1: {},
          2: {}
        },
      }
    },
    councilMember: {
      2022: {
        normal: {
          mapData: {
            isRunning: false,
            0: countryMapData,
            1: {
              [countyId]: countyMapData
            },
            2: {
              [townId]: townMapData
            }
          }
          evcData {
            isRunning: false,
            0: null,
            1: {
              [countyId]: countyEvcData
            },
            2: {}
          }
          seatData {
            isRunning: false,
            0: null,
            1: {
              [countyId]: countySeatData
            },
            2: {}
          },
        },
        indigenous: {
          mapData: {
            isRunning: false,
            0: countryMapData,
            1: {
              [countyId]: countyMapData
            },
            2: {
              [townId]: townMapData
            }
          }
          evcData {
            isRunning: false,
            0: null,
            1: {
              [countyId]: countyEvcData
            },
            2: {}
          }
          seatData {
            isRunning: false,
            0: null,
            1: {
              [countyId]: countySeatData
            },
            2: {}
          },
        }
      },
    },
    referendum: {
      2022: {
        F1: {
          mapData: {
            isRunning: false,
            0: countryMapData,
            1: {
              [countyId]: countyMapData
            },
            2: {
              [townId]: townMapData
            }
          }
          evcData {
            isRunning: false,
            0: countryEvcData,
            1: {},
            2: {}
          }
          seatData {
            isRunning: false,
            0: null,
            1: {},
            2: {}
          },
        }
      },
    },
    referendumLocal: {
      2021: {
        hsinchu: {
          mapData: {
            isRunning: false,
            0: countryMapData,
            1: {
              [countyId]: countyMapData
            },
            2: {
              [townId]: townMapData
            }
          }
          evcData {
            isRunning: false,
            0: countryEvcData,
            1: {},
            2: {}
          }
          seatData {
            isRunning: false,
            0: null,
            1: {},
            2: {}
          },
        }
      }
    }
  }
 */
export const generateDefaultElectionsData = () => {
  return elections.reduce((electionsData, election) => {
    const { electionType, years } = election
    let singleElectionData
    switch (electionType) {
      case 'president':
      case 'mayor':
      case 'legislatorParty': {
        singleElectionData = years.reduce((obj, { key }) => {
          obj[key] = deepCloneObj(defaultElectionData)
          return obj
        }, {})
        break
      }

      case 'legislator':
      case 'councilMember': {
        const { subtypes } = election
        singleElectionData = years.reduce((obj, { key }) => {
          obj[key] = subtypes.reduce((obj, { key }) => {
            obj[key] = deepCloneObj(defaultElectionData)
            return obj
          }, {})
          return obj
        }, {})
        break
      }

      case 'referendum':
      case 'referendumLocal': {
        singleElectionData = years.reduce((obj, { key, numbers }) => {
          obj[key] = numbers.reduce((obj, { key }) => {
            obj[key] = deepCloneObj(defaultElectionData)
            return obj
          }, {})
          return obj
        }, {})
        break
      }
      default:
        break
    }
    electionsData[electionType] = singleElectionData
    return electionsData
  }, {})
}

export const updateElectionsData = (
  electionsData,
  newElectionData,
  electionType,
  yearKey,
  subtypeKey,
  numberKey
) => {
  const newElectionsData = deepCloneObj(electionsData)
  switch (electionType) {
    case 'president':
    case 'mayor':
    case 'legislatorParty': {
      newElectionsData[electionType][yearKey] = newElectionData
      break
    }

    case 'legislator':
    case 'councilMember': {
      newElectionsData[electionType][yearKey][subtypeKey] = newElectionData
      break
    }

    case 'referendum':
    case 'referendumLocal': {
      newElectionsData[electionType][yearKey][numberKey] = newElectionData
      break
    }
    default:
      break
  }
  return newElectionsData
}

export const getElectionData = (
  electionsData,
  electionType,
  yearKey,
  subtypeKey,
  numberKey
) => {
  let electionData
  switch (electionType) {
    case 'president':
    case 'mayor':
    case 'legislatorParty': {
      electionData = electionsData[electionType][yearKey]
      break
    }

    case 'legislator':
    case 'councilMember': {
      electionData = electionsData[electionType][yearKey][subtypeKey]
      break
    }

    case 'referendum':
    case 'referendumLocal': {
      electionData = electionsData[electionType][yearKey][numberKey]
      break
    }
    default:
      break
  }

  console.log(
    'electionData',
    electionData,
    'electionsData',
    electionsData,
    'yearKey',
    yearKey,
    'subtypeKey',
    subtypeKey,
    'numberKey',
    numberKey
  )
  return electionData
}

export const generateDefaultElectionMapData = () => {
  return elections.reduce((electionMapData, election) => {
    const { electionType, years } = election
    let singleElectionMapData
    switch (electionType) {
      case 'president':
      case 'mayor':
      case 'legislatorParty': {
        singleElectionMapData = years.reduce((obj, { key }) => {
          obj[key] = deepCloneObj(defaultMapData)
          return obj
        }, {})
        break
      }

      case 'legislator':
      case 'councilMember': {
        const { subtypes } = election
        singleElectionMapData = years.reduce((obj, { key }) => {
          obj[key] = subtypes.reduce((obj, { key }) => {
            obj[key] = deepCloneObj(defaultMapData)
            return obj
          }, {})
          return obj
        }, {})
        break
      }

      case 'referendum':
      case 'referendumLocal': {
        singleElectionMapData = years.reduce((obj, { key, numbers }) => {
          obj[key] = numbers.reduce((obj, { key }) => {
            obj[key] = deepCloneObj(defaultMapData)
            return obj
          }, {})
          return obj
        }, {})
        break
      }
      default:
        break
    }
    electionMapData[electionType] = singleElectionMapData
    return electionMapData
  }, {})
}

export const updateElectionMapData = (
  electionMapData,
  newMapData,
  electionType,
  yearKey,
  subtypeKey,
  numberKey
) => {
  const newElectionMapData = deepCloneObj(electionMapData)
  switch (electionType) {
    case 'president':
    case 'mayor':
    case 'legislatorParty': {
      newElectionMapData[electionType][yearKey] = newMapData
      break
    }

    case 'legislator':
    case 'councilMember': {
      newElectionMapData[electionType][yearKey][subtypeKey] = newMapData
      break
    }

    case 'referendum':
    case 'referendumLocal': {
      newElectionMapData[electionType][yearKey][numberKey] = newMapData
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
  yearKey,
  subtypeKey,
  numberKey
) => {
  let mapData
  switch (electionType) {
    case 'president':
    case 'mayor':
    case 'legislatorParty': {
      mapData = electionMapData[electionType][yearKey]
      break
    }

    case 'legislator':
    case 'councilMember': {
      mapData = electionMapData[electionType][yearKey][subtypeKey]
      break
    }

    case 'referendum':
    case 'referendumLocal': {
      mapData = electionMapData[electionType][yearKey][numberKey]
      break
    }
    default:
      break
  }
  return mapData
}
