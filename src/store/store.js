import { wrapStore } from 'react-chrome-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { PORT_NAME } from '../common/constants'

import rootSaga from './combineSagas'
import rootReducer from './combineReducers'

import { bindActionCreators } from 'redux'
import * as Actions from './combineActions'

export function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch)
}

const sagaMiddleware = createSagaMiddleware()
const enhancers = compose(applyMiddleware(sagaMiddleware))

export const store = createStore(rootReducer, {}, enhancers)

wrapStore(store, { portName: PORT_NAME })

sagaMiddleware.run(rootSaga)
