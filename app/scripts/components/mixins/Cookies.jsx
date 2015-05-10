var cookie = require('react-cookie'),
    _      = require('lodash');

var Cookies = {
    _primeElements: function () {
        var elements = [];
        _.map(_.keys(this.state.base), function (k) {
            if (this.state.base[k].prime) {
                elements.push(+k);
            }
        }, this);

        return elements;
    },

    _addToCookie: function (id) {
        var _cookie    = cookie.load(this.appName),
            savedArray = _cookie ? _cookie.split('|') : this._primeElements();

        savedArray.push(id);
        savedArray = _.uniq(savedArray);
        cookie.save(this.appName, savedArray.join('|'));

        return savedArray;
    },

    _getCookie: function () {
        var _cookie    = cookie.load(this.appName),
            savedArray = _cookie ? _cookie.split('|') : this._primeElements();

        if (this._getQueryOption('import') && !this.imported) {
            savedArray = _.uniq(
                _.union(
                    _.map(this._getQueryOption('import').split(','), function (d) {
                        return +d;
                    }),
                    this._primeElements()
                )
            );
                cookie.save(this.appName, savedArray.join('|'));
            this.imported = true;
        }

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

    _removeFromCookie: function (id) {
        var _cookie = cookie.load(this.appName);
        if (!_cookie) {
            return false;
        }

        var savedArray = _cookie.split('|');
        if (savedArray.indexOf(id) > -1) {
            savedArray.splice(savedArray.indexOf(id), 1);
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
