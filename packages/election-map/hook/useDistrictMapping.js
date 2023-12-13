import { useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import { environment } from '../consts/config'
import { useAppSelector } from './useRedux'

/**
 * @typedef {import('../consts/electionsConifg').ElectionType} ElectionType
 * @typedef {import('../consts/electionsConifg').Year} Year
 */

const gcsBaseUrl =
  environment === 'dev'
    ? 'https://whoareyou-gcs.readr.tw/elections-dev'
    : 'https://whoareyou-gcs.readr.tw/elections'

const fetchJson = async (url) => {
  const result = await axios.get(url)
  return result
}
/**
 *
 * @param {Year} currentYear
 * @param {ElectionType} electionType
 * @returns
 */
const fetchDistrictJson = async (electionType, currentYear) => {
  const mappingJsonPath =
    electionType === 'legislator'
      ? `/district-mapping/district-with-area/${electionType}/${currentYear.key}/mapping.json`
      : '/district-mapping/district/mapping.json'
  const url = `${gcsBaseUrl}${mappingJsonPath}`

  try {
    const responses = await Promise.allSettled([fetchJson(url)])

    const responseJson = responses.map((response, i) => {
      if (response.status === 'fulfilled') {
        return response.value
      } else if (response.status === 'rejected') {
        throw new Error(
          `Fetch ${i} level map topojson failed: ${response.reason}`
        )
      }
    })
    return responseJson
  } catch (error) {
    console.error('fetch map error', error)
  }
}

/**
 * @typedef {Object} NationData
 * @property {string} name
 * @property {string} code
 * @property {'nation'} type
 * @property {CountyData[]} sub
 */

/**
 * @typedef {Object} CountyData
 * @property {string} name
 * @property {string} code
 * @property {'county'} type
 * @property {TownData[]} sub
 */
/**
 * @typedef {Object} TownData
 * @property {string} name
 * @property {string} code
 * @property {'town'} type
 * @property {VillageData[]} sub
 */
/**
 * @typedef {Object} VillageData
 * @property {string} name
 * @property {string} code
 * @property {'village'} type
 * @property {null} sub
 */

/**
 * @typedef {'nation' | 'county' | 'town' | 'village'} DistrictType
 */

/**
 * @type {NationData}
 */
const initialDistrictMapping = {
  code: '',
  name: '台灣',
  type: 'nation',
  sub: [],
}

/**
 * Achieve districtCode.
 */
export const useDistrictMapping = () => {
  const [districtMapping, setDistrictMapping] = useState(initialDistrictMapping)
  const currentYear = useAppSelector((state) => state.election.control.year)
  const electionType = useAppSelector(
    (state) => state.election.config.electionType
  )
  const hasDistrictMapping = useMemo(() => {
    return districtMapping.sub.length > 0
  }, [districtMapping])

  useEffect(() => {
    const prepareDistrictMapping = async () => {
      const responses = await fetchDistrictJson(electionType, currentYear)
      const [districtMapping] = responses
      setDistrictMapping(districtMapping.data)
    }
    prepareDistrictMapping()
  }, [currentYear, electionType])

  return { districtMapping, hasDistrictMapping }
}
