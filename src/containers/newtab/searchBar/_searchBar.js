import { put, select, call, takeLatest } from 'redux-saga/effects'
import * as Interface from '../../../common/interface'

// INITIAL STATE
const initialState = {
    active: true
}

// ACTIONS
export const searchBarActions = {
    toggleSearchBar: () => ( { type: 'SEARCH_BAR_TOGGLE'} )
}

// REDUCERS
export const searchBar = (state = initialState, action) => {
    switch (action.type) {
        case 'SEARCH_BAR_HYDRATE_SUCCESS':
        case 'SEARCH_BAR_SET_SUCCESS': {
            return {...state, active: action.active }
        }
        default: { return state }
    }
}

// SAGAS
export function* wSearchBarHydrate()    { yield takeLatest('HYDRATE_STATE', searchBarHydrate)}
export function* wSearchBarSet()        { yield takeLatest('SEARCH_BAR_SET', searchBarSet)}
export function* wSearchBarToggle()     { yield takeLatest('SEARCH_BAR_TOGGLE', searchBarToggle)}

const getSearchBarActive = ( state ) => state.searchBar.active

function* searchBarSet( value ){
    Interface.setSettings({'feature_searchBarActive': value ? 1 : 0})
    yield put({ type: 'SEARCH_BAR_SET_SUCCESS', active: value })
}

function* searchBarToggle(){
    const active = yield select( getSearchBarActive )
    yield searchBarSet(!active)
}

function* searchBarHydrate(){
    const stored = yield call(Interface.getSetting, 'feature_searchBarActive')
    const active = parseInt(stored,  10) === 1
    yield put({ type: 'SEARCH_BAR_HYDRATE_SUCCESS', active})
}
