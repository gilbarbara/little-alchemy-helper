var React   = require('react/addons'),
    _       = require('lodash'),
    $       = require('jquery'),
    tooltip = require('../../vendor/tooltip'),
    Element = require('./Element');

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

    componentDidMount: function () {
        $('.item').tooltip();
    },

    _heading: function () {
        var _title    = 'All Elements',
            _headings = {
                descendants: 'Elements you can build',
                children: 'Elements you can make with: ',
                search: 'Elements found with: '
            };

        if (this.props.filter.type && this.props.filter.value) {
            _title = (
                <div>
                    {_headings[this.props.filter.type]}
                    <span
                        className="element">{this.props.filter.value ? (this.props.filter.type === 'children' ? this.props.filter.value : this.props.filter.value) : ''}
                        <a href="#" className={!this.props.filter.type ? ' hidden' : ''}
                           onClick={this._onClickClearFilter}><i className="fa fa-times-circle-o"></i></a></span>
                </div>
            );
        }
        else if (!this.props.options.showAll) {
            _title = _headings.descendants;
        }

        return _title;
    },

    _filtered: function () {
        var filtered = [],
            _parent;

        if (this.props.filter.type === 'children') {
            _.map(this.props.elements, function (d) {
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
        else if (!this.props.options.showAll) {
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

        return filtered;
    },

    _onClickClearFilter: function (e) {
        e.preventDefault();
        this.props.setFilter({});
    },

    _onClickStatus: function (e) {
        e.preventDefault();
        var _element = e.currentTarget;
        this.props.setStatus(_element.parentNode.parentNode.id, _element.classList.contains('remove'));
    },

    _onClickChildren: function (e) {
        e.preventDefault();
        var _element = e.currentTarget;
        this.props.setFilter({ type: 'children', value: _element.parentNode.parentNode.dataset.name });
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

            options.visible += (filtered.length && filtered.indexOf(i) === -1 ? 0 : 1);

            return (
                <li key={i} id={i}
                    className={'item thumbnail' + (!d.children.length ? ' finalElement' : '') + (options.completed ? ' completed' : '') + (filtered.length && filtered.indexOf(i) === -1 ? ' hidden' : '') }
                    data-name={d.name}
                    data-composition={d.parents ? options.parents.join(';') : ''}
                    data-make={options.children.join(', ')}>
                    <div className="buttons">
                        <a href="#" className={'info' + (!this.props.options.showCheats ? ' muted' : '') }><i className={'fa ' + (this.props.options.showCheats ? 'fa-eye' : 'fa-eye-slash')}></i>
                        </a>
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

        if (filtered.length) {
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
                <h3>
                    {options.heading}
                </h3>
                <ul className={options.classes.join(' ')}>
                    {elements}
                </ul>
                <div className="tooltip">
                    <div className="image"></div>
                    <h4></h4>

                    <div className="made"></div>
                    <h5>can make</h5>

                    <div className="make"></div>
                </div>
            </div>
        );
    }

});

module.exports = Library;
