class IndexedDb {
    constructor(dbName, dbVersion, storeName) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
        this.storeName = storeName;
    }

    storeItem(item) {
        const idb = window.indexedDB;
        const dbOpenRequest = idb.open(this.dbName, this.dbVersion);
        const storeName = this.storeName;
        var db;

        dbOpenRequest.onsuccess = (function(event) {
            db = dbOpenRequest.result;
            addData();
        });

        function addData() {
            var tx = db.transaction(storeName, "readwrite");
            var store = tx.objectStore(storeName);
            store.add(item);
        }
    }

    static createObjectStore(version, dbName, storeName, primaryKey) {
        const idb = window.indexedDB;
        var openRequest = idb.open(dbName, version);
        openRequest.onupgradeneeded = function(event) {
            var db = event.target.result;
            if (! db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, {keyPath: primaryKey});
            }
        }
    }
}

export {IndexedDb};