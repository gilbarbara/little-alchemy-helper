var React   = require('react/addons'),
    _       = require('lodash'),
    Element = require('./Element'),
    Tooltip = require('./Tooltip');

var Library = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        names: React.PropTypes.object.isRequired,
        elements: React.PropTypes.object.isRequired,
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

    _heading: function () {
        var _title    = 'All Elements',
            _headings = {
                descendants: 'Elements you can build',
                children: 'Elements you can make with: ',
                search: 'Elements found with: '
            };

        if (this.props.filter.type) {
            _title = _headings[this.props.filter.type] + (this.props.filter.value ? (this.props.filter.type === 'children' ? this.props.names[this.props.filter.value] : this.props.filter.value) : '');
        }

        return _title;
    },

    _onClickStatus: function (e) {
        e.preventDefault();
        var _element = e.currentTarget;
        this.props.setStatus(_element.dataset.id, _element.classList.contains('remove'));
    },

    render: function () {
        var heading,
            elements = [],
            filtered = [],
            options  = {
                visible: 0
            };

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
                if (d.parents) {
                    _.each(d.parents, function (p) {
                        if (p[0] === this.props.filter.value || p[1] === this.props.filter.value) {
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
            options.children = _.map(d.children, function (d) {
                return this.props.names[d];
            }, this);

            options.visible += (filtered.length && filtered.indexOf(i) === -1 ? 0 : 1);

            return (
                <li key={i} id={i} title={d.name}
                    className={'item thumbnail' + (!d.children.length ? ' finalElement' : '') + (options.completed ? ' completed' : '') + (filtered.length && filtered.indexOf(i) === -1 ? ' hidden' : '') }
                    data-composition={d.parents ? options.parents.join(';') : ''}
                    data-make={options.children.join(', ')}>
                    <div className="buttons">
                        <a href="#" className="info"><i className="fa fa-eye"></i></a>
                        <a href="#" title="mark as completed"
                           className={'status ' + (options.completed ? 'remove' : 'add')} data-id={i}
                           onClick={this._onClickStatus}></a>
                        <a href="#" title="things you can make with..."
                           className={'filter' + (d.children.length ? '' : ' disabled')}>{(d.children.length ?
                            <i className="fa fa-external-link-square"></i> : '')}</a>
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

        heading = this._heading(options.visible);

        return (
            <div className="app__library">
                <h3>{heading}</h3>
                <a className="clearQuery" href="#"><i className="icon-remove-sign"></i></a>
                <ul className={filtered.length ? 'filtered' : ''}>
                    {elements}
                </ul>
                <Tooltip />
            </div>
        );
    }

});

module.exports = Library;