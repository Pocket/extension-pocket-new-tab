import style from './sidePanel.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import Toggle from '../../../../components/toggle/toggle'
import { Cog, PocketLogo, ArrowRight } from '../../../../components/icons/'
import { LINK_HELP_PAGE, LINK_SURVEY_PAGE } from '../../../../common/constants'

const cx = classNames.bind(style)

export default class SidePanel extends Component {
    constructor(props) {
        super(props)
        this.state = { active: false }
    }

    hoverOn() {
        clearTimeout(this.hoverTimer)
        this.setState({ active: true })
    }

    hoverOff() {
        this.hoverTimer = setTimeout(() => {
            this.setState({ active: false })
        }, 250)
    }

    togglePanel() {
        this.setState({
            active: !this.state.active
        })
    }

    render() {
        const wrapperClass = cx({
            settings: true,
            darkMode: this.props.darkMode.active,
            bookmarksActive: this.props.bookmarksBar.active
        })

        const panelClass = cx({
            panel: true,
            active: this.state.active
        })

        return (
            <div className={wrapperClass}>
                <button title="Pocket New Tab Preferences"
                    className={style.trigger}
                    onMouseOver={() => this.hoverOn()}
                    onMouseOut={() => this.hoverOff()}>
                    {Cog({ width: '16px', height: '16px', marginRight: '0' })}
                </button>

                <div className={style.options}>

                    <div className={panelClass}
                        onMouseOver={() => this.hoverOn()}
                        onMouseOut={() => this.hoverOff()}>

                        <div className={style.header}>
                            {PocketLogo({
                                width: '16px',
                                height: '16px',
                                marginRight: '3px',
                                marginTop: '2px',
                                verticalAlign: 'text-top'
                            })}{' '}
                            Pocket New Tab Preferences
                            <div className={style.headerCopy}>
                                Customize your new tab. <br />
                                <br />
                                Some options require special permissions in
                                Chrome. Information accessed with these
                                permissions will never be sent to Pocket or
                                shared with anyone.
                                <a
                                    className={style.headerLink}
                                    href={LINK_HELP_PAGE}>
                                    Learn More{' '}
                                    {ArrowRight({
                                        width: '6px',
                                        height: '6px',
                                        marginRight: '0',
                                        marginBottom: '1px',
                                        verticalAlign: 'baseline'
                                    })}
                                </a>
                            </div>
                        </div>

                        <div className={style.section}>
                            <div className={style.title}>Dark Theme</div>
                            <div className={style.choice}>
                                <Toggle
                                    active={this.props.darkMode.active}
                                    action={this.props.darkMode.toggle}
                                    darkMode={this.props.darkMode.active}
                                />
                            </div>
                        </div>

                        <div className={style.section}>
                            <div className={style.title}>Bookmarks Bar</div>
                            <div className={style.choice}>
                                <Toggle
                                    active={this.props.bookmarksBar.active}
                                    action={this.props.bookmarksBar.toggle}
                                    darkMode={this.props.darkMode.active}
                                />
                            </div>
                        </div>

                        <div className={style.section}>
                            <div className={style.title}>Search Bar</div>
                            <div className={style.choice}>
                                <Toggle
                                    active={this.props.searchBar.active}
                                    action={this.props.searchBar.toggle}
                                    darkMode={this.props.darkMode.active}
                                />
                            </div>
                        </div>

                        <div className={style.section}>
                            <div className={style.title}>
                                Most Visited Sites
                            </div>
                            <div className={style.choice}>
                                <Toggle
                                    active={this.props.topSites.active}
                                    action={this.props.topSites.toggle}
                                    darkMode={this.props.darkMode.active}
                                />
                            </div>
                        </div>
                        {this.props.topSites.active &&
                            <div className={style.subSection}>
                                <div className={style.subTitle}>
                                    Site Labels
                                </div>
                                <div className={style.choice}>
                                    <Toggle
                                        active={this.props.topSites.verbose}
                                        action={this.props.topSites.verboseToggle}
                                        darkMode={this.props.darkMode.active}
                                    />
                                </div>
                            </div>
                        }

                        <a
                            className={style.feedback}
                            href={LINK_SURVEY_PAGE}>
                            Let us know what you think{' '}
                            {ArrowRight({
                                width: '6px',
                                height: '6px',
                                marginRight: '0',
                                marginBottom: '1px',
                                verticalAlign: 'baseline'
                            })}
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export function sidePanelProps(props){
    return {
        darkMode: {
            active:         props.darkMode.active,
            toggle:         props.toggleDarkMode
        },
        topSites: {
            active:         props.topSites.active,
            toggle:         props.toggleTopSites,
            verbose:        props.topSites.verbose,
            verboseToggle:  props.toggleVerboseTopSites
        },
        searchBar: {
            active:         props.searchBar.active,
            toggle:         props.toggleSearchBar
        },
        bookmarksBar: {
            active:         props.bookmarksBar.active,
            toggle:         props.toggleBookmarksBar
        }
    }
}

SidePanel.propTypes = {
    trendingOn: PropTypes.bool
}
