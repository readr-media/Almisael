import { configureStore } from '@reduxjs/toolkit'
import electionReducer from './election-slice'
import mapReducer from './map-slice'
import uiReducer from './ui-slice'

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 */

/**
 * @typedef  {typeof store.dispatch} AppDispatch
 */

const store = configureStore({
  reducer: { election: electionReducer, map: mapReducer, ui: uiReducer },
})

export default store
