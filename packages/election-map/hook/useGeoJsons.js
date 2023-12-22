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

const fetchTwMapTopoJsons = async () => {
  const twMapUrl =
    'https://whoareyou-gcs.readr.tw/taiwan-map/taiwan_map_2023.json'

  try {
    const twMapTopoJson = await fetchTopoJson(twMapUrl)

    return twMapTopoJson
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
      const twMapTopoJson = await fetchTwMapTopoJsons()
      const nation = feature(twMapTopoJson, twMapTopoJson.objects.nation)
      const counties = feature(twMapTopoJson, twMapTopoJson.objects.counties)
      const towns = feature(twMapTopoJson, twMapTopoJson.objects.towns)
      const villages = feature(twMapTopoJson, twMapTopoJson.objects.villages)
      dispatch(mapActions.changeRawTopoJson(twMapTopoJson))
      dispatch(
        mapActions.changeGeoJsons({
          nation,
          counties,
          towns,
          villages,
          areas: null,
        })
      )
    }
    prepareGeoJsons()
  }, [dispatch])
}
