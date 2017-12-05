import { bindActionCreators } from 'redux'
import * as actionCreators  from './combineActions'

/* Connect
–––––––––––––––––––––––––––––––––––––––––––––––––– */
export function mapStateToProps( state ){
    return {
        darkMode:           state.darkMode,
        topSites:           state.topSites,
        searchBar:          state.searchBar,
        bookmarksBar:       state.bookmarksBar,
        trendingArticles:   state.trending.articles,
        trendingTopics:     state.trending.topics
    }
}

export function mapDispatchToProps(dispatch){
    return bindActionCreators(actionCreators, dispatch)
}
