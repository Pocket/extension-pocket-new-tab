/* Utilities
–––––––––––––––––––––––––––––––––––––––––––––––––– */
import { isFunction } from './utilities'

const chrome = window.chrome

/* Listeners Functions
–––––––––––––––––––––––––––––––––––––––––––––––––– */
function addMessageListener(handler) {
    return chrome.runtime.onMessage.addListener(handler)
}

function onUpdateAvailable(handler) {
    return chrome.runtime.onUpdateAvailable.addListener(handler)
}

function reloadExtension() {
    return chrome.runtime.reload()
}

function onInstalled() {
    return chrome.runtime.onInstalled
}

function setUninstallUrl(url) {
    return chrome.runtime.setUninstallURL(url)
}

function onSuspend() {
    return chrome.runtime.onSuspend
}

function onTabActivated(callback) {
    return chrome.tabs.onActivated.addListener(callback)
}

function onTabUpdate(callback) {
    return chrome.tabs.onUpdated.addListener(callback)
}

function onTabCreated(callback) {
    return chrome.tabs.onCreated.addListener(callback)
}
/* Messaging
–––––––––––––––––––––––––––––––––––––––––––––––––– */
function sendMessage(message, cb) {
    let callback = isFunction(cb) ? cb : () => {}
    return chrome.runtime.sendMessage(message, callback)
}

function sendMessageToTab(tabId, message) {
    return chrome.tabs.sendMessage(tabId, message)
}

function sendMessageToAllTabs(msg) {
    getAllTabs(function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
            sendMessageToTab(tabs[i], msg)
        }
    })
}

/* Bookmarks
–––––––––––––––––––––––––––––––––––––––––––––––––– */
function bookmark(id) {
    return new Promise(resolve => {
        chrome.bookmarks.get(id, resolve)
    })
}

function bookmarks() {
    return new Promise(resolve => {
        chrome.bookmarks.getTree(resolve)
    })
}

function bookmarksAll(id) {
    return new Promise(resolve => {
        chrome.bookmarks.getTree(id, resolve)
    })
}

function bookmarksChildren(id) {
    return new Promise(resolve => {
        chrome.bookmarks.getChildren(id, resolve)
    })
}

function onBookmarkUpdated(callback) {
    chrome.bookmarks.onCreated.addListener(callback)
    chrome.bookmarks.onRemoved.addListener(callback)
    chrome.bookmarks.onChanged.addListener(callback)
    chrome.bookmarks.onMoved.addListener(callback)
    chrome.bookmarks.onChildrenReordered.addListener(callback)
    chrome.bookmarks.onImportEnded.addListener(callback)
}

/* Browser
–––––––––––––––––––––––––––––––––––––––––––––––––– */
function browserAction() {
    return chrome.browserAction
}
function contextMenus() {
    return chrome.contextMenus
}
function cookies() {
    return chrome.cookies
}

function getTopSites() {
    return new Promise(resolve => {
        chrome.topSites.get(resolve)
    })
}

function checkPermission(permissions) {
    return new Promise(resolve => {
        chrome.permissions.contains({ permissions }, resolve)
    })
}

function requestPermission(permissions) {
    return new Promise(resolve => {
        chrome.permissions.request({ permissions }, resolve)
    })
}

function removePermission(permissions) {
    return new Promise(resolve => {
        chrome.permissions.remove({ permissions }, resolve)
    })
}

function openUrl(url) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {
        chrome.tabs.update(tab[0].id, { url })
    })
}

function openTabWithUrl(url, inBackground) {
    let makeTabActive = inBackground === true ? false : true
    return chrome.tabs.create({ url: url, active: makeTabActive })
}

function openTab() {
    chrome.tabs.create({})
}

function activePrivateMode(tab) {
    return tab.incognito
}

function setToolbarIcon(tabId, iconName) {
    const smallIconPath = `images/${iconName}-19.png`
    const bigIconPath = `images/${iconName}-38.png`
    chrome.browserAction.setIcon({
        tabId: tabId,
        path: {
            '19': smallIconPath,
            '38': bigIconPath
        }
    })
}

function updateToolbarIcon(tabId, activateIcon) {
    activateIcon
        ? setToolbarIcon(tabId, 'browser-action-icon-added')
        : setToolbarIcon(tabId, 'browser-action-icon')
}

/* References
–––––––––––––––––––––––––––––––––––––––––––––––––– */

function getBackgroundPage() {
    return chrome.extension.getBackgroundPage()
}

function getCurrentTab(cb) {
    let callback = isFunction(cb) ? cb : () => {}
    return chrome.tabs.query({ active: true }, function(tab) {
        callback(tab)
    })
}

function getAllTabs(cb) {
    let callback = isFunction(cb) ? cb : () => {}
    return chrome.tabs.query({}, callback)
}

function getPath(path) {
    return window.chrome.runtime.getURL(path)
}

function queryTabs(queryObject, cb) {
    let callback = isFunction(cb) ? cb : () => {}
    return chrome.tabs.query(queryObject, callback)
}

function closeTabs(tabIDs) {
    return chrome.tabs.remove(tabIDs)
}

function getVersion() {
    const manifestData = chrome.runtime.getManifest()
    return manifestData.version
}

/* Local Storage
–––––––––––––––––––––––––––––––––––––––––––––––––– */
function storage() {
    return chrome.storage.local
}

function getSetting(key) {
    return localStorage.getItem(key)
}

function setSettings(values) {
    Object.keys(values).forEach(function(key) {
        localStorage.setItem(key, values[key])
    })
}

function removeSettings(values) {
    values.forEach(function(key) {
        localStorage.removeItem(key)
    })
}

export {
    activePrivateMode,
    addMessageListener,
    bookmark,
    bookmarks,
    bookmarksAll,
    bookmarksChildren,
    browserAction,
    onBookmarkUpdated,
    closeTabs,
    contextMenus,
    cookies,
    getAllTabs,
    getBackgroundPage,
    getCurrentTab,
    getPath,
    getSetting,
    getVersion,
    onInstalled,
    onSuspend,
    onTabCreated,
    onTabActivated,
    onTabUpdate,
    onUpdateAvailable,
    openTab,
    openTabWithUrl,
    openUrl,
    checkPermission,
    requestPermission,
    queryTabs,
    reloadExtension,
    removeSettings,
    removePermission,
    sendMessage,
    sendMessageToAllTabs,
    sendMessageToTab,
    setSettings,
    setToolbarIcon,
    setUninstallUrl,
    storage,
    getTopSites,
    updateToolbarIcon
}
