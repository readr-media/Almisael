import { useState, useMemo, useEffect } from 'react'
import axios from 'axios'

const fetchJson = async (url) => {
  const result = await axios.get(url)
  return result
}
const fetchDistrictJson = async () => {
  const districtCodeJson =
    'https://whoareyou-gcs.readr.tw/elections-dev/district-mapping/district/mapping.json'

  try {
    const responses = await Promise.allSettled([fetchJson(districtCodeJson)])

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

  const hasDistrictMapping = useMemo(() => {
    return districtMapping.sub.length > 0
  }, [districtMapping])

  useEffect(() => {
    const prepareDistrictMapping = async () => {
      const responses = await fetchDistrictJson()
      const [districtMapping] = responses
      setDistrictMapping(districtMapping.data)
    }
    prepareDistrictMapping()
  }, [])

  return { districtMapping, hasDistrictMapping }
}
