import { createSlice } from '@reduxjs/toolkit'

/**
 * @typedef {Object} GeoJsons
 * @property {Object} counties - Geojson in county level.
 * @property {Object} towns - Geojson in town level.
 * @property {Object} areas - Geojson in area level.
 * @property {Object} villages - Geojson in village level.
 */

/** @type {GeoJsons} */
const defaultGeoJsons = {
  counties: null,
  towns: null,
  areas: null,
  villages: null,
}

const initialMapState = {
  geoJsons: defaultGeoJsons,
}

const mapSlice = createSlice({
  name: 'map',
  initialState: initialMapState,
  reducers: {
    changeGeoJsons(state, action) {
      state.geoJsons = action.payload
    },
  },
})

export const mapActions = mapSlice.actions
export default mapSlice.reducer
