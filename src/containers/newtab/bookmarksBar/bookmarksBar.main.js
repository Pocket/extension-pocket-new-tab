import style from './bookmarksBar.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'

import {throttle} from '../../../common/utilities'
import {getItemPosition} from '../../../common/helpers'
import {KEY_ESCAPE} from '../../../common/constants'

import Bookmarks, {bookmarksProps} from './bookmarks/bookmarks.main'
import Submenu from './submenu/submenu.main'

import classNames from 'classnames/bind'
const cx = classNames.bind(style)

class BookmarksBar extends Component {

    constructor(props){
        super(props)
        this.state = {
            engaged: false,
            overflowList: [],
            visibleList: props.bookmarks.list,
            itemList: []
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
        document.addEventListener('keyup', this.handleKeyUp)

        this.setItemList()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
        document.removeEventListener('keyup', this.handleKeyUp)
    }

    componentWillReceiveProps(nextProps){
        if(!this.state.visibleList) {
            this.setState({
                hideList: true,
                visibleList: nextProps.bookmarks.list
            })
        }

        if(!this.itemList) this.setItemList()
    }


    //Handlers
    handleKeyUp = event => { if(event.keyCode === KEY_ESCAPE) this.handleClickOutside() }
    handleResize = throttle(() => { this.updateDimensions() }, 100)

    handleClickOutside = () => {
        if(!this.props.engaged) return
        this.disengageBar()
    }

    updateDimensions = () => {
        if(this.props.engaged) this.props.engageBar({engaged:false})
        this.barWidth = this.element.offsetWidth
        this.checkVisible()
    }

    // Setters
    setItemList = () => {

        if(!this.state.visibleList) return

        const nodeList = [...this.element.firstChild.childNodes]

        this.itemList = nodeList
            .filter( item => (item.getAttribute) )
            .map( item => {
                return {
                    id: item.getAttribute('data-id'),
                    position: getItemPosition(item),
                    width: item.offsetWidth
                }
            })
        this.updateDimensions()
    }

    // Checks
    checkVisible = () => {
        if(!this.itemList) return

        const overFlowIds = this.itemList
            .filter(item => this.barWidth < item.position)
            .map( item => item.id)

        const overflowList = this.props.bookmarks.list
            .filter( item => overFlowIds.indexOf(item.id) >= 0)

        const visibleList = this.props.bookmarks.list
            .filter( item => overFlowIds.indexOf(item.id) < 0)

        this.setState({overflowList, visibleList, overFlowIds, hideList: false})
    }

    setSubmenuPositon = (itemId) => {

        const itemElement = (itemId === -1)
            ? document.getElementById('overflowTrigger')
            : document.getElementById(`item-${itemId}`)

        const itemLeft      = itemElement.offsetLeft
        const itemRight     = this.barWidth - itemLeft - itemElement.offsetWidth
        const rightJustify  = this.barWidth - itemLeft < 320

        this.setState({
            submenuPosition:{
                left:   (rightJustify) ? 'auto' : `${itemLeft}px`,
                right:  (rightJustify) ? `${itemRight}px`: 'auto'
            }
        })

    }

    disengageBar = () => {
        this.props.engageBar({engaged:false})
        this.props.clearFolders()
    }

    openFolder = item => {
        if(item === -1) return this.openOverflow()

        // Was this opened from the overflow menu
        const isInOverflow = this.state.overFlowIds.indexOf(item.id) > 0

        if(!this.props.engaged) this.props.engageBar({engaged:true})

        if(item.parentId === '1' && !isInOverflow) {
            this.setState({barId: item.id})
            this.setSubmenuPositon(item.id)
            this.props.openFolder({item, barId: item.id})
        }
        else {
            this.props.openFolder({item, barId: this.state.barId})
        }
    }

    openOverflow = () => {
        if(!this.props.engaged) this.props.engageBar({engaged:true})
        this.setState({barId: -1})
        this.setSubmenuPositon(-1)
        this.props.openOverflow(this.state.overflowList)
    }

    closeFolder = () => {
        const parent            = this.props.bookmarks.secondary.parent
        const closeToOverflow   = (parent.parentId === '1' && this.state.barId === -1)
        if(closeToOverflow) return this.props.openOverflow(this.state.overflowList)

        this.props.closeFolder({barId: this.state.barId})
    }

    linkHover = () => {
        if(!Object.keys(this.props.bookmarks.secondary).length) return
        this.props.clearFolders()
    }

    get getBookmarksProps(){ return bookmarksProps(this.props) }

    // Render
    render() {

        const barClass = cx({
            bookmarksBar: true,
            darkMode: this.props.darkMode
        })

        return this.props.active ? (
            <div className={barClass}
                ref={element => { this.element = element }}>
                <Bookmarks
                    {...this.getBookmarksProps}
                    linkHover={this.linkHover}
                    openFolder={this.openFolder}
                    openOverflow={this.openOverflow}
                    closeFolder={this.closeFolder}
                    hide={this.state.hideList}
                    list={this.state.visibleList}
                    overflown={(!!this.state.overflowList.length)}/>

                { (this.props.bookmarks.secondary && this.props.bookmarks.secondary.list) &&
                    <Submenu
                        barId={this.state.barId}
                        darkMode={this.props.darkMode}
                        items={this.props.bookmarks.secondary}
                        openFolder={this.openFolder}
                        position={this.state.submenuPosition}
                        closeFolder={this.closeFolder}/>
                }

            </div>
        ) : null
    }
}

export function bookmarksBarProps(props){
    return {
        bookmarks:      props.bookmarksBar.bookmarks,
        darkMode:       props.darkMode.active,
        active:         props.bookmarksBar.active,
        engaged:        props.bookmarksBar.engaged,
        engageBar:      props.engageBookmarksBar,
        clearFolders:   props.clearBookmarksNode,
        closeFolder:    props.closeBookmarkFolder,
        openFolder:     props.openBookmarkFolder,
        openOverflow:   props.openBookmarksOverflow
    }
}

BookmarksBar.propTypes = {
    saveRec     : PropTypes.func,
    list        : PropTypes.object
}

export default onClickOutside(BookmarksBar)
