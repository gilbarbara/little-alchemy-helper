var cookie = require('react-cookie'),
    _      = require('lodash');

var Cookies = {
    _primeElements: function () {
        var elements = [];
        _.map(_.keys(this.state.base), function (k) {
            if (this.state.base[k].prime) {
                elements.push(+k);
            }
        }.bind(this));

        return elements;
    },

    _AddToCookie: function (name) {
        var _cookie = cookie.load(this.appName);

        if (!_cookie) {
            cookie.save(this.appName, name);
        }

        var savedArray = _cookie.split('|');
        savedArray.push(name);
        savedArray = _.uniq(savedArray);
        cookie.save(this.appName, savedArray.join('|'));

        return savedArray;
    },

    _getCookie: function () {
        var _cookie = cookie.load(this.appName);

        if (this.getQueryOption('import') && !this.imported) {
            cookie.save(this.appName, this.getQueryOption('import').split(',').join('|'));
            this.imported = true;
        }

        var savedArray = _.union(_cookie ? _cookie.split('|') : false, this._primeElements());

        if (isNaN(parseInt(savedArray[0], 10))) {
            /*! update old cookie format */
            var newArray = [], itemId;
            _.each(savedArray, function (d) {
                itemId = this.state.names.indexOf(d);
                newArray.push(itemId);
            }.bind(this));
            if (savedArray.length === newArray.length) {
                cookie.save(this.appName, newArray.join('|'));
                savedArray = newArray;
            }
        }

        savedArray = _.map(savedArray, function (n) {
            return +n;
        });

        return savedArray;
    },

    _removeFromCookie: function (name) {
        var _cookie = cookie.load(this.appName);
        if (!_cookie) {
            return false;
        }

        var savedArray = _cookie.split('|');
        if (savedArray.indexOf(name) > -1) {
            savedArray.splice(savedArray.indexOf(name), 1);
        }
        savedArray = _.uniq(savedArray);
        cookie.save(this.appName, savedArray.join('|'));

        return savedArray;
    },

    _removeCookie: function () {
        cookie.remove(this.appName);

        return [];
    }
};

module.exports = Cookies;
