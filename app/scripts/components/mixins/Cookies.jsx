var cookie = require('react-cookie'),
    _      = require('lodash');

var Cookies = {
    _getCookie: function () {
//      cookie.save(this.appName, '1,2,3,4,5,6');
        var _cookie = cookie.load(this.appName);

        if (!_cookie || !this._isJson(_cookie) || this._getQueryOption('import')) {
            _cookie = this._setCookie(!!this._getQueryOption('import'));
        }

        return JSON.parse(_cookie);
    },

    _setCookie: function (_import) {
        var _data = {
            showCheats: this.state.options.showCheats,
            showCompleted: this.state.options.showCompleted,
            showAll: this.state.options.showAll,
            completed: _.uniq(
                _.union(
                    this.state.completed,
                    this._primeElements()
                )
            ).sort((a, b) => {
                    return a - b;
                })
        };

        if (_import) {
            _data.completed = _.uniq(
                _.union(
                    _.map(this._getQueryOption('import').split(','), function (d) {
                        return +d;
                    }),
                    this._primeElements()
                )
            ).sort((a, b) => {
                    return a - b;
                });
        }

        cookie.save(this.appName, JSON.stringify(_data));

        return JSON.stringify(_data);
    },

    _removeCookie: function () {
        cookie.remove(this.appName);

        return [];
    }
};

module.exports = Cookies;
