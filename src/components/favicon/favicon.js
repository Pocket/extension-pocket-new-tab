import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getImageCacheUrl } from '../../common/helpers'
import { isValidUrl, domainForUrl, baseDomainUrl } from '../../common/utilities' //baseDomainUrl
import { DefaultSite } from '../icons'

export default class Favicon extends Component {

    constructor(props){

        super(props)

        const regex         = /^(https?:\/\/(.+?\.)?google\.com(\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?)/im
        const isGoogle      = regex.test(props.url)
        const faviconURL    = (isGoogle)
            ? getImageCacheUrl(`${baseDomainUrl(props.url)}/favicon.ico`)
            : getImageCacheUrl(`https://www.google.com/s2/favicons?domain=${domainForUrl(props.url)}`)

        this.state = {
            image: faviconURL,
            isValid: false
        }

    }

    componentDidMount()     { this.testImage() }

    componentWillUnmount()  { this.stopHandle = true }

    handleImageLoaded   = () => { if(!this.stopHandle) this.setState({isValid:true})}

    handleImageErrored  = () => { if(!this.stopHandle) this.setState({isValid:false})}

    testImage = () => {
        if(!isValidUrl(this.props.url)) return

        const testImage         = new Image()
        testImage.onload        = this.handleImageLoaded
        testImage.onerror       = this.handleImageErrored
        testImage.src           = this.state.image
    }

    get imageMarkup(){
        return (
            this.state.isValid
                ? <img style={{
                    display:'block',
                    width:'16px',
                    height: '16px',
                    verticalAlign:'middle',
                    marginRight: '0'}}
                src={this.state.image}
                alt={this.props.domain}/>
                : DefaultSite({
                    display:'block',
                    width:'16px',
                    height: '16px',
                    verticalAlign:'middle',
                    marginRight: '0'})
        )
    }

    render() {
        return this.imageMarkup
    }
}

Favicon.propTypes = {
    domain          : PropTypes.string,
}
