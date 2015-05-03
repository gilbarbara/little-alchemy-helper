var React = require('react/addons');

var NotFound = React.createClass({

	render: function () {
		return (
			<div key="404" className="not-found">
				<h1>404</h1>
			</div>
		);
	}
});

module.exports = NotFound;
