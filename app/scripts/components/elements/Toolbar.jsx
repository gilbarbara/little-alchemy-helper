var React = require('react');

var Toolbar = React.createClass({

    render: function () {
        return (
            <div id="toolbar">
                <div id="reloader" className="alert">
                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                    <i className="fa fa-exclamation-triangle"></i> <span>Click the bookmarklet twice to reload your discovered elements</span>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <input type="text" id="filter" className="clearable form-control input-lg"
                               placeholder="Things you can make with..." autoComplete="off"/>
                    </div>
                    <div className="col-sm-6">
                        <input type="text" id="search" className="clearable form-control input-lg"
                               placeholder="Search elements" autoComplete="off"/></div>
                </div>
                <div className="row">
                    <div id="cheats" className="col-sm-6">
                        <div className="switch switch-square"
                             data-on-label="<i className='fa fa-check'></i>"
                             data-off-label="<i className='fa fa-times'></i>">
                            <input id="showCheats" type="checkbox" value="1"/>
                        </div>
                        <label>Show Cheats?</label>
                    </div>
                    <div id="completedOptions" className="col-sm-6">
                        <div className="btn-group">
                            <button id="showCompleted" className="btn btn-sm btn-default"><i className="fa fa-eye"></i>
                                <span>show</span> completed
                            </button>
                            <button id="resetCompleted" className="btn btn-sm btn-default"><i
                                className="fa fa-exclamation-triangle"></i> <span>reset completed</span></button>

                            <button id="completedCount" className="btn btn-sm btn-default disabled"><i
                                className="fa fa-check"></i>
                                <span>{this.props.completed}</span> completed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Toolbar;