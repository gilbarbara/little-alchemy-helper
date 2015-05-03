var config        = require('../config'),
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    LAApi         = require('../api/LAApi'),
    ActionTypes   = require('../constants/AppConstants').ActionTypes;

module.exports = {
    /**
     * Change route path
     * @constructor
     * @param {String} destination - Route's Name
     * @param {Object} [params] - Route's Params
     * @param {String} [query] - Route's Query
     */
    goTo: function (destination, params, query) {
        AppDispatcher.handleViewAction({
            type: ActionTypes.NAVIGATE,
            destination: destination,
            params: params,
            query: query
        });
    },

    /**
     * Fetch Base
     * @constructor
     */
    fetchBase: function () {
        LAApi.fetchBase(config.release);
    },

    /**
     * Server response for a base requeset
     * @constructor
     * @param {String} status - Request Status ( success, fail )
     * @param {Object} data - xhr
     */
    baseLoaded: function (status, data) {
        AppDispatcher.handleViewAction({
            type: ActionTypes.FETCH_BASE,
            status: status,
            data: data
        });
    },

    /**
     * Fetch Names
     * @constructor
     */
    fetchNames: function () {
        LAApi.fetchNames(config.release);
    },

    /**
     * Server response for a names requeset
     * @constructor
     * @param {String} status - Request Status ( success, fail )
     * @param {Object} data - xhr
     */
    namesLoaded: function (status, data) {
        AppDispatcher.handleViewAction({
            type: ActionTypes.FETCH_NAMES,
            status: status,
            data: data
        });
    },

    /**
     * Fetch Images
     * @constructor
     */
    fetchImages: function () {
        LAApi.fetchImages(config.release);
    },

    /**
     * Server response for a images requeset
     * @constructor
     * @param {String} status - Request Status ( success, fail )
     * @param {Object} data - xhr
     */
    imagesLoaded: function (status, data) {
        AppDispatcher.handleViewAction({
            type: ActionTypes.FETCH_IMAGES,
            status: status,
            data: data
        });
    }
};
