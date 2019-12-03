import {WEB_CACHE_DB_NAME, WEB_PAGE_STORE_NAME, WEB_CACHE_DB_VERSION} from './constants.js';
import {IndexedDb} from './indexed_db.js'
import {fsErrorHandler} from './filesystem.js'

const webPageDb = new IndexedDb(WEB_CACHE_DB_NAME, WEB_CACHE_DB_VERSION, WEB_PAGE_STORE_NAME);
export var fileSystem;

chrome.runtime.onInstalled.addListener(function(){

    if (!('indexedDB' in window)) {
        console.log("This browser doesn't support indexedDB");
        return;
    }

    IndexedDb.createObjectStore(WEB_CACHE_DB_VERSION, WEB_CACHE_DB_NAME, WEB_PAGE_STORE_NAME, 'url');
    openFileSystem();
});

chrome.webNavigation.onErrorOccurred.addListener(function(details) {
    if (!navigator.onLine) {
        // load cached version of page
        var url = details.url;
        var tabId = details.tabId;
        console.log("Url is " + url);

        webPageDb.getItem(url, function(result) {
            if (result == null) {
                return;
            }
            var pageSource = result.page_source;
            // TODO: store source temporarily in a file and render the 
            // the page by redirecting to the file url instead
            chrome.tabs.executeScript(
                tabId,
                {code: 'document.documentElement.outerHTML = ' + pageSource + ';'}
            );
        });
    }
})

function openFileSystem() {
    const requestFunc = window.requestFileSystem || window.webkitRequestFileSystem;
    var fsSize = 500 * 1024 * 1024; // 500 MB
    requestFunc(window.TEMPORARY, fsSize, onInitFs, fsErrorHandler);

    function onInitFs(fs) {
        console.log("File system initialized");
        fileSystem = fs;
    }
}
