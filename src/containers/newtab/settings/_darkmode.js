import { put, select, call, takeLatest } from 'redux-saga/effects'
import * as Interface from '../../../common/interface'

// INITIAL STATE
const initialState = {
    active: false
}

// ACTIONS
export const darkModeActions = {
    toggleDarkMode: () => ( { type: 'DARK_MODE_TOGGLE'} )
}

// REDUCERS
export const darkMode = (state = initialState, action) => {
    switch (action.type) {
        case 'DARK_MODE_SET_SUCCESS':
        case 'DARK_MODE_HYDRATE_SUCCESS': {
            return {...state, active: action.active }
        }
        default: { return state }
    }
}

// SAGAS

export function* wDarkModeHydrate()        { yield takeLatest('HYDRATE_STATE', darkModeHydrate)}
export function* wDarkModeSet()            { yield takeLatest('DARK_MODE_SET', darkModeSet)}
export function* wDarkModeToggle()         { yield takeLatest('DARK_MODE_TOGGLE', darkModeToggle)}

const getDarkModeActive = ( state ) => state.darkMode.active

function* darkModeSet( value ){
    Interface.setSettings({'feature_darkModeActive': value ? 1 : 0})
    yield put({ type: 'DARK_MODE_SET_SUCCESS', active: value })
}

function* darkModeToggle(){
    const active = yield select( getDarkModeActive )
    yield darkModeSet(!active)
}

function* darkModeHydrate(){
    const stored = yield call(Interface.getSetting, 'feature_darkModeActive')
    const active = parseInt(stored,  10) === 1
    yield put({ type: 'DARK_MODE_HYDRATE_SUCCESS', active})
}
