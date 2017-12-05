
import * as Interface       from '../../common/interface'
import { getBaseUrl }       from '../../common/helpers'
import { store }            from '../../store/store'
import { setupExtension }   from '../../store/combineActions'
import { hydrateState }     from '../../store/combineActions'
import { newTabCreated }    from '../../store/combineActions'

const installed = Interface.getSetting( 'base_installed' )
store.dispatch( installed ? hydrateState() : setupExtension() )

function openURL(){ Interface.openTabWithUrl(getBaseUrl()) }

function createContextMenus(){
    Interface.contextMenus().create({
        'title': 'Open New Tab',
        'contexts': ['page_action'],
        'onclick': Interface.openTab
    })

    Interface.contextMenus().create({
        'title': 'Open My Pocket List',
        'contexts': ['page_action'],
        'onclick': openURL
    })
}

Interface.onTabCreated( ()=> { store.dispatch( newTabCreated() ) } )

Interface.contextMenus().removeAll(createContextMenus)

Interface.onUpdateAvailable(()=>{ Interface.reloadExtension() })

Interface.setUninstallUrl('https://getpocket.com/chrome-new-tab-exit-survey/')
