import {WEB_CACHE_DB_NAME, WEB_PAGE_STORE_NAME, WEB_CACHE_DB_VERSION} from './constants.js';
import {IndexedDb} from './indexed_db.js'

chrome.runtime.onInstalled.addListener(function(){

    if (!('indexedDB' in window)) {
        console.log("This browser doesn't support indexedDB");
        return;
    }

    IndexedDb.createObjectStore(WEB_CACHE_DB_VERSION, WEB_CACHE_DB_NAME, WEB_PAGE_STORE_NAME, 'url');
});
