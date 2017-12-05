import { request } from '../_request/request'

/* API CALLS - Should return promises
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export function removeItem( access_token, data ){
    return request({
        path: 'send/',
        data: {
            access_token: access_token,
            actions: [
                {
                    action: 'delete',
                    item_id: data.id,
                    cxt_ui: 'newtab'
                }
            ]
        }
    })
        .then( response => {
            return response
                ? {status: 'ok', response:response.action_results[0], data}
                : undefined
        })
}
