chrome.runtime.onInstalled.addListener(function(){

    if (!('indexedDB' in window)) {
        console.log("This browser doesn't support indexedDB");
        return;
    }

    let idb = window.indexedDB;
    idb.open('webcache-db', 1, function(upgradeDb){
        // define store for webpages
        // store will contain webpage url, webpage content and date created
        if (! upgradeDb.objectStoreNames.contains('webpage-store')) {
            updgradeDb.createObjectStore('webpage-store', {keypath: 'url'});
        }
    });
});
