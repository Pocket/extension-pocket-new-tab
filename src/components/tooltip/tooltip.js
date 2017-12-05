import style from './tooltip.scss'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'

import classNames from 'classnames/bind'

const cx = classNames.bind(style)

export function setTooltip(element){
    const positions = ReactDOM.findDOMNode(element).getBoundingClientRect()
    this.setState({
        active: false,
        positions: {
            top:positions.top,
            left:positions.left,
            right:positions.right,
            width:positions.width,
            height:positions.height
        }
    })
}

export function unsetTooltip(){
    this.setState({positions: false})
}

export default class Tooltip extends Component {

    get docWidth(){
        return document.documentElement.clientWidth || document.body.clientWidth
    }

    get topOffset(){
        const yPosition = this.props.positions.top
            + this.props.positions.height
            + 15

        return `${yPosition}px`
    }

    get leftOffset(){
        const xOffset = (this.isLeft) ? 0 : (this.props.positions.width/2)
        return `${this.props.positions.left + xOffset}px`
    }

    get rightOffset(){
        return `${this.docWidth - this.props.positions.right}px`
    }

    get tooltipStyles() {
        return {
            top: this.topOffset,
            left: (this.isRight) ? 'auto' : this.leftOffset,
            right: (this.isRight) ? this.rightOffset : 'auto'
        }
    }

    get isLeft(){
        return (this.props.positions.left < 150)
    }

    get isRight(){
        return (this.props.positions)
            ? (this.docWidth - this.props.positions.right < 150)
            : false
    }

    positionTooltip(){
        this.setState({positions: false})
    }

    componentDidMount() {
        window.addEventListener('resize', this.positionTooltip.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.positionTooltip.bind(this))
    }

    render() {

        const toolTipClass = cx({
            'tooltip': true,
            'active': (Object.keys(this.props.positions).length > 0) || false,
            'left': this.isLeft,
            'right': this.isRight,
            'darkMode': this.props.darkMode
        })

        return (
            <div className={toolTipClass}
                style={this.tooltipStyles}>
                {this.props.copy}
            </div>
        )
    }

}
