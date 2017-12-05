import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Store } from 'react-chrome-redux'

const proxyStore    = new Store({portName: 'PKT_EXT'})

proxyStore.ready().then(() => {
    ReactDOM.render(
        <Provider store={proxyStore}>
            <h1>Hi</h1>
        </Provider>
        , document.getElementById('pocket-extension-anchor')
    )
})
