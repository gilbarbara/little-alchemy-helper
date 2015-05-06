var React        = require('react'),
    _            = require('lodash'),
    AppActions   = require('../actions/AppActions'),
    AppConstants = require('../constants/AppConstants'),
    LAStore      = require('../stores/LAStore'),
    Cookies      = require('./mixins/Cookies'),
    Help         = require('./elements/Help'),
    Header       = require('./elements/Header'),
    DesktopAlert = require('./elements/DesktopAlert'),
    Toolbar      = require('./elements/Toolbar'),
    Library      = require('./Library/Library'),
    Footer       = require('./elements/Footer'),
    Loader       = require('./elements/Loader');

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
            filter: { type: 'search', value: 'fire' },
            options: {
                showCompleted: false,
                showAll: false,
                showCheats: true
            }
        };
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
                elements: this.buildElements(),
                completed: _cookie,
                ready: true
            });
            AppActions.fetchImages();
        }

        if (_.size(this.state.images) && !_.size(prevState.images)) {
            this.setState({
                elements: this.buildElements()
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

    buildElements: function (images) {
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

    getQueryOption: function (name) {
        name = name.replace(/[\[]/, '\\\\[').replace(/[\]]/, '\\\\]');
        var regex   = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(location.search);
        return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    cleanHeader: function () {
        this.$item.hide().filter(':not(.completed)').show();
    },

    cleanQueries: function (skip) {
        skip = skip ? skip : [];
        if ($.inArray('completed', skip) === -1) {
            $('#showCompleted').removeClass('btn-primary').addClass('btn-default').find('span').html('show');
        }
        if ($.inArray('filter', skip) === -1) {
            $('#filter').trigger('clear');
        }
        if ($.inArray('search', skip) === -1) {
            $('#search').trigger('clear');
        }
    },

    filterMake: function (str) {
        if (str) {
            this.cleanQueries(['filter']);
            this.$item.filter(':not(.completed)').show();
            this.$item.filter(':data(composition[!*]=' + str + ')').hide().end();
            this.$library
                .find('.clearQuery').show();
        }
        else {
            this.cleanHeader();
        }
    },

    filterSearch: function (str) {
        var title;

        if (str) {
            this.cleanQueries(['search']);
            this.$item.hide();
            this.$item.find("h5:contains('" + str.toLowerCase() + "')").parent().show();
            if (this.$item.filter(':visible').size()) {
                title = 'Elements found with: ' + str;
                this.$library
                    .find('.clearQuery').show();
            }
            else {
                title = 'Nothing found';
            }
        }
        else {
            this.cleanHeader();
        }
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
        });
    },

    _setOptions: function (option, status) {
        var state = {};

        if (option === 'resetCompleted') {
            this._removeCookie();
            state.completed = this._primeElements();

            this.setState(state);
        }
        else {
            state[option] = { $set: !this.state.options[option] };
            state[option] = state[option];
            var newState = React.addons.update(this.state,
                { options: state }
            );
            this.setState(newState);
        }
    },

    render: function () {
        var output = {
            library: <Loader/>
        };

        if (this.state.ready) {
            output.library = <Library names={this.state.names} elements={this.state.elements}
                                      options={this.state.options}
                                      completed={this.state.completed} filter={this.state.filter}
                                      setFilter={this._setFilter} setStatus={this._setStatus}/>;

            output.toolbar = <Toolbar filter={this.state.filter} setFilter={this._setFilter}
                                      options={this.state.options} setOptions={this._setOptions}
                                      completedCount={this.state.completed.length}/>;
        }

        return (
            <div className="app">
                <Header elementsCount={this.state.elementsCount}/>
                <Help/>
                <main className="app__content">
                    <div className="app__container">
                        <DesktopAlert/>
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
