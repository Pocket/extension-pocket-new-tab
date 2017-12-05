import { call, put, race, takeLatest, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { getTrendingTopics, getGuid } from '../../../../common/api'
import { CACHE_INTERVAL } from '../../../../common/constants'


// INITIAL STATE
const initialState = {
    cacheTime: Date.now(),
    current: []
}

// ACTIONS
export const trendingTopicsActions = {
    trendingTopicsRequest: () => ( { type: 'TRENDING_TOPICS_REQUEST'} )
}

// REDUCERS
export const topics = (state = initialState, action) => {
    switch (action.type) {
        case 'TRENDING_TOPICS_SUCCESS': {
            return { ...state,
                current: action.list,
                cacheTime: action.cacheTime
            }
        }
        default: { return state }
    }
}

// SAGAS
export function* wGetTrendingTopics(){ yield takeLatest('NEW_TAB_OPENED', updateTopics)}

const getCacheTime      = ( state ) => state.trending.topics.cacheTime
const getStoredTopics   = ( state ) => state.trending.topics.current

function* updateTopics( ){
    const validCache    = yield validateCache()
    if(!validCache)     yield getTopics()
}

function* validateCache(){
    const cacheTime     = yield select( getCacheTime )
    const elapsedTime   = Date.now() - cacheTime

    const storedTopics  = yield select(getStoredTopics)
    const hasTopics     = Object.keys(storedTopics).length > 0

    return (elapsedTime < CACHE_INTERVAL && hasTopics)
}

function* getTopics() {

    try {
        const guid = yield getGuid()
        const {responseData, } = yield race({
            responseData: call(getTrendingTopics, guid, 3),
            timeout: call(delay, 30000)
        })

        if(!responseData[0].response) return yield sendError(10000)

        const list = (responseData) ? responseData[0].response.topics : []
        return yield sendSuccess(list)

    } catch (error){
        return yield sendError(10000)
    }
}

function* sendSuccess(list){
    yield put({ type: 'TRENDING_TOPICS_SUCCESS', list, cacheTime: Date.now() })
    return list
}

function* sendError(pauseTime){
    yield call(delay, pauseTime)
    yield put({ type: 'TRENDING_TOPICS_FAILURE'})
    return {}
}

