var Storage = {
    getItem: function (name) {
        var item = this.isLocalStorageNameSupported() ? localStorage.getItem(name) : name;
        return JSON.parse(item);
    },

    setItem: function (name, value) {
        if (this.isLocalStorageNameSupported()) {
            localStorage.setItem(name, JSON.stringify(value));
        }
    },

    removeItem: function (name) {
        if (this.isLocalStorageNameSupported()) {
            localStorage.removeItem(name);
        }
    },

    clearAll: function () {
        if (this.isLocalStorageNameSupported()) {
            localStorage.clear();
        }
    },

    isLocalStorageNameSupported: function () {
        var testKey = 'test', storage = window.sessionStorage;
        try {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return true;
        }
        catch (error) {
            return false;
        }
    }
};

module.exports = Storage;
