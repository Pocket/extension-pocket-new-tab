import style from './link.scss'
import React from 'react'
import Favicon from '../favicon/favicon'
import { openUrl } from '../../common/interface'

import classNames from 'classnames/bind'
const cx = classNames.bind(style)

export default function link( params ){

    const {item, hoverAction, hide, darkMode, showURL} = params
    const linkStyle = cx({
        buttonLink: true,
        hide: hide,
        darkMode: darkMode
    })
    const label     = (showURL) ? item.title || item.url : item.title
    const openLink  = () => openUrl(item.url)

    return (
        <button className={linkStyle}
            key={item.id}
            title={item.url}
            onMouseEnter={hoverAction}
            onClick={openLink}>

            <div className={style.icon}>
                <Favicon url={item.url} />
            </div>
            {(label.length > 0) &&
                <div className={style.copy}>
                    {label}
                </div>
            }
        </button>
    )
}
