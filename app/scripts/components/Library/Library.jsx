var React   = require('react/addons'),
    _       = require('lodash'),
    $       = require('jquery'),
    Element = require('./Element'),
    Tooltip = require('./Tooltip');

var Library = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        names: React.PropTypes.object.isRequired,
        elements: React.PropTypes.object.isRequired,
        options: React.PropTypes.object.isRequired,
        filter: React.PropTypes.object.isRequired,
        setFilter: React.PropTypes.func.isRequired,
        setStatus: React.PropTypes.func.isRequired,
        completed: React.PropTypes.array.isRequired
    },

    getDefaultProps: function () {
        return {
            elements: {},
            completed: []
        };
    },

    getInitialState: function () {
        return {
            name: null,
            image: null,
            make: null,
            composition: null,
            visible: false
        };
    },

    _heading: function () {
        var _title    = 'All Elements',
            _headings = {
                descendants: 'Elements you can build',
                children: 'Elements you can make with: ',
                search: 'Elements found with: '
            };

        if (this.props.filter.type && this.props.filter.value) {
            _title = _headings[this.props.filter.type] + (this.props.filter.value ? (this.props.filter.type === 'children' ? this.props.filter.value : this.props.filter.value) : '');
        }

        return _title;
    },

    _filtered: function () {
        var filtered = [],
            _parent;

        if (this.props.filter.type === 'descendants') {
            _.map(this.props.elements, function (d, i) {
                if (d.parents) {
                    _.each(d.parents, function (p) {
                        if (this.props.completed.indexOf(p[0]) > -1 && this.props.completed.indexOf(p[1]) > -1) {
                            filtered.push(i);
                        }
                    }, this);
                }
            }, this);
        }
        else if (this.props.filter.type === 'children') {
            _.map(this.props.elements, function (d, i) {
                if (d.name === this.props.filter.value) {
                    _parent = +d.id;
                }
            }, this);

            _.map(this.props.elements, function (d, i) {
                if (d.parents) {
                    _.each(d.parents, function (p) {
                        if (p[0] === _parent || p[1] === _parent) {
                            filtered.push(i);
                        }
                    }, this);
                }
            }, this);

        }
        else if (this.props.filter.type === 'search') {
            _.map(this.props.elements, function (d, i) {
                if (d.name.indexOf(this.props.filter.value) > -1) {
                    filtered.push(i);
                }
            }, this);
        }

        return filtered;
    },

    _onHover: function (e) {
        var _element = e.currentTarget.parentNode.parentNode,
            state = {};

        if (e.type === 'mouseenter') {
            state = {
                name: _element.getAttribute('name'),
                image: _element.querySelectorAll('img')[0].src,
                make: _element.dataset.make,
                composition: _.map(_element.dataset.composition.split(';'), function (d, i) {
                    return <div key={i}>{d}</div>;
                }),
                visible: true
            };
        }
        else {
            state.visible = false;
        }
        this.setState(state);
    },

    _onClickStatus: function (e) {
        e.preventDefault();
        var _element = e.currentTarget;
        this.props.setStatus(_element.parentNode.parentNod.dataset.id, _element.classList.contains('remove'));
    },

    _onClickChildren: function (e) {
        e.preventDefault();
        var _element = e.currentTarget;
        this.props.setFilter({ type: 'children', value: _element.parentNode.parentNod.dataset.name });
    },

    render: function () {
        //console.log('Library:render');
        var elements,
            filtered = this._filtered(),
            options  = {
                visible: 0,
                classes: []
            };

        elements = _.map(this.props.elements, function (d, i) {
            options.completed = this.props.completed.indexOf(+i) > -1;
            options.parents = [];
            _.map(d.parents, function (p) {
                options.parents.push(
                    _.map(p, function (p2) {
                        return this.props.names[p2];
                    }, this).join(' + ')
                );
            }, this);
            options.children = _.map(d.children, function (c) {
                return this.props.names[c];
            }, this);

            options.visible += (this.props.filter.type && filtered.indexOf(i) === -1 ? 0 : 1);

            return (
                <li key={i} id={i} name={d.name}
                    className={'item thumbnail' + (!d.children.length ? ' finalElement' : '') + (options.completed ? ' completed' : '') + (this.props.filter.type && filtered.indexOf(i) === -1 ? ' hidden' : '') }
                    data-composition={d.parents ? options.parents.join(';') : ''}
                    data-make={options.children.join(', ')}>
                    <div className="buttons">
                        <a href="#" className="info"
                           onMouseEnter={this._onHover} onMouseLeave={this._onHover}><i className="fa fa-eye"></i></a>
                        <a href="#" title="mark as completed"
                           className={'status ' + (options.completed ? 'remove' : 'add')}
                           onClick={this._onClickStatus}></a>
                        <a href="#" title="things you can make with..."
                           className={'filter' + (d.children.length ? '' : ' disabled')}
                           onClick={this._onClickChildren}>{
                            d.children.length
                                ? <i className="fa fa-external-link-square"></i>
                                : ''
                        }</a>
                    </div>
                    <div className="image">
                        <img
                            src={(d.image ? 'data:image/png;base64,' + d.image : '../media/blank.png')}/>
                    </div>
                    <h5>{ d.name}</h5>
                    { options.children.length ? <span className="count">{options.children.length}</span> : null}
                </li>
            );
        }, this);

        options.heading = this._heading(options.visible);

        if (filtered) {
            options.classes.push('filtered');
        }

        if (!options.visible) {
            options.classes.push('empty');
        }

        if (this.props.options.showCompleted) {
            options.classes.push('show-completed');
        }

        return (
            <div className="app__library">
                <h3>{options.heading}</h3>
                <a className="clearQuery" href="#"><i className="icon-remove-sign"></i></a>
                <ul className={options.classes.join(' ')}>
                    {elements}
                </ul>
                <Tooltip {...this.state}/>
            </div>
        );
    }

});

module.exports = Library;