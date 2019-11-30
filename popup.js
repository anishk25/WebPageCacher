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

function cachePages(depth) {
    console.log("Cache depth is " + depth);
}

