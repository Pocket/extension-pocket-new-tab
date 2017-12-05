import { wrapStore } from 'react-chrome-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { getSetting } from '../common/interface'
import { PORT_NAME } from '../common/constants'

import rootSaga from './combineSagas'
import rootReducer from './combineReducers'

import { bindActionCreators } from 'redux'
import * as Actions from './combineActions'

export function mapDispatchToProps(dispatch){
    return bindActionCreators(Actions, dispatch)
}

const omitState = (getState, action) => {

    const loglevel = getSetting('base_loglevel')

    if(loglevel === 'LOUD') return true
    if(loglevel === 'DEFAULT')
        return action.type !== 'BOOKMARKS_NODE_OPEN'
            && action.type !== 'BOOKMARKS_SUB_SUCCESS'
            && action.type !== 'BOOKMARKS_OVERFLOW'

    return false
}


/* SETTINGS
–––––––––––––––––––––––––––––––––––––––––––––––––– */
const logger_settings = {
    level               : 'log',
    logger              : console,
    logErrors           : true,
    predicate           : omitState,
    collapsed           : (getState, action, logEntry) => !logEntry.error,
    duration            : true,
    timestamp           : true,
    stateTransformer    : state => state,
    actionTransformer   : action => action,
    errorTransformer    : error => error,
    colors              : {
        title               : () => '#50BCB6',
        prevState           : () => '#ef4056',
        action              : () => '#FCB643',
        nextState           : () => '#83EDB8',
        error               : () => '#FF007F',
    },
    diff                : false
}

const logger            = createLogger(logger_settings) //
const sagaMiddleware    = createSagaMiddleware()
const enhancers         = compose(applyMiddleware(sagaMiddleware, logger))

export const store = createStore(rootReducer, {}, enhancers)

wrapStore(store, {portName: PORT_NAME})

sagaMiddleware.run(rootSaga)
