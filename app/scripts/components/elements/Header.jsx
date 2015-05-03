var React        = require('react/addons'),
	NPMPackage   = require('../../../../package.json');

var Header = React.createClass({
	mixins: [React.addons.PureRenderMixin],

	propTypes: {
		elementsCount: React.PropTypes.number.isRequired
	},

	getDefaultProps: function () {
		return {
			elementsCount: 530
		};
	},

	render: function () {
		return (
			<header className="app__header">
				<h1>Little Alchemy Helper</h1>
				<h4>A tool to help you with the game <a href="http://littlealchemy.com/" target="_blank">Little Alchemy</a> with all {this.props.elementsCount} elements</h4>
				<button id="helpBtn"><i className="fa fa-question"></i> Help</button>
			</header>
		);
	}

});

module.exports = Header;
