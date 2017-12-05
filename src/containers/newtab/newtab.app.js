import style from'./newtab.scss' // Import style
import React, { Component } from 'react'

import SidePanel, { sidePanelProps } from './settings/sidePanel/sidePanel'
import SearchBar, { searchBarProps } from './searchBar/searchBar.main'
import BookmarksBar, { bookmarksBarProps } from './bookmarksBar/bookmarksBar.main'
import TopSites, { topSitesProps } from './topSites/topSites.main'
import TrendingTopics, { trendingTopicsProps } from './trending/topics/topics.main'
import TrendingArticles, { trendingArticlesProps } from './trending/articles/articles.main'

import classNames from 'classnames/bind'
const cx = classNames.bind(style)

class App extends Component {

    componentDidMount(){
        this.props.newTabOpened()
        document.body.classList.toggle('darkMode', this.props.darkMode.active)
    }

    componentWillReceiveProps(nextProps) {
        document.body.classList.toggle('darkMode', nextProps.darkMode.active)
    }

    get getSidePanelProps(){        return sidePanelProps(this.props) }
    get getBookmarksBarProps(){     return bookmarksBarProps(this.props) }
    get getSearchBarProps(){        return searchBarProps(this.props) }
    get getTopSitesProps(){         return topSitesProps(this.props) }
    get getTrendingTopicsProps(){   return trendingTopicsProps(this.props) }
    get getTrendingArticlesProps(){ return trendingArticlesProps(this.props) }

    render() {

        const containerClass = cx({
            container: true,
            darkMode: this.props.darkMode.active
        })

        return (
            <div>
                <BookmarksBar {...this.getBookmarksBarProps} />

                <div className={containerClass}>
                    <header className={style.header}>

                        <SearchBar {...this.getSearchBarProps}/>

                        <TopSites {...this.getTopSitesProps}/>

                    </header>

                    <TrendingArticles {...this.getTrendingArticlesProps}/>

                    <TrendingTopics {...this.getTrendingTopicsProps}/>

                </div>

                <SidePanel {...this.getSidePanelProps} />

            </div>
        )
    }
}


export default App
