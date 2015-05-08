var dbName = 'todo';
var dbVersion = 1.0;
var imgDB = {};
var indexedDB = window.indexedDB ||
    window.webkitIndexedDB ||
    window.mozIndexedDB;

if ('webkitIndexedDB' in window) {
    window.IDBTransaction = window.webkitIDBTransaction;
    window.IDBKeyRange = window.webkitIDBKeyRange;
}

imgDB.indexedDB = {};
imgDB.indexedDB.db = null;

// Add an item only if we have more then zero letters
function addImg (value) {
    imgDB.indexedDB.addImg(value);
}

$(document).bind('pageinit', function () {
    console.log('-- lets start the party --');
    imgDB.indexedDB.open();
    $('#addItem').click(function () {
        addImg();
    });
});

imgDB.indexedDB.onerror = function (e) {
    console.log(e);
};

imgDB.indexedDB.open = function () {
    var request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = function (e) {
        console.log('success our DB: ' + dbName);
        imgDB.indexedDB.db = e.target.result;
        var db = imgDB.indexedDB.db;
        if (db.setVersion) {
            console.log('in old hack checking for DB inside setVersion: ' + db.setVersion);
            if (db.version !== dbVersion) {
                var req = db.setVersion(dbVersion);
                req.onsuccess = function () {
                    if (db.objectStoreNames.contains('todo')) {
                        db.deleteObjectStore('todo');
                    }

                    var store = db.createObjectStore('todo',
                        { keyPath: 'timeStamp' });
                    var trans = req.result;
                    trans.oncomplete = function () {
                        console.log('== oncomplete transaction ==');
                        imgDB.indexedDB.getAll();
                    };
                };
            }
            else {
                imgDB.indexedDB.getAll();
            }
        }
        else {
            imgDB.indexedDB.getAll();
        }
    };

    request.onupgradeneeded = function (e) {
        console.log('Going to upgrade our DB');
        imgDB.indexedDB.db = e.target.result;
        var db = imgDB.indexedDB.db;
        if (db.objectStoreNames.contains('todo')) {
            db.deleteObjectStore('todo');
        }
        var store = db.createObjectStore('todo',
            { keyPath: 'timeStamp' });
        imgDB.indexedDB.getAll();
    };

    request.onfailure = imgDB.indexedDB.onerror;
    request.onerror = function (e) {
        console.error('Err:' + e);
    };
};

imgDB.indexedDB.addImg = function (todoText) {
    var db = imgDB.indexedDB.db;
    var trans = db.transaction(['todo'], 'readwrite');
    var store = trans.objectStore('todo');

    var data = {
        text: todoText,
        timeStamp: new Date().getTime()
    };
    var request = store.put(data);
    request.onsuccess = function (e) {
        imgDB.indexedDB.getAll();
    };
    request.onerror = function (e) {
        console.error('Error Adding an item: ', e);
    };
};

imgDB.indexedDB.deleteImg = function (id) {
    var db = imgDB.indexedDB.db;
    var trans = db.transaction(['todo'], 'readwrite');
    var store = trans.objectStore('todo');
    var request = store.delete(id);
    request.onsuccess = function (e) {
        imgDB.indexedDB.getAll();
    };
    request.onerror = function (e) {
        console.error('Error deleteing: ', e);
    };
};

imgDB.indexedDB.getAll = function () {
    var db = imgDB.indexedDB.db;
    var trans = db.transaction(['todo'], 'readwrite');
    var store = trans.objectStore('todo');
    var result;

    // Get everything in the store;
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store.openCursor(keyRange);

    cursorRequest.onsuccess = function (e) {
        result = e.target.result;
        if (!!result === false) {
            return;
        }
        result.continue();
    };
    cursorRequest.onerror = imgDB.indexedDB.onerror;

    return result.value;
};
