var React = require('react');

var Help = React.createClass({

    render: function () {
        return (
            <div className="help">
                <div className="app__container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-4"><i className="fa fa-eye fa-fw"></i>view parents and descendants
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-4"><i className="fa fa-plus-square fa-fw"></i>mark as completed
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-4"><i className="fa fa-external-link-square fa-fw"></i>view the things you can do with it
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Help;
