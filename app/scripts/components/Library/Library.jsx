var React   = require('react/addons'),
    _       = require('lodash'),
    Element = require('./Element');

var Library = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        heading: React.PropTypes.string.isRequired,
        names: React.PropTypes.object.isRequired,
        elements: React.PropTypes.object.isRequired,
        _getCookie: React.PropTypes.func.isRequired
    },

    getDefaultProps: function () {
        return {
            elements: {}
        };
    },

    componentWillMount: function () {

    },

    render: function () {
        var elements,
            options = {};

        elements = _.map(this.props.elements, function (d, i) {
            options.lahSaved = this.props._getCookie().indexOf(+i) > -1;
            options.parents = [];
            _.map(d.parents, function (p) {
                options.parents.push(
                    _.map(p, function (p2) {
                        return this.props.names[p2];
                    }.bind(this)).join(' + ')
                );
            }.bind(this));
            options.children = _.map(d.children, function (d) {
                return this.props.names[d];
            }.bind(this));

            return (
                <li key={i} id={i} title={d.name}
                    className={'item thumbnail ' + (!d.children.length ? ' finalElement' : '') + (options.lahSaved || d.prime ? ' completed' : '')}
                    data-composition={d.parents ? options.parents.join(';') : ''}
                    data-make={options.children.join(', ')}>
                    <div className="buttons">
                        <a href="#" className="info"><i className="fa fa-eye"></i></a>
                        <a href="#" title="mark as completed" className="adder"></a>
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
        }.bind(this));

        return (
            <div className="app__library">
                <h3>{this.props.heading}</h3>
                <a className="clearQuery" href="#"><i className="icon-remove-sign"></i></a>
                <ul className="clearfix">
                    {elements}
                </ul>
            </div>
        );
    }

});

module.exports = Library;