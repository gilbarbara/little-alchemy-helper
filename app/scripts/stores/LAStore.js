var assign        = require('react/lib/Object.assign'),
    EventEmitter  = require('events').EventEmitter,
    AppConstants  = require('../constants/AppConstants'),
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    Store         = require('../utils/Store'),
    StateHelper   = require('../utils/State');

var State = StateHelper.init({
    name: 'laState',
    state: {
        fetchBase: undefined,
        fetchNames: undefined,
        fetchImages: undefined
    }
}),
    images = {};

var LAStore = assign(new Store(), EventEmitter.prototype, {
    process: function (payload) {
        var action = payload.action;

        switch (action.type) {

            case AppConstants.ActionTypes.FETCH_BASE:
            {
                this.handleFetchBase(action);
                this.emitChange(AppConstants.ActionTypes.FETCH_BASE);
                break;
            }

            case AppConstants.ActionTypes.FETCH_NAMES:
            {
                this.handleFetchNames(action);
                this.emitChange(AppConstants.ActionTypes.FETCH_NAMES);
                break;
            }

            case AppConstants.ActionTypes.FETCH_IMAGES:
            {
                this.handleFetchImages(action);
                this.emitChange(AppConstants.ActionTypes.FETCH_IMAGES);
                break;
            }

            default:
            {
                break;
            }
        }

    },

    handleFetchBase: function (action) {
        var state = State.get();
        state.fetchBase = action;
        State.set(state);
    },

    fetchBaseResponse: function () {
        return State.get().fetchBase;
    },

    handleFetchNames: function (action) {
        var state = State.get();
        state.fetchNames = action;
        State.set(state);
    },

    fetchNamesResponse: function () {
        return State.get().fetchNames;
    },

    handleFetchImages: function (action) {
        images = action;
    },

    fetchImagesResponse: function () {
        return images;
    }

});

LAStore.dispatchToken = AppDispatcher.register(LAStore.process.bind(LAStore));
module.exports = LAStore;
