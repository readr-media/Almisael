import { configureStore } from '@reduxjs/toolkit'
import electionReducer from './election-slice'

const store = configureStore({
  reducer: { election: electionReducer },
})

export default store
