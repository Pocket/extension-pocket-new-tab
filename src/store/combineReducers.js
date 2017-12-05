import { combineReducers } from 'redux'

// Setup
import { setup }        from '../containers/background/_setup'

// Features
import { darkMode }     from '../containers/newtab/settings/_darkmode'
import { topSites }     from '../containers/newtab/topSites/_topSites'
import { searchBar }    from '../containers/newtab/searchBar/_searchBar'
import { bookmarksBar } from '../containers/newtab/bookmarksBar/_bookmarksBar'

// Trending
import { articles }     from '../containers/newtab/trending/articles/_articles'
import { topics }       from '../containers/newtab/trending/topics/_topics'

const trending          = combineReducers({articles, topics})

export default combineReducers({
    setup,
    darkMode,
    topSites,
    searchBar,
    bookmarksBar,
    trending
})
