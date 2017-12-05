import { Store } from 'react-chrome-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'

import { PORT_NAME } from '../../common/constants'

import { mapStateToProps, mapDispatchToProps } from '../../store/connect'
import App from './newtab.app'


// This timeout is neccessary to make sure the proxystore on this end is created
// after the store gets wrapped. Otherwise the promise does not resolve.
// Only happens on launch of chrome
setTimeout(function() {

    const proxyStore    = new Store({portName: PORT_NAME})
    proxyStore.ready().then(() => {

        const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

        ReactDOM.render(
            <Provider store={proxyStore}>
                <ConnectedApp />
            </Provider>
            , document.getElementById('pocket-extension-anchor')
        )
    })

}, 100)

