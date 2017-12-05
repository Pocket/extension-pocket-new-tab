import style from './topics.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class TopicItem extends Component {

    render() {
        let item = this.props.item
        return (
            <li className={style.topic}>
                <a href={`${item.url}?src=pocketnewtab`}>
                    {item.name}
                </a>
            </li>
        )
    }
}

TopicItem.propTypes = {
    item            : PropTypes.object
}
