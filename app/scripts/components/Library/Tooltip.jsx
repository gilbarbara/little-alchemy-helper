var React = require('react/addons');

var Tooltip = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    render: function () {
        return (
            <div id="tooltip">
                <div className="image">{this.props.image}</div>
                <h4></h4>
                <div className="made"></div>
                <h5>can make</h5>
                <div className="make">§§</div>
            </div>
        );
    }

});

module.exports = Tooltip;