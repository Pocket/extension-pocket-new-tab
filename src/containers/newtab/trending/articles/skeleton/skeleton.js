import style from './skeleton.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import { DefaultSite } from '../../../../../components/icons/icons.defaultsite'


const cx = classNames.bind(style)

export default class ArticlesSkeleton extends Component {

    constructor(props){
        super(props)
        this.state = { active: false }
    }

    hoverOn(activeTitle){
        this.setState({
            active: true,
            activeTitle: activeTitle
        })
    }

    hoverOff(){
        this.setState({
            active: false,
            activeTitle: false
        })
    }


    render() {

        let itemClass = cx({
            'skeleton': true,
            'active': this.state.active,
            'darkMode': this.props.darkMode
        })

        return (
            <li className={itemClass}>
                <a className={style.tileLink}
                    onMouseOver={ () => this.hoverOn(true) }
                    onMouseOut={ () => this.hoverOff() }
                    rel="noopener noreferrer"> </a>
                <div className={style.image}>
                    {DefaultSite({ width:  '80px', height: '80px' })}
                </div>
                <div className={style.copy}>
                    <div className={style.copyBlocks}></div>
                </div>
                <div className={style.action}>
                    <div className={style.actionBlock}></div>
                </div>
            </li>
        )
    }
}

ArticlesSkeleton.propTypes = {
    darkModeActive : PropTypes.bool
}
