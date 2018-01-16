import { put, takeLatest } from 'redux-saga/effects'
import * as Interface from '../../common/interface'
import { getGuid } from '../../common/api'

// INITIAL STATE
const initialState = {
    base_api_version            : 'v3/',
    base_loglevel               : 'LOUD',
    base_URL                    : 'http://jonathan.dev.readitlater.com/',
    base_installed              : 1
}

// ACTIONS
export const setupActions = {
    setupExtension: () => ( { type: 'SETUP' } )
}

// REDUCERS
export const setup = (state = initialState, action) => {
    switch (action.type) {
        case ('SETUP_EXTENSION_COMPLETE'):
            return { ...state, guid: action.guid }

        default: { return state }
    }
}

// SAGAS
export function* wSetup() { yield takeLatest('SETUP', initSetup) }

function* initSetup() {
    const data              = yield getGuid()

    Interface.setSettings({...initialState, id_guid: data.guid})
    Interface.openTab()

    yield put({ type: 'SETUP_EXTENSION_COMPLETE', guid: data.guid })
}
