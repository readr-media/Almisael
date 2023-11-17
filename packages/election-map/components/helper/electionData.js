import { elections } from './election'
import { deepCloneObj } from './helper'

/**
 * @typedef {{isRunning: boolean, isStarted: boolean, [key: number]: null | Object}} ModuleData
 *
 * Representing the data for an election in a year. For referendum it represents the data in one number(案號).
 * @typedef {Object} ElectionData
 * @property {ModuleData} mapData
 * @property {ModuleData} evcData
 * @property {ModuleData} seatData
 *
 * @typedef {{[key: number]: {
 * normal: ElectionData
 * mountainIndigenous : ElectionData
 * plainIndigenous : ElectionData
 * party: ElectionData}}} YearlyLegislatorElectionData
 *
 * @typedef {Object} YearlyCouncilMemberSubtypeElectionData
 * @property {ModuleData} mapData
 * @property {ModuleData} evcData
 * @property {ModuleData} seatData
 *
 * @typedef {{[key: number]: {
 * normal: ElectionData
 * indigenous : ElectionData}}} YearlyCouncilMemberElectionData
 *
 *
 * @typedef {{[key: number]: {[key: string]: ElectionData}}} YearlyReferendumElectionData
 *
 * @typedef {{[key: number]: ElectionData}} PresidentElectionData
 * @typedef {{[key: number]: ElectionData}} MayorElectionData
 * @typedef {{[key: number]: YearlyLegislatorElectionData}} LegislatorElectionData
 * @typedef {{[key: number]: YearlyCouncilMemberElectionData}} CouncilMemberElectionData
 * @typedef {{[key: number]: YearlyReferendumElectionData}} ReferendumElectionData
 *
 * @typedef {Object} ElectionsData
 * @property {PresidentElectionData} president - President election data.
 * @property {MayorElectionData} mayor - Mayor election data.
 * @property {LegislatorElectionData} legislator - Legislator election data.
 * @property {CouncilMemberElectionData} councilMember - Council Member election data.
 * @property {ReferendumElectionData} referendum - Referendum election data.
 *
 * */

/** @type {ModuleData} */
export const defaultData = {
  isRunning: false,
  isStarted: true,
  0: null,
  1: {},
  2: {},
}

export const defaultElectionData = {
  mapData: defaultData,
  evcData: defaultData,
  seatData: defaultData,
}

/* electionsData
  {
    president: {
      2020: {
        mapData: {
          isRunning: false,
          isStarted: false,
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
          isStarted: false,
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
            isStarted: false,
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
            isStarted: false,
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
            isStarted: false,
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
          isStarted: false,
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
            isStarted: false,
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
            isStarted: false,
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
            isStarted: false,
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
            isStarted: false,
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
/**
 * Generate the default electionsData to store all election-related data later.
 * Check the comment above to see the sample of data structure.
 * @returns {ElectionsData}
 */
export const generateDefaultElectionsData = () => {
  // @ts-ignore
  return elections.reduce((electionsData, election) => {
    const { electionType, years } = election
    let singleElectionData
    switch (electionType) {
      case 'president':
      case 'mayor': {
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

      case 'referendum': {
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

/**
 * Add the electionData to the big electionsData by it's year, subtype and number depending on the election.
 * @param {ElectionsData} electionsData
 * @param {ElectionData} newElectionData
 * @param {import('./election').ElectionType} electionType
 * @param {number} yearKey - The year of the newElectionData
 * @param {string} [subtypeKey] - The key of subtype of the election
 * @param {string} [numberKey] - The key of referendum number
 * @returns
 */
export const updateElectionsData = (
  electionsData,
  newElectionData,
  electionType,
  yearKey,
  subtypeKey,
  numberKey
) => {
  switch (electionType) {
    case 'president':
    case 'mayor': {
      electionsData[electionType][yearKey] = newElectionData
      break
    }

    case 'legislator':
    case 'councilMember': {
      electionsData[electionType][yearKey][subtypeKey] = newElectionData
      break
    }

    case 'referendum': {
      electionsData[electionType][yearKey][numberKey] = newElectionData
      break
    }
    default:
      break
  }
  return electionsData
}

/**
 * Retrieve an electionData from the given year, subtype and number.
 * @param {ElectionsData} electionsData
 * @param {import('./election').ElectionType} electionType
 * @param {number} yearKey - The year of the newElectionData
 * @param {string} [subtypeKey] - The key of subtype of the election
 * @param {string} [numberKey] - The key of referendum number
 * @returns {ElectionData}
 */
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
    case 'mayor': {
      electionData = electionsData[electionType][yearKey]
      break
    }

    case 'legislator':
    case 'councilMember': {
      electionData = electionsData[electionType][yearKey][subtypeKey]
      break
    }

    case 'referendum': {
      electionData = electionsData[electionType][yearKey][numberKey]
      break
    }
    default:
      break
  }

  return electionData
}
