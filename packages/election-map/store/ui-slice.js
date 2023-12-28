import { createSlice } from '@reduxjs/toolkit'

/**
 * @typedef {'desktop'|'mobile'} Device - RWD device
 */

const defaultDevice = 'mobile'

/** @type {{device: Device}} */
const initialUiState = {
  device: defaultDevice,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUiState,
  reducers: {
    changeUiDevice(state, action) {
      state.device = action.payload
    },
  },
})

export const uiActions = uiSlice.actions
export default uiSlice.reducer
