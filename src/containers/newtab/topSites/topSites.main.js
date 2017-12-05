import style from './topSites.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TopSitesItem from './topSites.item'
import { TOP_SITES_COUNT } from '../../../common/constants'

export default class TopSites extends Component {

    render() {
        return this.props.active ? (
            <div className={style.section}>
                <ul className={style.list}>
                    {this.props.list
                        .slice(0,TOP_SITES_COUNT)
                        .map( (data, index) =>
                            <TopSitesItem
                                darkMode={this.props.darkMode}
                                verbose={this.props.verbose}
                                key={index}
                                item={data}/>
                        )
                    }
                </ul>
            </div>
        ) : null
    }
}

export function topSitesProps(props){
    return {
        darkMode: props.darkMode.active,
        active: props.topSites.active,
        list: props.topSites.sites,
        verbose: props.topSites.verbose
    }
}

TopSites.propTypes = {
    darkMode: PropTypes.bool,
    active: PropTypes.bool
}
