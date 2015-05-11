var React = require('react/addons'),
    _     = require('lodash');

var Utils = {
    _buildElements: function (images) {
        var state    = this.state,
            elements = {};

        images = images || this.state.images;

        _.each(state.base, function (b1, i1) {
            elements[i1] = {
                id: i1,
                name: state.names[i1],
                image: images[i1],
                prime: b1.prime,
                hidden: b1.hidden
            };

            if (!b1.prime) {
                elements[i1].parents = [];
                _.each(b1.parents, function (p) {
                    elements[i1].parents.push([p[0], p[1]]);
                });
            }
            elements[i1].children = [];

            _.each(state.base, function (b2, i2) {
                _.each(b2.parents, function (p) {
                    if (p.indexOf(+i1) > -1) {
                        if (elements[i1].children.indexOf(+i2) === -1) {
                            elements[i1].children.push(+i2);
                        }
                    }
                });
            });
        });
        return elements;
    },

    _getQueryOption: function (name) {
        name = name.replace(/[\[]/, '\\\\[').replace(/[\]]/, '\\\\]');
        var regex   = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(location.search);
        return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    _onReceiveData: function (data) {
        this.setState({
            completed: _.union(data, this._primeElements()).sort((a, b) => {
                return a - b;
            })
        }, this._setCookie);
    },

    _setFilter: function (filters) {
        filters = filters.value !== undefined && !filters.value.length ? {} : filters;
        this.setState({ filter: filters });
    },

    _setStatus: function (element, remove) {
        var _completed = this.state.completed.slice(0);

        if (remove) {
            _.pull(_completed, +element);
        }
        else {
            _completed.push(+element);
        }

        this.setState({
            completed: _completed
        }, this._setCookie);
    },

    _setOptions: function (option, status) {
        let state = {};

        if (option === 'resetCompleted') {
            this._removeCookie();
            state.completed = this._primeElements();
        }
        else {
            state = React.addons.update(this.state,
                { options: { [option]: { $set: !this.state.options[option] } } }
            );
        }

        this.setState(state, this._setCookie);
    },

    _primeElements: function () {
        var elements = [1, 2, 3, 4];
        /*
         _.map(_.keys(this.state.base), function (k) {
         if (this.state.base[k].prime) {
         elements.push(+k);
         }
         }, this);
         */

        return elements;
    },

    _isJson: function (str) {
        try {
            JSON.parse(str);
        }
        catch (e) {
            return false;
        }
        return true;
    }
};

module.exports = Utils;
