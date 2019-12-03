import {WEB_CACHE_DB_NAME, WEB_PAGE_STORE_NAME, WEB_CACHE_DB_VERSION} from './constants.js';
import {IndexedDb} from './indexed_db.js'

const webPageDb = new IndexedDb(WEB_CACHE_DB_NAME, WEB_CACHE_DB_VERSION, WEB_PAGE_STORE_NAME);

chrome.runtime.onInstalled.addListener(function(){

    if (!('indexedDB' in window)) {
        console.log("This browser doesn't support indexedDB");
        return;
    }

    IndexedDb.createObjectStore(WEB_CACHE_DB_VERSION, WEB_CACHE_DB_NAME, WEB_PAGE_STORE_NAME, 'url');
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
            console.log("YOOOOOO!!");
            chrome.tabs.executeScript(
                tabId,
                {code: 'document.documentElement.outerHTML = ' + pageSource + ';'}
            );
        });
    }
})
