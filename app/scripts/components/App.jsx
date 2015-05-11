var React           = require('react'),
    _               = require('lodash'),
    $               = require('jquery'),
    bootstrapSwitch = require('bootstrap-switch'),
    config          = require('../config'),
    AppActions      = require('../actions/AppActions'),
    AppConstants    = require('../constants/AppConstants'),
    LAStore         = require('../stores/LAStore'),
    Cookies         = require('./mixins/Cookies'),
    Utils           = require('./mixins/Utils'),
    Help            = require('./elements/Help'),
    Header          = require('./elements/Header'),
    Toolbar         = require('./elements/Toolbar'),
    Library         = require('./Library/Library'),
    Footer          = require('./elements/Footer'),
    Loader          = require('./elements/Loader');

var App = React.createClass({
    mixins: [React.addons.PureRenderMixin, Cookies, Utils],

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
                showAll: false,
                showSecret: false,
                showCheats: true,
                showCompleted: false,
                iframe: false,
                outdated: false
            }
        };
    },

    componentWillMount: function () {
        var state   = this.state,
            _cookie = this._getCookie();

        if (this._getQueryOption('type') === 'iframe') {
            window.onmessage = function (e) {
                if (e.data.length) {
                    this._onReceiveData(e.data);
                }
            }.bind(this);

            state = React.addons.update(state,
                {
                    options: {
                        iframe: { $set: true },
                        outdated: { $set: !!(!this._getQueryOption('version') || this._getQueryOption('version') !== config.bookmarkletVersion) }
                    }
                }
            );
        }

        state = React.addons.update(state,
            {
                completed: { $set: _cookie.completed },
                options: {
                    showCompleted: { $set: _cookie.showCompleted },
                    showAll: { $set: _cookie.showAll },
                    showCheats: { $set: _cookie.showCheats }
                }
            }
        );

        this.setState(state);
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
            this.setState({
                elements: this._buildElements(),
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
