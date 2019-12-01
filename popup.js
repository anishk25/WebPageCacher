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
    // let idb = window.indexedDB;
    // var dbPromise = idb.open('webcache-db', 1);

    var currentUrl = await getUrlOfCurrentPage();
    var pageSource = await getCurrentPageSource();
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