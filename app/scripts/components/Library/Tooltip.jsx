var React = require('react/addons');

var Tooltip = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    render: function () {
        return (
            <div className={'tooltip' + (this.props.visible ? ' visible' : '')} style={ {
            top: 0,
            left: 0
            } }>
                <div className="image" style={ {backgroundImage: 'url(' + this.props.image + ')' }}></div>
                <h4>{this.props.name}</h4>

                <div className="made">{this.props.composition}</div>
                <h5>can make</h5>

                <div className="make">{this.props.make}</div>
            </div>
        );
    }

});

module.exports = Tooltip;