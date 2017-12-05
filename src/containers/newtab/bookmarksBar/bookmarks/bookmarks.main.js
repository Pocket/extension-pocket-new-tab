import style from './bookmarks.scss'
import React, { Component } from 'react'

import { openUrl } from '../../../../common/interface'
import { Bookmark, ArrowRight } from '../../../../components/icons'
import folder from '../../../../components/folder/folder'
import link from '../../../../components/link/link'

import classNames from 'classnames/bind'
const cx = classNames.bind(style)

export default class Bookmarks extends Component {

    handleMouseEnter = () => {
        if(this.props.engaged) this.props.openFolder(-1)
    }

    render() {
        const listClass = cx({
            list: true,
            darkMode: this.props.darkMode
        })

        return (
            <ul className={listClass}>
                <li className={style.bookmarkManager}>
                    <button title='Bookmark Manager'
                        className={style.bookmarkManagerLink}
                        onClick={()=>openUrl('chrome://bookmarks')}>
                        {Bookmark({display:'inline-block',width:'16px', height: '16px', marginRight:'0'})}
                    </button>
                </li>

                {(this.props.list) && this.props.list.map( (item) =>
                    <li className={style.bookmark}
                        key={item.id}
                        data-id={item.id}
                        id={`item-${item.id}`}>
                        {item.url
                            ? link({item,
                                hide: this.props.hide,
                                darkMode: this.props.darkMode,
                                hoverAction: this.props.linkHover})
                            : folder({item,
                                hide: this.props.hide,
                                darkMode: this.props.darkMode,
                                actions:{
                                    open: this.props.openFolder,
                                    close: this.props.closeFolder,
                                    hover: (this.props.engaged) ? this.props.openFolder : false
                                    }
                                })
                            }
                    </li>

                )}

                { this.props.overflown &&
                    <li className={style.bookmarkOverflow} id="overflowTrigger">
                        <button
                            title='Bookmarks Bar Overflow'
                            className={style.buttonLink}
                            onClick={() => this.props.openOverflow()}
                            onMouseEnter={this.handleMouseEnter}>
                            {ArrowRight({display:'inline-block',width:'6px', height: '6px', marginRight:'0'})}
                            {ArrowRight({display:'inline-block',width:'6px', height: '6px', marginRight:'0', marginLeft: '0'})}
                        </button>
                    </li>
                }

            </ul>
        )
    }
}

export function bookmarksProps(props){
    return {
        darkMode:       props.darkMode,
        active:         props.active,
        engaged:        props.engaged
    }
}
