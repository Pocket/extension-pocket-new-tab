import { put, select, takeLatest, call } from 'redux-saga/effects'

import { getTopSites, setSettings, getSetting } from '../../../common/interface'
import { checkPermission, requestPermission } from '../../../common/interface'
import { domainForUrl, isValidAddress } from '../../../common/utilities'

// INITIAL STATE
const initialState = {
    active: false,
    access: false,
    verbose: false,
    sites: []
}

// ACTIONS
export const topSiteActions = {
    requestTopSites:        () => ( { type: 'TOP_SITE_REQUEST'} ),
    toggleTopSites:         () => ( { type: 'TOP_SITE_TOGGLE'} ),
    toggleVerboseTopSites:  () => ( { type: 'TOP_SITE_VERBOSE_TOGGLE'} )
}

// REDUCERS
export const topSites = (state = initialState, action) => {
    switch (action.type) {
        case 'TOP_SITE_REQUEST_SUCCESS':
            return {...state, sites: action.data, access: 1 }

        case 'TOP_SITES_HYDRATE_SUCCESS':
        case 'TOP_SITE_SET_SUCCESS':
            return {...state, active: action.active }

        case 'TOP_SITE_VERBOSE_TOGGLE_SUCCESS':
            return {...state, verbose: action.verbose }

        default: { return state }
    }
}

// SAGAS
export function* wTopSitesInit()       { yield takeLatest('NEW_TAB_OPENED', topSitesInit)}
export function* wTopSitesRequest()    { yield takeLatest('TOP_SITE_REQUEST', topSitesRequest)}
export function* wTopSiteToggle()      { yield takeLatest('TOP_SITE_TOGGLE', topSiteToggle)}
export function* wTopSiteSet()         { yield takeLatest('TOP_SITE_SET', topSiteSet)}
export function* wTopSiteVerbose()     { yield takeLatest('TOP_SITE_VERBOSE_TOGGLE', topSiteVerboseToggle)}
export function* wTopSitesHydrate()    { yield takeLatest('HYDRATE_STATE', topSitesHydrate)}

const getTopSitesActive  = ( state ) => state.topSites.active
const getTopSitesVerbose = ( state ) => state.topSites.verbose
const getStoredTopsites  = ( state ) => state.topSites.sites

function* topSitesHydrate(){
    const stored = yield call(getSetting, 'feature_topSitesActive')
    const active = parseInt(stored,  10) === 1
    yield put({ type: 'TOP_SITES_HYDRATE_SUCCESS', active})
}

function* topSitesInit(){
    const active        = yield select( getTopSitesActive )
    if(!active) return

    const sites         = yield select( getStoredTopsites )
    if(!sites.length) yield topSitesRequest()

}

function* requestTopSitesPermission(){
    const hasPermission = yield checkPermission(['topSites'])
    if(hasPermission) return true

    const permissionGranted = yield requestPermission(['topSites'])
    return permissionGranted
}

function* topSitesRequest(){
    const active        = yield select( getTopSitesActive )
    const permission    = yield requestTopSitesPermission()

    if(permission && active){
        setSettings({'feature_topSitesAccess': 1})
        setSettings({'feature_topSitesActive': 1})

        const data = yield getTopSites()
        const filteredData = data.map( item => {

            if(!isValidAddress(item.url)) return false

            item.domain = domainForUrl(item.url)
            return item

        }).filter( value => value)

        yield put({ type: 'TOP_SITE_REQUEST_SUCCESS', data:filteredData })
    } else {
        if(!permission && active) yield put({ type: 'TOP_SITE_TOGGLE' })
    }
}

function* topSiteToggle(){
    const active = yield select( getTopSitesActive )
    yield topSiteSet( !active )
}

function* topSiteSet( value ){
    setSettings({'feature_topSitesActive': value ? 1 : 0})
    yield put({ type: 'TOP_SITE_SET_SUCCESS', active: value})

    if(value){
        const topSites = yield select( getStoredTopsites )
        if(!topSites.length) yield topSitesRequest()
    }
}

function* topSiteVerboseToggle(){
    const verbose = yield select( getTopSitesVerbose )
    setSettings({'feature_topSitesVerbose': verbose ? 0 : 1})
    yield put({ type: 'TOP_SITE_VERBOSE_TOGGLE_SUCCESS', verbose: !verbose })
}
