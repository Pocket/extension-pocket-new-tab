import style                from './topics.scss'
import React, { Component } from 'react'
import PropTypes            from 'prop-types'
import { ArrowRight }       from '../../../../components/icons/icons.arrowright'

import TopicItem            from './topics.item'

export default class TrendingTopics extends Component {
    render() {
        return (
            <div className={style.section}>
                <div className={style.topics}>
                    <div className={style.title}>
                        <a className={style.titleLink}
                            href="http://jonathan.dev.readitlater.com/explore?src=chrome_new_tab">
                            Popular Topics:
                        </a>
                    </div>
                    <ul className={style.list}>
                        {this.props.list &&
                            this.props.list.map( (data, index) =>
                                <TopicItem
                                    key={index}
                                    index={index}
                                    item={data}/>
                            )
                        }
                    </ul>
                </div>
                <div className={style.viewMore}>
                    <a className={style.viewMoreLink}
                        href="http://jonathan.dev.readitlater.com/explore/trending?src=chrome_new_tab">
                        More Stories {ArrowRight({
                            width: '6px',
                            height: '6px',
                            marginRight: '0',
                            marginBottom: '1px',
                            verticalAlign: 'baseline'
                        })}
                    </a>
                </div>
            </div>
        )}
}

export function trendingTopicsProps(props){
    return {
        list: props.trendingTopics.current
    }
}

TrendingTopics.propTypes = {
    list        : PropTypes.array
}
