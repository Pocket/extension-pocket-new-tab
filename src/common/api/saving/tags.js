import { request } from '../_request/request'

/* API CALLS - Should return promises
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export function getOnSaveTags( saveObject ){
    return request ({
        path: 'suggested_tags/',
        data: {
            url     : saveObject.url
        }
    }).then( response => [{saveObject, status: 'ok', response}])
}
