var React = require('react/addons');

var Header = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        elementsCount: React.PropTypes.number.isRequired
    },

    getDefaultProps: function () {
        return {
            elementsCount: 500
        };
    },

    _onClickShowHelp: function (e) {
        e.preventDefault();
        $('.help').slideToggle();
    },

    render: function () {
        return (
            <header className="app__header">
                <h1>Little Alchemy Helper</h1>
                <h4>A tool to help you with the game <a href="http://littlealchemy.com/" target="_blank">Little
                    Alchemy</a> with all {this.props.elementsCount} elements</h4>
                <a href="#" className="help-toggle" onClick={this._onClickShowHelp}><i className="fa fa-question"></i> Help</a>
            </header>
        );
    }

});

module.exports = Header;
