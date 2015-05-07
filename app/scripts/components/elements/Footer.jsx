var React = require('react/addons');

var Footer = React.createClass({

    render: function () {
        return (
            <footer className="app__footer">
                <div className="container">
                    <a href="http://kollectiv.org/" target="_blank">kollectiv</a>
                </div>
            </footer>
        );
    }

});

module.exports = Footer;
