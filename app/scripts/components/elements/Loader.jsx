var React = require('react');

var Loader = React.createClass({
	render: function () {
		return (
			<div className="loader">
				<svg className="loader__svg">
					<circle className="loader__circle"
							cx="50"
							cy="50"
							r="20"
							fill="none"
							strokeWidth="2"
						/>
				</svg>
			</div>
		);
	}
});

module.exports = Loader;
