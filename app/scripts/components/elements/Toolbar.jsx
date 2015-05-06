var React = require('react/addons'),
    _     = require('lodash'),
    $     = require('jquery');

var Toolbar = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        options: React.PropTypes.object.isRequired,
        filter: React.PropTypes.object.isRequired,
        setFilter: React.PropTypes.func.isRequired,
        setOptions: React.PropTypes.func.isRequired,
        completedCount: React.PropTypes.number.isRequired
    },

    getInitialState: function () {
        return {
            childrenString: (this.props.filter.type === 'children' ? this.props.filter.value : null),
            searchString: (this.props.filter.type === 'search' ? this.props.filter.value : null)
        };
    },

    componentWillReceiveProps: function (nextProps) {
        var state = {
            childrenString: (nextProps.filter.type === 'children' ? nextProps.filter.value : null),
            searchString: (nextProps.filter.type === 'search' ? nextProps.filter.value : null)
        };

        this.setState(state);
    },

    componentDidMount: function () {
        var $switches = $('[type=checkbox], [type=radio]'),
            that      = this;

        $switches.not('[data-switch-no-init]').bootstrapSwitch();
        $switches.on('switchChange.bootstrapSwitch', function (event, state) {
            that.props.setOptions(this.id, state);
        });
    },

    _onChange: function (e) {
        var el = e.currentTarget;

        this.setState({
            childrenString: (el.id === 'children' ? el.value : null),
            searchString: (el.id === 'search' ? el.value : null)
        });
    },

    _onKeyDown: function (e) {
        var el = e.currentTarget;
        if (e.keyCode === 13) {
            this.props.setFilter({
                type: el.id,
                value: el.value
            });
        }
    },

    _onClick: function (e) {
        var el = e.currentTarget;
        this.props.setOptions(el.id, !el.classList.contains('btn-primary'));
    },

    _onClickReset: function (e) {
        var el = e.currentTarget,
            timeout;

        function reset () {
            el.classList.remove('btn-danger');
            el.classList.add('btn-default');
            el.querySelectorAll('span')[0].innerHTML = 'reset completed';
        }

        if (el.classList.contains('btn-danger')) {
            clearTimeout(timeout);
            reset();
            this.props.setOptions('resetCompleted', el.classList.contains('btn-danger'));
        }
        else {
            el.querySelectorAll('span')[0].innerHTML = 'Are you sure?';
            el.classList.remove('btn-default');
            el.classList.add('btn-danger');

            timeout = setTimeout(function () {
                if (!el.classList.contains('btn-default')) {
                    reset();
                }
            }, 3000);
        }
    },

    render: function () {
        //console.log('Toolbar:render', this.props.filter);
        return (
            <div className="app__toolbar">
                <div id="reloader" className="alert">
                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                    <i className="fa fa-exclamation-triangle"></i> <span>Click the bookmarklet twice to reload your discovered elements</span>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <input type="text" id="children" className="clearable form-control input-lg"
                               placeholder="Things you can make with..." autoComplete="off"
                               value={this.state.childrenString}
                               onKeyDown={this._onKeyDown} onChange={this._onChange}/>
                    </div>
                    <div className="col-sm-6">
                        <input type="text" id="search" className="clearable form-control input-lg"
                               placeholder="Search elements" autoComplete="off"
                               value={this.state.searchString}
                               onKeyDown={this._onKeyDown} onChange={this._onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3">
                        <label>
                            <input id="showCheats" type="checkbox" value="1"
                                   data-on-text="<i class='fa fa-check'></i>"
                                   data-off-text="<i class='fa fa-times'></i>"
                                   defaultChecked={this.props.options.showCheats}/>Show Cheats?</label>
                    </div>
                    <div className="col-sm-3">
                        <label>
                            <input id="showAll" type="checkbox" value="1"
                                   data-on-text="<i class='fa fa-check'></i>"
                                   data-off-text="<i class='fa fa-times'></i>"
                                   defaultChecked={this.props.options.showAll}/>Show All?</label>
                    </div>
                    <div className="col-sm-6">
                        <div className="btn-group">
                            <button id="showCompleted"
                                    className={'btn btn-sm ' + (this.props.options.showCompleted ? 'btn-primary' : 'btn-default')}
                                    onClick={this._onClick}><i
                                className="fa fa-eye"></i><span>show completed</span>
                            </button>
                            <button id="resetCompleted" className="btn btn-sm btn-default"
                                    onClick={this._onClickReset}><i
                                className="fa fa-exclamation-triangle"></i><span>reset completed</span></button>

                            <button className="btn btn-sm btn-default disabled"><i
                                className="fa fa-check"></i>
                                <span>{this.props.completedCount}</span><span>completed</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = Toolbar;
