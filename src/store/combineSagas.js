import { all }                      from 'redux-saga/effects'

import { wSetup }                   from '../containers/background/_setup'
import { wAuthCodeRecieved }        from '../containers/auth/_auth'
import { wLogout }                  from '../containers/auth/_auth'

import { wDarkModeHydrate }         from '../containers/newtab/settings/_darkmode'
import { wDarkModeSet }             from '../containers/newtab/settings/_darkmode'
import { wDarkModeToggle }          from '../containers/newtab/settings/_darkmode'

import { wTopSitesInit }            from '../containers/newtab/topSites/_topSites'
import { wTopSitesRequest }         from '../containers/newtab/topSites/_topSites'
import { wTopSiteToggle }           from '../containers/newtab/topSites/_topSites'
import { wTopSiteSet }              from '../containers/newtab/topSites/_topSites'
import { wTopSiteVerbose }          from '../containers/newtab/topSites/_topSites'
import { wTopSitesHydrate }         from '../containers/newtab/topSites/_topSites'

import { wSearchBarSet }            from '../containers/newtab/searchBar/_searchBar'
import { wSearchBarToggle }         from '../containers/newtab/searchBar/_searchBar'
import { wSearchBarHydrate }        from '../containers/newtab/searchBar/_searchBar'

import { wBookmarksBarSet }         from '../containers/newtab/bookmarksBar/_bookmarksBar'
import { wBookmarksBarToggle }      from '../containers/newtab/bookmarksBar/_bookmarksBar'
import { wBookmarksBarHydrate }     from '../containers/newtab/bookmarksBar/_bookmarksBar'
import { wBookmarksBarInit }        from '../containers/newtab/bookmarksBar/_bookmarksBar'
import { wBookmarksFolderOpen }     from '../containers/newtab/bookmarksBar/_bookmarksBar'
import { wBookmarksFolderClose }    from '../containers/newtab/bookmarksBar/_bookmarksBar'

import { wGetTrendingArticles }     from '../containers/newtab/trending/articles/_articles'
import { wInvalidateArticles }      from '../containers/newtab/trending/articles/_articles'
import { wSaveTrendingArticle }     from '../containers/newtab/trending/articles/_articles'
import { wRemoveTrendingArticle }   from '../containers/newtab/trending/articles/_articles'

import { wGetTrendingTopics }   from '../containers/newtab/trending/topics/_topics'

export default function* rootSaga() {
    yield all([

        wSetup(),
        wAuthCodeRecieved(),
        wLogout(),

        wDarkModeHydrate(),
        wDarkModeSet(),
        wDarkModeToggle(),

        wTopSitesHydrate(),
        wTopSitesInit(),
        wTopSitesRequest(),
        wTopSiteToggle(),
        wTopSiteSet(),
        wTopSiteVerbose(),

        wSearchBarHydrate(),
        wSearchBarSet(),
        wSearchBarToggle(),

        wBookmarksBarHydrate(),
        wBookmarksBarInit(),
        wBookmarksBarSet(),
        wBookmarksBarToggle(),
        wBookmarksFolderOpen(),
        wBookmarksFolderClose(),

        wGetTrendingArticles(),
        wInvalidateArticles(),
        wSaveTrendingArticle(),
        wRemoveTrendingArticle(),

        wGetTrendingTopics(),
    ])
}
