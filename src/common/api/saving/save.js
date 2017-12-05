import { request } from '../_request/request'
import md5 from 'blueimp-md5'

/* API CALLS - Should return promises
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export function saveToPocket( saveObject, access_token ){
    return request({
        path: 'send/',
        data: {
            access_token: access_token,
            actions: [
                {
                    action: 'add',
                    url: saveObject.url,
                    title: saveObject.title
                }
            ]
        }
    })
        .then( response => {
            return response
                ? {saveObject, status: 'ok', response:response.action_results[0]}
                : undefined
        })
}

export function buildSaveObject( action ){
    switch (action.type){
        case ('SAVE_TO_POCKET_FROM_ACTION_BUTTON'): {
            const tab           = action.data.tab
            const tabId         = tab.id

            const url           = tab.url
            const title         = tab.title
            const saveType      = 'page'
            const actionInfo    = {cxt_ui: 'toolbar'}
            const showSavedIcon = true
            const saveHash      = md5(tab.url)

            return {tabId, url, title, saveType, actionInfo, showSavedIcon, saveHash}
        }
        case ('SAVE_TO_POCKET_FROM_CONTEXT'): {
            const tab           = action.data.tab
            const info          = action.data.info
            const savedLink     = (info && info.linkUrl)
            const tabId         = tab.id

            const url           = savedLink ? info.linkUrl : tab.url
            const title         = savedLink ? info.selectionText || info.linkUrl : tab.title
            const cxt_ui        = savedLink ? 'right_click_link' : 'right_click_page'
            const saveType      = savedLink ? 'link' : 'page'
            const actionInfo    = {cxt_ui, cxt_url: tab.url}
            const showSavedIcon = savedLink ? 0 : 1
            const saveHash      = md5(tab.url)

            return {tabId, url, title, saveType, actionInfo, showSavedIcon, saveHash}
        }
        default: return
    }
}
