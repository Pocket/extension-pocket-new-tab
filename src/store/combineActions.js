import { setupActions }             from '../containers/background/_setup'
import { topSiteActions }           from '../containers/newtab/topSites/_topSites'
import { darkModeActions }          from '../containers/newtab/settings/_darkmode'
import { searchBarActions }         from '../containers/newtab/searchBar/_searchBar'
import { bookmarksBarActions }      from '../containers/newtab/bookmarksBar/_bookmarksBar'
import { trendingArticlesActions }  from '../containers/newtab/trending/articles/_articles'

const { setupExtension } = setupActions
const { getTopSites, toggleTopSites, toggleVerboseTopSites } = topSiteActions
const { toggleDarkMode } = darkModeActions
const { toggleSearchBar } = searchBarActions
const { toggleBookmarksBar, engageBookmarksBar, clearBookmarksNode,
    openBookmarkFolder, closeBookmarkFolder, openBookmarksOverflow } = bookmarksBarActions
const { saveTrendingArticle, removeTrendingArticle } = trendingArticlesActions

export {
    setupExtension,
    toggleDarkMode,
    getTopSites,
    toggleTopSites,
    toggleVerboseTopSites,
    toggleSearchBar,
    toggleBookmarksBar,
    engageBookmarksBar,
    clearBookmarksNode,
    openBookmarkFolder,
    closeBookmarkFolder,
    openBookmarksOverflow,
    saveTrendingArticle,
    removeTrendingArticle
}

export function openPocket(){ return { type: 'OPEN_POCKET' }}
export function newTabOpened(){ return { type: 'NEW_TAB_OPENED'}}
export function newTabCreated(){ return { type: 'NEW_TAB_CREATED'}}
export function hydrateState(){ return { type: 'HYDRATE_STATE'}}
