import style from './submenu.scss'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ArrowUp, ArrowLeft, ArrowDown } from '../../../../components/icons'
import folder from '../../../../components/folder/folder'
import link from '../../../../components/link/link'

import classNames from 'classnames/bind'
const cx = classNames.bind(style)

class Submenu extends Component {

    // Initializers
    constructor(props){
        super(props)
        this.state = {
            overflown: false,
            topScroll: false,
            bottomScroll: false,
            parent: {}
        }
    }

    componentDidUpdate()   {
        this.checkOverFlow()
        this.checkScrollLinks()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.eventThrottler)
        this.list.removeEventListener('scroll', this.checkScrollLinks)
    }

    componentDidMount()    {
        this.setDimensions()
        this.checkOverFlow()
        this.checkScrollLinks()
        this.list.addEventListener('scroll', this.checkScrollLinks)
        window.addEventListener('resize', this.eventThrottler)
    }

    // Getters
    get isTop(){
        return (this.props.items.barId === this.props.items.parent.id)
    }

    get isOverflown() {
        return this.list.scrollHeight > this.dimensions.height
    }

    get topScroll() {
        return this.list.scrollTop > 24
    }

    get bottomScroll() {
        return this.list.scrollTop < this.list.scrollHeight - this.dimensions.height
    }

    // Setters
    setDimensions = () => {
        this.dimensions = this.list.getBoundingClientRect()
    }

    // Handlers
    handleResize = () => {
        this.dimensions  = this.list.getBoundingClientRect()
        this.checkOverFlow()
        this.checkScrollLinks()
    }

    // Adjusters
    checkOverFlow = () => {
        if(this.isOverflown !== this.state.overflown){
            this.setState({overflown: this.isOverflown})
        }
    }

    checkScrollLinks = () => {
        if(this.topScroll !== this.state.topScroll) {
            this.setState({topScroll: this.topScroll})
        }

        if(this.bottomScroll !== this.state.bottomScroll) {
            this.setState({bottomScroll: this.bottomScroll})
        }
    }

    eventThrottler = () => {
        if ( !this.eventTimeout ) {
            this.eventTimeout = setTimeout(() => {
                this.handleResize()
                clearTimeout(this.eventTimeout)
                this.eventTimeout = null
            }, 66)
        }
    }

    startScrollUp   = () => {this.startScroll(false)}

    startScrollDown = () => {this.startScroll(true)}

    stopScroll      = () => { clearTimeout(this.scrolldelay)}

    startScroll = down => {
        this.stopScroll() // Clear any lingering timeouts

        const scrollPosition = this.list.scrollTop
        const scrollHeight   = this.list.scrollHeight-this.dimensions.height

        if(down && scrollPosition === scrollHeight) return
        if(!down && scrollPosition === 0) return

        this.list.scrollTop = down ? scrollPosition+25 : scrollPosition-25

        this.scrolldelay = setTimeout(()=>{ this.startScroll(down) }, 24) // scrolls every 66 milliseconds

        this.checkScrollLinks()
    }

    resetScrollBars = () => {
        this.setState({topScroll: false})
        this.setState({bottomScroll: false})
    }

    openFolder = item => {
        this.resetScrollBars()
        this.props.openFolder(item)
    }

    closeFolder = item => {
        this.resetScrollBars()
        this.props.closeFolder(item)
    }

    render(){
        const darkMode = this.props.darkMode
        const submenuClass = cx({
            submenu: true,
            darkMode: darkMode
        })

        return (
            <div className={submenuClass}
                style={this.props.position}>
                {(this.state.overflown && this.state.topScroll) &&
                    <div className={style.overflowTop}
                        onMouseEnter={this.startScrollUp}
                        onMouseOut={this.stopScroll}>
                        {ArrowUp({
                            width: '6px',
                            height: '6px',
                            marginRight:0,
                            pointerEvents: 'none'
                        })}
                    </div>
                }
                <ul className={style.list}
                    ref={list => { this.list = list } }>

                    {!this.isTop &&
                        <li className={style.bookmark} >
                            <div className={style.label}>
                                <button className={style.back}
                                    onClick={this.closeFolder}>
                                    {ArrowLeft({
                                        width: '8px',
                                        height: '8px',
                                        marginRight:0,
                                        verticalAlign: 'middle'
                                    })}
                                </button>
                                {this.props.items.parent.title}
                            </div>
                        </li>
                    }

                    {this.props.items.list.map( item => {
                        return (
                            <li key={item.id}>
                                {item.url
                                    ? link({item, darkMode, showURL: true})
                                    : folder({item, darkMode, withArrow: true, actions:{
                                        open: this.props.openFolder,
                                        close: this.closeFolder
                                    }})}
                            </li>
                        )
                    })}

                </ul>
                {(this.state.overflown && this.state.bottomScroll) &&
                    <div className={style.overflowBottom}
                        onMouseEnter={this.startScrollDown}
                        onMouseOut={this.stopScroll}>
                        {ArrowDown({
                            width: '6px',
                            height: '6px',
                            marginRight:0,
                            pointerEvents: 'none'
                        })}
                    </div>
                }
            </div>
        )
    }
}

Submenu.propTypes = {
    items        : PropTypes.object
}

export default Submenu


