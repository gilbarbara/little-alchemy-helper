var cookie = require('react-cookie'),
    _      = require('lodash');

var Cookies = {
    _setCookie: function () {
        var _cookie = cookie.load(this.appName);

        if (!_cookie) {
            cookie.save(this.appName, name);
        }

        var savedArray = _cookie.split('|');
        savedArray.push(name);
        savedArray = _.uniq(savedArray);
        cookie.save(this.appName, savedArray.join('|'));

        this.setState({ completedCount: savedArray.length + 4 });
    },

    _getCookie: function () {
        if (!cookie.load(this.name) && !this.getQueryOption('import')) {
            return [];
        }
        if (this.getQueryOption('import') && !this.imported) {
            cookie.save(this.name, this.getQueryOption('import').split(',').join('|'));
            this.imported = true;
        }

        var savedArray = cookie.load(this.name).split('|');

        if (isNaN(parseInt(savedArray[0], 10))) {
            /*! update old cookie format */
            var newArray = [], itemId;
            _.each(savedArray, function (d) {
                itemId = this.state.names.indexOf(d);
                newArray.push(itemId);
            });
            if (savedArray.length === newArray.length) {
                cookie.save(this.name, newArray.join('|'));
                savedArray = newArray;
            }
        }

        savedArray = _.map(savedArray, function (n) {
            return parseInt(n, 10);
        });
        this.setState({ completedCount: savedArray.length + 4 });

        return savedArray;
    },

    _removeCookie: function (name) {
        var _cookie = cookie.load(this.name);
        if (!_cookie) {
            return false;
        }

        var savedArray = _cookie.split('|');
        if (savedArray.indexOf(name) > -1) {
            savedArray.splice(savedArray.indexOf(name), 1);
        }
        savedArray = _.uniq(savedArray);
        cookie.save(this.name, savedArray.join('|'));

        this.setState({ completedCount: savedArray.length + 4 });
    },

    _resetCookie: function () {
        cookie.remove(this.name);
        this.setState({ completedCount: 4 });
    }
};

module.exports = Cookies;
