import style from './folder.scss'

import React from 'react'
import {Folder, ArrowRight} from '../icons'
import classNames from 'classnames/bind'

const cx = classNames.bind(style)
export default function folder( params ){

    const { item, hide, darkMode, actions, withArrow } = params

    const handleHover = () => {
        if(actions.hover) actions.hover(item)
    }

    const folderStyle = cx({
        folder: true,
        darkMode: darkMode,
        hide: hide
    })

    return(
        <button className={folderStyle}
            onClick={ () => actions.open(item) }
            onMouseEnter={handleHover}>
            <div className={style.icon}>
                {Folder({
                    display: 'block',
                    pointerEvents: 'none',
                    width:'16px',
                    height:'16px',
                    marginRight: 0,
                    verticalAlign:'text-bottom'
                })}
            </div>
            <div className={style.copy}>
                {item.title}
            </div>

            {withArrow && ArrowRight({
                display: 'block',
                float: 'right',
                pointerEvents: 'none',
                width:'8px',
                height:'8px',
                margin: '3px 0px 0px 15px',

            })}
        </button>
    )
}
