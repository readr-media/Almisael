import { configureStore } from '@reduxjs/toolkit'
import electionReducer from './election-slice'

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 */

/**
 * @typedef  {typeof store.dispatch} AppDispatch
 */

const store = configureStore({
  reducer: { election: electionReducer },
})

export default store
