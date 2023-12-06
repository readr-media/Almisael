import { json } from 'd3'
import { useEffect } from 'react'
import { feature } from 'topojson'
import { useAppDispatch } from './useRedux'
import { mapActions } from '../store/map-slice'

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
 * Achieve geojsons from topojsons and store in mapSlice.
 */
export const useGeoJsons = () => {
  const dispatch = useAppDispatch()

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
      dispatch(
        mapActions.changeGeoJsons({ counties, towns, villages, areas: null })
      )
    }
    prepareGeoJsons()
  }, [dispatch])
}
