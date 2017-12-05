import { delay } from 'redux-saga'
import { put, takeEvery, takeLatest } from 'redux-saga/effects'
import * as Interface from '../../common/interface'
import { authorize, getGuid } from '../../common/api'
import { AUTH_URL } from '../../common/constants'

var postLoginPromise

/* SAGAS
-------------------------------------------------- */
export function* wAuthCodeRecieved() { yield takeEvery('AUTH_CODE_RECIEVED', verifyAuthCode) }
export function* wLogout(){ yield takeLatest('USER_LOGOUT', handleLogOut) }

export function* requireAuthorization(){
    return yield getAuthToken()
}

function* verifyAuthCode( action ){
    yield delay(1000) // Pause for user edification
    yield handleAuthCode( action.loginMessage )
}

/* CHECK/RETURN OAUTH TOKEN
-------------------------------------------------- */
function getAuthToken(){
    return new Promise(function(resolve, reject) {
        if(isAuthorized()) resolve(Interface.getSetting('oauth_token'))
        else showLoginPage(resolve, reject)
    })
}

function isAuthorized() {
    return (Interface.getSetting('account_username') && Interface.getSetting('oauth_token'))
}

/* PAGE HANDLERS
-------------------------------------------------- */
function showLoginPage(resolve, reject){
    postLoginPromise = {resolve, reject}
    window.open(AUTH_URL)
}

function closeLoginPage(){
    Interface.queryTabs({ url:'*://getpocket.com/extension_newtab_login_success'},
        function(tabs){
            let tabIDs = tabs.map(tab => tab.id)
            Interface.closeTabs(tabIDs)
        }
    )
}

/* RESPONSE HANDLERS
-------------------------------------------------- */
function* handleAuthCode( responseValue ){
    loginUser(responseValue)
    closeLoginPage()
    yield put({type: 'USER_LOGGED_IN'})
}

function* handleLogOut( ){
    Interface.removeSettings([
        'oauth_token',
        'account_username',
        'account_birth',
        'account_email',
        'account_name_first',
        'account_name_last',
        'account_avatar',
        'account_premium',
        'id_guid',
    ])
    yield put({type: 'USER_LOGGED_OUT'})
}


/* LOGIN
-------------------------------------------------- */
function loginUser( userCookies ){
    getGuid()
        .then( response => authorize(response, userCookies))
        .then( response => {
            const account = response.account
            Interface.setSettings({
                oauth_token         : response.access_token,
                account_username    : response.username,
                account_birth       : account.birth,
                account_email       : account.email,
                account_name_first  : account.first_name,
                account_name_last   : account.last_name,
                account_avatar      : account.profile.avatar_url,
                account_premium     : account.premium_status
            })

            if (postLoginPromise) postLoginPromise.resolve(response.access_token)
        })
        .catch( errResponse => {
            console.warn(errResponse)
        })
}


