import style from './articles.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import {Save} from '../../../../components/icons/icons.save'
import {domainForUrl, baseDomainUrl} from '../../../../common/utilities'
import {getImageCacheUrl} from '../../../../common/helpers'

const cx = classNames.bind(style)

const copy = {
    idle:       'Save to Pocket',
    saving:     'Saving...',
    saved:      'Saved',
    removing:   'Removing from your list...',
    removed:    'Removed'
}

export default class ArticlesItem extends Component {

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

    get imageStyle(){
        const cachedImage = getImageCacheUrl(this.props.item.image)
        return {
            backgroundImage: 'url("' + cachedImage + '")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }
    }

    get saveCopy(){
        return copy[this.props.item.status]
    }

    itemAction(item){

        console.log(item)

        switch(item.status){

            case 'idle': {
                this.props.saveArticle({id:item.id, title:item.title, url:item.url, index: this.props.index})
                break
            }

            case 'saved': {
                this.props.removeArticle({id:item.id, index: this.props.index})
                break
            }

            default: {
                return
            }
        }

    }

    render() {
        let item = this.props.item

        let itemClass = cx({
            'article': true,
            'active': this.state.active,
            'activeTitle': this.state.activeTitle,
            'darkMode': this.props.darkMode
        })

        let saveButtonClass = cx({
            'save': true,
            'saved': (item.status === 'saved'),
            'saving': (item.status === 'saving')
        })

        return (
            <li className={itemClass}>
                <a className={style.tileLink}
                    onClick={ () => this.props.analyticsClickRec(item) }
                    onMouseOver={ () => this.hoverOn(true) }
                    onMouseOut={ () => this.hoverOff() }
                    href={item.redirect_url}
                    rel="noopener noreferrer"> </a>

                { item.has_image &&
                    <div className={style.image} style={this.imageStyle}></div>
                }

                <div className={style.copy}>
                    <div className={style.title}>
                        <a className={style.link}
                            onClick={ () => this.props.analyticsClickRec(item) }
                            onMouseOver={ () => this.hoverOn(true) }
                            onMouseOut={ () => this.hoverOff() }
                            href={item.redirect_url}
                            rel="noopener noreferrer"
                            target="_blank">
                            {item.title}
                        </a>
                    </div>
                    { !item.has_image &&
                        <div className={style.excerpt}>
                            {item.excerpt}
                        </div>
                    }

                    <a className={style.source}
                        onMouseOver={ () => this.hoverOn() }
                        onMouseOut={ () => this.hoverOff() }
                        href={baseDomainUrl(item.url)}
                        rel="noopener noreferrer"
                        target="_blank">
                        {domainForUrl(item.url)}
                    </a>

                    <div className={style.actions}>
                        <button className={saveButtonClass}
                            onClick = { () => this.itemAction(item)}
                            onMouseOver={ () => this.hoverOn() }
                            onMouseOut={ () => this.hoverOff() }>
                            {Save({verticalAlign:'top'})} {this.saveCopy}
                        </button>
                    </div>
                </div>
            </li>
        )
    }
}

ArticlesItem.propTypes = {
    item            : PropTypes.object
}
