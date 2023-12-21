import { createSlice } from '@reduxjs/toolkit'
import {
  defaultMapUpperLevelId,
  defaultRenderingDistrictNames,
} from '../consts/election-module-pc'

/**
 * @typedef {Object} GeoJsons
 * @property {Object} nation - Geojson in nation level.
 * @property {Object} counties - Geojson in county level.
 * @property {Object} towns - Geojson in town level.
 * @property {Object} villages - Geojson in village level.
 */

/** @type {GeoJsons} */
const defaultGeoJsons = {
  nation: null,
  counties: null,
  towns: null,
  villages: null,
}

const initialMapState = {
  data: {
    rawTopoJson: null,
    geoJsons: defaultGeoJsons,
  },
  control: {
    feature: null,
    mapUpperLevelId: defaultMapUpperLevelId,
  },
  ui: {
    districtNames: defaultRenderingDistrictNames,
    showTutorial: false,
  },
}

const mapSlice = createSlice({
  name: 'map',
  initialState: initialMapState,
  reducers: {
    changeRawTopoJson(state, action) {
      state.data.rawTopoJson = action.payload
    },
    changeGeoJsons(state, action) {
      state.data.geoJsons = action.payload
    },
    changeMapFeature(state, action) {
      state.control.feature = action.payload
    },
    resetMapFeature(state) {
      state.control.feature = null
    },
    changeMapUpperLevelId(state, action) {
      state.control.mapUpperLevelId = action.payload
    },
    resetMapUpperLevelId(state) {
      state.control.mapUpperLevelId = defaultMapUpperLevelId
    },
    changeUiDistrictNames(state, action) {
      state.ui.districtNames = action.payload
    },
    resetUiDistrictNames(state) {
      state.ui.districtNames = defaultRenderingDistrictNames
    },
    changeUiShowTutorial(state, action) {
      state.ui.showTutorial = action.payload
    },
  },
})

export const mapActions = mapSlice.actions
export default mapSlice.reducer
