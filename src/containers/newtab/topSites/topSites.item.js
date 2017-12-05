import style from './topSites.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { domainForUrl } from '../../../common/utilities'
import Tooltip, {setTooltip, unsetTooltip} from '../../../components/tooltip/tooltip'
import SiteLogo from '../../../components/siteLogo/siteLogo'

import classNames from 'classnames/bind'
const cx = classNames.bind(style)

export default class TopSitesItem extends Component {

    constructor(props){
        super(props)
        this.state          = { positions: false }
        this.setTooltip     = setTooltip.bind(this)
        this.unsetTooltip   = unsetTooltip.bind(this)
    }

    render() {
        let item = this.props.item

        const topSiteClass= cx({
            topsite: true,
            verbose: this.props.verbose,
            darkMode: this.props.darkMode
        })

        return (
            <li className={topSiteClass}
                onMouseEnter={event => {if(!this.props.verbose) this.setTooltip(event.currentTarget)}}
                onMouseLeave={event => {if(!this.props.verbose) this.unsetTooltip(event.currentTarget)}}>

                <a href={item.url}>
                   <SiteLogo
                        verbose={this.props.verbose}
                        domain={domainForUrl(item.url)}
                        darkMode={this.props.darkMode}/>
                    <div className={style.description}>{item.title}</div>
                </a>

                {!this.props.verbose &&
                    <Tooltip
                        darkMode={this.props.darkMode}
                        positions={this.state.positions}
                        copy={item.title}/>
                }
            </li>

        )
    }
}

TopSitesItem.propTypes = {
    item            : PropTypes.object,
    setTooltip      : PropTypes.func,
    unsetTooltip    : PropTypes.func
}
