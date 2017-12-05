import { call, put, race, takeLatest, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { requireAuthorization } from '../../../auth/_auth'
import { getTrendingArticles, getGuid } from '../../../../common/api'
import { saveToPocket, removeItem } from '../../../../common/api'
import { getBestImage } from '../../../../common/helpers'
import { CACHE_INTERVAL, TRENDING_ARTICLE_COUNT } from '../../../../common/constants'

// INITIAL STATE
const initialState = {
    cacheTime: Date.now(),
    current: {}
}

// ACTIONS
export const trendingArticlesActions = {
    trendingArticlesRequest:    () => ( { type: 'TRENDING_ARTICLES_REQUEST'} ),
    saveTrendingArticle:      data => ( { type: 'TRENDING_ARTICLES_SAVE', data} ),
    removeTrendingArticle:    data => ( { type: 'TRENDING_ARTICLES_REMOVE', data} )
}

// REDUCERS
export const articles = (state = initialState, action) => {
    switch (action.type) {
        case 'TRENDING_ARTICLES_INVALIDATE': {
            return { ...state,
                current: {}
            }
        }
        case 'TRENDING_ARTICLES_SUCCESS': {
            return { ...state,
                current: action.list,
                cacheTime: action.cacheTime
            }
        }
        case 'SAVING_TRENDING_ARTICLE': {
            return {...state,
                current: {
                    ...state.current,
                    [action.id]:{
                        ...state.current[action.id],
                        status: 'saving'
                    }
                }
            }
        }

        case 'SAVE_TRENDING_ARTICLE_SUCCESS': {
            return {...state,
                current: {
                    ...state.current,
                    [action.id]:{
                        ...state.current[action.id],
                        status: 'saved'
                    }
                }
            }
        }

        case 'REMOVE_TRENDING_ARTICLE': {
            return {...state,
                current: {
                    ...state.current,
                    [action.id]:{
                        ...state.current[action.id],
                        status: 'removing'
                    }
                }
            }
        }

        case 'REMOVE_TRENDING_ARTICLE_SUCCESS': {
            return {...state,
                current: {
                    ...state.current,
                    [action.id]:{
                        ...state.current[action.id],
                        status: 'removed'
                    }
                }
            }
        }

        case 'RESET_TRENDING_ARTICLE':
        case 'SAVE_TRENDING_ARTICLE_FAILURE':
        case 'REMOVE_TRENDING_ARTICLE_FAILURE': {
            return {...state,
                   current: {
                    ...state.current,
                    [action.id]:{
                        ...state.current[action.id],
                        status: 'idle'
                    }
                }
            }
        }

        default: { return state }
    }
}

// SAGAS
export function* wInvalidateArticles(){     yield takeLatest('NEW_TAB_CREATED', invalidateArticles)}
export function* wGetTrendingArticles(){    yield takeLatest('NEW_TAB_OPENED', updateArticles)}
export function* wSaveTrendingArticle(){    yield takeLatest('TRENDING_ARTICLES_SAVE', saveArticle)}
export function* wRemoveTrendingArticle(){  yield takeLatest('TRENDING_ARTICLES_REMOVE', removeArticle)}

const getCacheTime      = ( state ) => state.trending.articles.cacheTime
const getStoredArticles = ( state ) => state.trending.articles.current

function* validateCache(){
    const cacheTime         = yield select( getCacheTime )
    const elapsedTime       = Date.now() - cacheTime

    const storedArticles    = yield select(getStoredArticles)
    const hasArticles       = Object.keys(storedArticles).length > 0

    return (elapsedTime < CACHE_INTERVAL && hasArticles)
}

function* invalidateArticles(){
    const validCache    = yield validateCache()
    if(!validCache)     yield put({ type: 'TRENDING_ARTICLES_INVALIDATE'})
}

function* updateArticles( ){
    const validCache    = yield validateCache()
    if(!validCache)     yield getArticles()
}

function* getArticles() {

    try {
        const guid = yield getGuid()
        const {responseData, } = yield race({
            responseData: call(getTrendingArticles, guid, TRENDING_ARTICLE_COUNT),
            timeout: call(delay, 30000)
        })

        if(!responseData[0].response) return yield sendError(10000)

        const recList = buildArticleList(responseData[0].response.list)
        return yield sendSuccess(recList)

    } catch (error){
        return yield sendError(10000)
    }
}

function* sendSuccess(list){
    yield put({ type: 'TRENDING_ARTICLES_SUCCESS', list, cacheTime: Date.now() })
    return list
}

function* sendError(pauseTime){
    yield call(delay, pauseTime)
    yield put({ type: 'TRENDING_ARTICLES_FAILURE'})
    return {}
}

function buildArticleList(list){
    return list.reduce( (map, obj, index ) => {

        const recObject = {
            index:          index,
            id:             obj.item_id,
            has_image:      obj.has_image,
            title:          obj.title,
            url:            obj.resolved_url,
            redirect_url:   obj.redirect_url,
            excerpt:        obj.excerpt,
            image:          getBestImage(obj),
            status:         'idle'
        }

        map[obj.item_id] = recObject

        return map

    }, {})
}


function* saveArticle( action ){

    yield put({ type: 'SAVING_TRENDING_ARTICLE', id:action.data.id})

    const {authToken, } = yield race({
        authToken: call(requireAuthorization),
        timeout: call(delay, 10000)
    })

    if(authToken){
        const data = yield call( saveToPocket, {
            url:action.data.url,
            title:action.data.title
        }, authToken)

        yield (data && data.status === 'ok')
            ? yield put({ type: 'SAVE_TRENDING_ARTICLE_SUCCESS', data, id:action.data.id})
            : yield put({ type: 'SAVE_TRENDING_ARTICLE_FAILURE', status:'not ok', id:action.data.id})

    } else {
        yield put({ type: 'SAVE_TRENDING_ARTICLE_FAILURE', status: 'timeout', id:action.data.id})
    }
}

function* removeArticle( action ){

    yield put({ type: 'REMOVE_TRENDING_ARTICLE', id:action.data.id})

    const {authToken, timeout} = yield race({
        authToken: call(requireAuthorization),
        timeout: call(delay, 10000)
    })

    if(authToken){
        const data = yield call( removeItem, authToken, action.data)
        yield put({ type: 'REMOVE_TRENDING_ARTICLE_SUCCESS', data, id:action.data.id})
        yield call(delay, 2500)
        yield put({ type: 'RESET_TRENDING_ARTICLE', id:action.data.id})
    } else {
        yield put({ type: 'REMOVE_TRENDING_ARTICLE_FAILURE', timeout, id:action.data.id})
    }

}
