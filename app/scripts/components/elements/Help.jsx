var React = require('react');

var Help = React.createClass({

    render: function () {
        return (
            <div id="help">
                <div className="container">
                    <h5>click the <i className="fa fa-plus-square"></i> to mark elements as completed</h5>
                    <h5>click the <i className="fa fa-external-link-square"></i> to view the thing you can do with it</h5>
                </div>
            </div>
        );
    }

});

module.exports = Help;