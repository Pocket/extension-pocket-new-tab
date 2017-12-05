import style from './siteLogo.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {DefaultSite} from '../../components/icons/icons.defaultsite'
import {getImageCacheUrl} from '../../common/helpers'

import classNames from 'classnames/bind'
const cx = classNames.bind(style)

export default class SiteLogo extends Component {

    constructor(props){
        super(props)
        this.state = {
            image: getImageCacheUrl(`https://logo.clearbit.com/${props.domain}`),
            isValid: false
        }
    }

    testImage() {
        const testImage         = new Image()
        testImage.onload        = () => { this.setState({isValid:true}) }
        testImage.onerror       = () => { this.setState({isValid:false}) }
        testImage.src           = this.state.image
    }

    componentWillMount() {
        this.testImage()
    }

    get imageMarkup(){

        const mediaClass = cx({
            image: true,
            darkMode: this.props.darkMode,
            verbose: this.props.verbose
        })

        return (
            this.state.isValid
                ? <img className={mediaClass} src={this.state.image} alt={this.props.domain}/>
                : DefaultSite({ width:  '64px', height: '64px' })
        )
    }

    render() {
        return this.imageMarkup
    }
}

SiteLogo.propTypes = {
    active  : PropTypes.bool,
    action  : PropTypes.func
}
