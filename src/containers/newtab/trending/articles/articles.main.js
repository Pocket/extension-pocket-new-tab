import style from './articles.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'


import { PocketLogoType } from '../../../../components/icons/icons.pocketlogotype'
// import { Disconnected } from '../../../../components/icons/icons.disconnected'

import ArticlesItem     from './articles.item'
import ArticlesSkeleton from './skeleton/skeleton'

import classNames from 'classnames/bind'
const cx = classNames.bind(style)

export default class TrendingArticles extends Component {

    get listItems(){
        const list = (!!Object.keys(this.props.list).length)
            ? this.props.list
            : [
                {id:0, skeleton:true},
                {id:1, skeleton:true},
                {id:2, skeleton:true}
            ]

        return Object.keys(list)
            .slice(0,3)
            .map( x => list[x])
            .sort((a,b) => parseInt(a.index, 10) - parseInt(b.index, 10))
    }

    render() {

        const listClass = cx({
            list: true,
            darkMode: this.props.darkMode
        })

        return (
            <div className={style.trendingStories}>
                <h4 className={style.sectionTitle}>
                    <a className={style.titleLink}
                        href="http://jonathan.dev.readitlater.com/explore/trending?src=chrome_new_tab">
                        Trending Stories
                    </a>
                    <div className={style.logo}>
                        <a href="http://jonathan.dev.readitlater.com"
                            onClick={this.props.analyticsClickPocket}>
                            {PocketLogoType({width:'auto',height:'20px'})}
                        </a>
                    </div>
                </h4>


                <ul className={listClass}>
                    {this.listItems.map( (data, index) => {
                        return (data.skeleton)
                            ? <ArticlesSkeleton
                                key={data.id}
                                darkMode={this.props.darkMode}/>
                            : <ArticlesItem
                                darkMode={this.props.darkMode}
                                saveArticle={this.props.saveArticle}
                                removeArticle={this.props.removeArticle}
                                index={index}
                                key={data.id}
                                item={data}/>
                    } ) }
                </ul>

            </div>
        )}
}
export function trendingArticlesProps(props){
    return {
        list: props.trendingArticles.current,
        darkMode: props.darkMode.active,
        saveArticle: props.saveTrendingArticle,
        removeArticle: props.removeTrendingArticle
    }
}

TrendingArticles.propTypes = {
    saveTrendingArticle     : PropTypes.func,
    removeTrendingArticle     : PropTypes.func,
    list        : PropTypes.object
}
