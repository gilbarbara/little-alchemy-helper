var keyMirror = require('react/lib/keyMirror');

var AppConstants = {
    ActionTypes: keyMirror({
        FETCH_BASE: undefined,
        FETCH_NAMES: undefined,
        FETCH_IMAGES: undefined,
        NAVIGATE: undefined,
        SHOW_ALERT: undefined
    }),
    XHR: keyMirror({
        SUCCESS: undefined,
        FAIL: undefined
    })
};

module.exports = AppConstants;
