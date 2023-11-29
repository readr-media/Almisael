import { json } from 'd3'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { feature } from 'topojson'

/**
 * @typedef {import('topojson-specification').Topology} Topology
 */

/**
 * @param {string} url
 * @returns {Promise<Topology>}
 */
const fetchTopoJson = (url) => {
  return json(url)
}

const fetchTopoJsons = async () => {
  const twCountiesJson =
    'https://whoareyou-gcs.readr.tw/taiwan-map/taiwan_map_counties.json'
  const twTownsJson =
    'https://whoareyou-gcs.readr.tw/taiwan-map/taiwan_map_towns.json'
  const twVillagesJson =
    'https://whoareyou-gcs.readr.tw/taiwan-map/taiwan_map_villages_20220902.json'

  try {
    const responses = await Promise.allSettled([
      fetchTopoJson(twCountiesJson),
      fetchTopoJson(twTownsJson),
      fetchTopoJson(twVillagesJson),
    ])

    /** @type {Array<Topology>} */
    const mapJsons = responses.map((response, i) => {
      if (response.status === 'fulfilled') {
        return response.value
      } else if (response.status === 'rejected') {
        throw new Error(
          `Fetch ${i} level map topojson failed: ${response.reason}`
        )
      }
    })

    return mapJsons
  } catch (error) {
    console.error('fetch map error', error)
  }
}

/**
 * @typedef {Object} GeoJsons
 * @property {Object} counties - Geojson in county level.
 * @property {Object} towns - Geojson in town level.
 * @property {Object} villages - Geojson in village level.
 */

/** @type {GeoJsons} */
const initialGeoJsons = {
  counties: null,
  towns: null,
  villages: null,
}

/**
 * Achieve geojsons from topojsons.
 * @returns {{geoJsons: GeoJsons, hasGeoJsons: boolean}}
 */
export const useGeoJsons = () => {
  const [geoJsons, setGeoJsons] = useState(initialGeoJsons)

  const hasGeoJsons = useMemo(() => {
    return !Object.values(geoJsons).includes(null)
  }, [geoJsons])

  useEffect(() => {
    // Download the topoJson and use topojson.feature to transform topoJson back to geoJson.
    const prepareGeoJsons = async () => {
      const mapJsons = await fetchTopoJsons()

      const [countiesTopoJson, townsTopoJson, villagesTopoJson] = mapJsons

      const counties = feature(
        countiesTopoJson,
        countiesTopoJson.objects.counties
      )
      const towns = feature(townsTopoJson, townsTopoJson.objects.towns)
      const villages = feature(
        villagesTopoJson,
        villagesTopoJson.objects.villages
      )
      setGeoJsons({ counties, towns, villages })
    }
    prepareGeoJsons()
  }, [])

  return { geoJsons, hasGeoJsons }
}
