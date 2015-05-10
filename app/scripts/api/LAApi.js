var $       = require('jquery'),
    Storage = require('../utils/Storage'),
    XHR     = require('../constants/AppConstants').XHR;

var LAApi = {
    url: 'http://littlealchemyhelper.com/api',

    fetchBase: function (release) {
        var AppActions = require('../actions/AppActions'),
            base       = Storage.getItem('base_' + release);

        if (base) {
            AppActions.baseLoaded(XHR.SUCCESS, JSON.parse(base));
        }
        else {
            $.ajax({
                url: this.url + '/' + release + '/' + 'base',
                method: 'GET',
                dataType: 'json',
                complete: function (xhr) {
                    if (xhr.status === 0) {
                        AppActions.baseLoaded(XHR.FAIL, {
                            error: 'server error - status 0'
                        });
                    }
                    else if (xhr.status < 299) {
                        AppActions.baseLoaded(XHR.SUCCESS, xhr.responseJSON);
                        Storage.setItem('base_' + release, JSON.stringify(xhr.responseJSON));
                    }
                    else {
                        AppActions.baseLoaded(XHR.FAIL, xhr.responseJSON);
                    }
                }
            });
        }
    },

    fetchNames: function (release) {
        var AppActions = require('../actions/AppActions'),
            names      = Storage.getItem('names_' + release);

        if (names) {
            AppActions.namesLoaded(XHR.SUCCESS, JSON.parse(names));
        }
        else {
            $.ajax({
                url: this.url + '/' + release + '/' + 'names',
                method: 'GET',
                dataType: 'json',
                complete: function (xhr) {
                    if (xhr.status === 0) {
                        AppActions.namesLoaded(XHR.FAIL, {
                            error: 'server error - status 0'
                        });
                    }
                    else if (xhr.status < 299) {
                        AppActions.namesLoaded(XHR.SUCCESS, xhr.responseJSON);
                        Storage.setItem('names_' + release, JSON.stringify(xhr.responseJSON));
                    }
                    else {
                        AppActions.namesLoaded(XHR.FAIL, xhr.responseJSON);
                    }
                }
            });
        }
    },

    fetchImages: function (release) {
        var AppActions = require('../actions/AppActions');

        $.ajax({
            url: this.url + '/' + release + '/' + 'images',
            method: 'GET',
            dataType: 'json',
            complete: function (xhr) {
                if (xhr.status === 0) {
                    AppActions.imagesLoaded(XHR.FAIL, {
                        error: 'server error - status 0'
                    });
                }
                else if (xhr.status < 299) {
                    AppActions.imagesLoaded(XHR.SUCCESS, xhr.responseJSON);
                    //Storage.setItem('images_' + release, JSON.stringify(xhr.responseJSON));
                }
                else {
                    AppActions.imagesLoaded(XHR.FAIL, xhr.responseJSON);
                }
            }
        });
    }
};

module.exports = LAApi;
