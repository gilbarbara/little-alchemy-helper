var React = require('react');

var Tooltip = React.createClass({

    render: function () {
        return (
            <div id="tooltip">
                <div className="image"></div>
                <h4></h4>

                <div className="made"></div>
                <h5>can make</h5>

                <div className="make">§§</div>
            </div>
        );
    }

});

module.exports = Tooltip;