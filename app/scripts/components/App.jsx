var React           = require('react'),
    _               = require('lodash'),
    $               = require('jquery'),
    bootstrapSwitch = require('bootstrap-switch'),
    config          = require('../config'),
    AppActions      = require('../actions/AppActions'),
    AppConstants    = require('../constants/AppConstants'),
    LAStore         = require('../stores/LAStore'),
    Cookies         = require('./mixins/Cookies'),
    Help            = require('./elements/Help'),
    Header          = require('./elements/Header'),
    Toolbar         = require('./elements/Toolbar'),
    Library         = require('./Library/Library'),
    Footer          = require('./elements/Footer'),
    Loader          = require('./elements/Loader');

var App = React.createClass({
    mixins: [React.addons.PureRenderMixin, Cookies],

    getInitialState: function () {
        return {
            appName: 'lah',
            ready: false,
            base: {},
            names: {},
            images: {},
            elements: {},
            elementsCount: 500,
            completed: [],
            filter: {},
            options: {
                showCompleted: false,
                showAll: false,
                showCheats: false,
                iframe: false,
                outdated: false
            }
        };
    },

    componentWillMount: function () {
        if (this._getQueryOption('type') === 'iframe') {
                window.onmessage = function (e) {
                    if (e.data.length) {
                        this._onReceiveData(e.data);
                    }
                }.bind(this);

            this.setState(React.addons.update(this.state,
                {
                    options: {
                        iframe: { $set: true },
                        outdated: { $set: !!(!this._getQueryOption('version') || this._getQueryOption('version') !== config.bookmarkletVersion) }
                    }
                }
            ));
        }
    },

    componentDidMount: function () {
        LAStore.addChangeListener(this._handleChange);
        AppActions.fetchBase();
    },

    componentWillUnmount: function () {
        LAStore.removeChangeListener(this._handleChange);
    },

    componentDidUpdate: function (prevProps, prevState) {
        if (!_.size(this.state.names)) {
            AppActions.fetchNames();
        }
        if (_.size(this.state.names) && !_.size(prevState.names)) {
            var _cookie = this._getCookie();
            this.setState({
                elements: this._buildElements(),
                completed: _cookie,
                ready: true
            });
            AppActions.fetchImages();
        }

        if (_.size(this.state.images) && !_.size(prevState.images)) {
            this.setState({
                elements: this._buildElements()
            });
        }
    },

    _handleChange: function (action) {
        var response,
            state = {};

        if (action === AppConstants.ActionTypes.FETCH_BASE) {
            var base = {};
            response = LAStore.fetchBaseResponse();
            if (response.status === AppConstants.XHR.SUCCESS) {
                _.map(response.data, function (d, i) {
                    if (!d.platforms) {
                        base[i] = d;
                    }
                });
                state.base = base;
                state.elementsCount = _.size(_.filter(base, function (d) {
                    return !d.hidden;
                }));
            }
            else {
                state.error = 'Unable to load base';
            }
        }

        if (action === AppConstants.ActionTypes.FETCH_NAMES) {
            response = LAStore.fetchNamesResponse();
            if (response.status === AppConstants.XHR.SUCCESS) {
                state.names = response.data;
            }
            else {
                state.error = 'Unable to load names';
            }
        }

        if (action === AppConstants.ActionTypes.FETCH_IMAGES) {
            response = LAStore.fetchImagesResponse();
            if (response.status === AppConstants.XHR.SUCCESS) {
                state.images = response.data;
            }
            else {
                state.error = 'Unable to load images';
            }
        }

        this.setState(state);
    },

    _buildElements: function (images) {
        var state    = this.state,
            elements = {};

        images = images || this.state.images;

        _.each(state.base, function (b1, i1) {
            elements[i1] = {
                id: i1,
                name: state.names[i1],
                image: images[i1],
                prime: b1.prime
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
        });
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
            this._addToCookie(+element);
        }

        this.setState({
            completed: _completed
        });
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

        this.setState(state);
    },

    render: function () {
        var output = {
            library: <Loader/>
        };

        if (this.state.ready) {
            output.library = (<Library names={this.state.names} elements={this.state.elements}
                                       options={this.state.options} completed={this.state.completed}
                                       filter={this.state.filter} setFilter={this._setFilter}
                                       setStatus={this._setStatus}/>);

            output.toolbar = (<Toolbar filter={this.state.filter} setFilter={this._setFilter}
                                       options={this.state.options} setOptions={this._setOptions}
                                       completedCount={this.state.completed.length}/>);
        }

        return (
            <div className="app">
                <Header elementsCount={this.state.elementsCount}/>
                <Help/>
                <main className="app__content">
                    <div className="app__container">
                        {output.toolbar}
                        {output.library}
                    </div>
                </main>
                <Footer/>
            </div>
        );
    }

});

module.exports = App;
