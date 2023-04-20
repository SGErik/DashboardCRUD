import { createStore, combineReducers } from 'redux'
import authReducer from './user/user.reducers'
import { applyMiddleware } from 'redux'
import { logger } from 'redux-logger'

const rootReducer = combineReducers({authReducer})

export default createStore(rootReducer, applyMiddleware(logger))
