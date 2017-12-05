import { put, select, takeLatest, call } from 'redux-saga/effects'
import { setSettings, getSetting } from '../../../common/interface'
import { bookmark, bookmarksChildren } from '../../../common/interface' // bookmark
import { checkPermission, requestPermission } from '../../../common/interface'


// INITIAL STATE
const initialState = {
    active: false,
    access: false,
    engaged: false,
    bookmarks: {}
}


// ACTIONS
export const bookmarksBarActions = {
    toggleBookmarksBar: ()      => ( { type: 'BOOKMARKS_BAR_TOGGLE'} ),
    engageBookmarksBar: data    => ( { type: 'BOOKMARKS_BAR_SET_ENGAGED', data} ),
    clearBookmarksNode: ()      => ( { type: 'BOOKMARKS_NODE_CLEAR'} ),
    openBookmarkFolder: data    => ( { type: 'BOOKMARKS_NODE_OPEN', data} ),
    closeBookmarkFolder: data   => ( { type: 'BOOKMARKS_NODE_CLOSE', data} ),
    openBookmarksOverflow: data => ( { type: 'BOOKMARKS_OVERFLOW', data} )
}


// REDUCERS
export const bookmarksBar = (state = initialState, action) => {
    switch (action.type) {
        case 'BOOKMARKS_BAR_SET_SUCCESS':
        case 'BOOKMARKS_BAR_HYDRATE_SUCCESS': {
            return {...state, active: action.active }
        }
        case 'BOOKMARKS_BAR_SET_ENGAGED': {
            return {...state, engaged: action.data.engaged }
        }
        case 'BOOKMARKS_REQUEST_SUCCESS': {
            return {...state,
                bookmarks: {
                   list: action.data,
                },
                access: true
            }
        }
        case 'BOOKMARKS_OVERFLOW': {
            return {...state,
                bookmarks: {
                    ...state.bookmarks,
                    secondary: {
                        parent: {
                            id: '-1',
                            dateGroupModified: true,
                            title: 'Overflow',
                            parentId: '-1'
                        },
                        list: action.data,
                        barId: '-1'
                    }
                }
            }
        }
        case 'BOOKMARKS_SUB_SUCCESS': {
            return {...state,
                bookmarks: {
                    ...state.bookmarks,
                    secondary: {
                        parent: action.parent,
                        list: action.list,
                        barId: action.barId
                    }
                }
            }
        }
        case 'BOOKMARKS_NODE_CLEAR': {
            return {...state,
                bookmarks: {
                    ...state.bookmarks,
                    secondary: {}
                }
            }
        }
        default: { return state }
    }
}


// SAGAS
export function* wBookmarksBarInit()        { yield takeLatest('NEW_TAB_OPENED', bookmarksBarInit)}
export function* wBookmarksBarHydrate()     { yield takeLatest('HYDRATE_STATE', bookmarksHydrate)}
export function* wBookmarksBarSet()         { yield takeLatest('BOOKMARKS_BAR_SET', bookmarksBarSet)}
export function* wBookmarksBarToggle()      { yield takeLatest('BOOKMARKS_BAR_TOGGLE', bookmarksBarToggle)}
export function* wBookmarksFolderOpen()     { yield takeLatest('BOOKMARKS_NODE_OPEN', requestBookmarksOpen)}
export function* wBookmarksFolderClose()    { yield takeLatest('BOOKMARKS_NODE_CLOSE', requestBookmarksClose)}


const getBookmarksBarActive = ( state ) => state.bookmarksBar.active
const getStoredBookmarks    = ( state ) => state.bookmarksBar.bookmarks


function* bookmarksHydrate(){
    const stored = yield call(getSetting, 'feature_bookmarksBarActive')
    const active = parseInt(stored,  10) === 1
    yield put({ type: 'BOOKMARKS_BAR_HYDRATE_SUCCESS', active})
}

function* bookmarksBarInit(){
    const active            = yield select( getBookmarksBarActive )
    if(!active) return

    const bookmarks         = yield select( getStoredBookmarks )
    if(!bookmarks.list)     yield requestBookmarks()

}

function* bookmarksBarSet( value ){
    setSettings({'feature_bookmarksBarActive': value ? 1 : 0})
    yield put({ type: 'BOOKMARKS_BAR_SET_SUCCESS', active: value })

    if(value){
        const bookmarks = yield select( getStoredBookmarks )
        if(!bookmarks.list) yield requestBookmarks()
    }
}

function* bookmarksBarToggle(){
    const active = yield select( getBookmarksBarActive )
    yield bookmarksBarSet(!active)
}

function* requestBookmarksPermission(){
    const hasPermission = yield checkPermission(['bookmarks'])
    if(hasPermission) return true

    const permissionGranted = yield requestPermission(['bookmarks'])
    return permissionGranted
}

function* requestBookmarks(){
    const active        = yield select( getBookmarksBarActive )
    const permission    = yield requestBookmarksPermission()

    if(permission && active){
        setSettings({'feature_bookmarksBarAccess': 1})
        setSettings({'feature_bookmarksBarActive': 1})

        const data = yield call(bookmarksChildren, '1')
        yield put({ type: 'BOOKMARKS_REQUEST_SUCCESS', data })

    } else {
        // Active is the default.  If we are denied permissions we should turn it off
        if(!permission && active) yield put({ type: 'BOOKMARKS_BAR_SET_SUCCESS', active: false })
    }
}

function* requestBookmarksOpen(action){
    const list = yield bookmarksChildren(action.data.item.id)
    yield put({ type: 'BOOKMARKS_SUB_SUCCESS', list, parent:action.data.item, barId: action.data.barId})

}

function* requestBookmarksClose(action){

    const current   = yield select( getStoredBookmarks )

    const list      = yield bookmarksChildren(current.secondary.parent.parentId)
    const parent    = yield bookmark(list[0].parentId)

    yield put({ type: 'BOOKMARKS_SUB_SUCCESS', list, parent:parent[0],  barId: action.data.barId})
}
