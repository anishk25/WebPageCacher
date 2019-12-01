import {WEB_CACHE_DB_NAME, WEB_PAGE_STORE_NAME,WEB_CACHE_DB_VERSION} from './constants.js';
import {IndexedDb} from './indexed_db.js'

document.addEventListener('DOMContentLoaded', function() {
    documentLoaded();
 }, false);


function documentLoaded() {
    let cachePagesButton = document.getElementById("cachePagesButton");
    let cacheDepthInput = document.getElementById("cacheDepthInput");

    cachePagesButton.onclick = function (element) {
        var depth = 0;
        if (cacheDepthInput.value.length != 0) {
            depth = parseInt(cacheDepthInput.value);
        }
        cachePages(depth);
    };
}

async function cachePages(depth) {
    var currentUrl = await getUrlOfCurrentPage();
    var pageSource = await getCurrentPageSource();
    storePageSource(currentUrl, pageSource);
}


async function getUrlOfCurrentPage() {
    var promise = new Promise(function(resolve, reject){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            resolve(tabs[0].url);
        });
    });
    var url = await promise;
    return url;
}

async function getCurrentPageSource() {
    var promise = new Promise(function(resolve, reject){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const scriptToExec = `(${scrapeThePage})()`;
            chrome.tabs.executeScript(tabs[0].id, {code: scriptToExec}, function(results) {
                resolve(results[0]);
            });
        });
    })
    var pageSource = await promise;
    return pageSource;
}

function scrapeThePage() {
    var html_source = document.documentElement.outerHTML;
    return "<!DOCTYPE html>\n" + html_source;
}

function storePageSource(pageUrl, pageSource) {
    const db = new IndexedDb(WEB_CACHE_DB_NAME, WEB_CACHE_DB_VERSION, WEB_PAGE_STORE_NAME);
    var item = {
        url: pageUrl,
        page_source: pageSource,
        created: new Date().getTime()
    };
    db.storeItem(item);
}
