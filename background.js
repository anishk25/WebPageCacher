import {WEB_CACHE_DB_NAME, WEB_PAGE_STORE_NAME, WEB_CACHE_DB_VERSION} from './constants.js';

chrome.runtime.onInstalled.addListener(function(){

    if (!('indexedDB' in window)) {
        console.log("This browser doesn't support indexedDB");
        return;
    }

    const idb = window.indexedDB;
    var openRequest = idb.open(WEB_CACHE_DB_NAME, WEB_CACHE_DB_VERSION);
    openRequest.onupgradeneeded = function(event) {
        var db = event.target.result;
        if (! db.objectStoreNames.contains(WEB_PAGE_STORE_NAME)) {
            db.createObjectStore(WEB_PAGE_STORE_NAME, {keyPath: 'url'});
        }
    }
});
