import style from './searchBar.scss'
import { openUrl } from '../../../common/interface'
import { isValidAddress, createValidUrl } from '../../../common/utilities'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { KEY_ENTER } from '../../../common/constants'

import classNames from 'classnames/bind'
const cx = classNames.bind(style)

export default class SearchBar extends Component {

    handleKeyPress = event => {
        if(event.charCode === KEY_ENTER){
            event.preventDefault()
            if(isValidAddress(this.input.value)) return openUrl(createValidUrl(this.input.value))
            openUrl('https://www.google.com/search?q=' + encodeURI(this.input.value.replace(/\s/g, '+')))
        }
    }

    render() {

        const inputClass = cx({
            input: true,
            darkMode: this.props.darkMode
        })

        return this.props.active ? (
            <div className={style.search}>
                <input type="text"
                    className={inputClass}
                    ref = { input => this.input = input}
                    onKeyPress = { this.handleKeyPress }
                    placeholder = "Search Google or Type URL"/>
            </div>
        ) : null
    }
}

export function searchBarProps(props){
    return {
        darkMode:   props.darkMode.active,
        active:     props.searchBar.active,
    }
}

SearchBar.propTypes = {
    darkMode:   PropTypes.bool,
    active:     PropTypes.bool,
}
