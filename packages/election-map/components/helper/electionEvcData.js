import { elections } from './election'
import { deepCloneObj } from './helper'

const defaultEvcData = { isRunning: false, evcData: null }

/* electionEvcData
  {
    president: {
      2020: {
        isRunning: false,
        evcData,
      }
    },
    mayor: {
      2022: {
        isRunning: false,
        evcData,
      }
    },
    legislator: {
      2020: {
        normal: {
          [countyId]: {
            isRunning: false,
            evcData,
          }
        },
        indigenous: {
          [countyId]: {
            isRunning: false,
            evcData,
          }
        }
      },
    },
    legislatorParty: {
      2020: {
        isRunning: false,
        evcData,
      }
    },
    councilMember: {
      2022: {
        normal: {
          [countyId]: {
            isRunning: true,
            evcData,
          }
        },
        indigenous: {
          [countyId]: {
            isRunning: true,
            evcData,
          }
        }
      },
    },
    referendum: {
      2022: {
        F1: {
          isRunning: false,
          evcData,
        }
      },
      2021: {
        17: {
          isRunning: false,
          evcData,
        }
      },
    },
    referendumLocal: {
      2021: {
        hsinchu: {
          isRunning: false,
          evcData,
        }
      }
    }
  }
*/
export const generateDefaultElectionEvcData = () => {
  return elections.reduce((electionEvcData, election) => {
    const { electionType, years } = election
    let singleElectionEvcData
    switch (electionType) {
      case 'president':
      case 'mayor':
      case 'legislatorParty': {
        singleElectionEvcData = years.reduce((obj, { key }) => {
          obj[key] = deepCloneObj(defaultEvcData)
          return obj
        }, {})
        break
      }

      case 'legislator':
      case 'councilMember': {
        const { subtypes } = election
        singleElectionEvcData = years.reduce((obj, { key }) => {
          obj[key] = subtypes.reduce((obj, { key }) => {
            obj[key] = deepCloneObj(defaultEvcData)
            return obj
          }, {})
          return obj
        }, {})
        break
      }

      case 'referendum':
      case 'referendumLocal': {
        singleElectionEvcData = years.reduce((obj, { key, numbers }) => {
          obj[key] = numbers.reduce((obj, { key }) => {
            obj[key] = deepCloneObj(defaultEvcData)
            return obj
          }, {})
          return obj
        }, {})
        break
      }
      default:
        break
    }
    electionEvcData[electionType] = singleElectionEvcData
    return electionEvcData
  }, {})
}
