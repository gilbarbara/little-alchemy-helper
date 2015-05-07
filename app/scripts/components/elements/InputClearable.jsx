var React = require('react/addons');

var InputClearable = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    propTypes: {
        _onChange: React.PropTypes.func.isRequired,
        _onKeyDown: React.PropTypes.func.isRequired,
        autocomplete: React.PropTypes.string,
        id: React.PropTypes.string.isRequired,
        placeholder: React.PropTypes.string.isRequired,
        type: React.PropTypes.string,
        value: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            autocomplete: 'off',
            type: 'text'
        };
    },

    _clearInput: function (e) {
        var el = e.currentTarget.previousSibling;
        e.preventDefault();
        el.value = '';

        this.props._onChange(el);
    },

    render: function () {
        return (
            <div className={'clearable' + (this.props.value ? ' full' : '')}>
                <input type={this.props.type} id={this.props.id} className="form-control input-lg"
                       placeholder={this.props.placeholder} autoComplete={this.props.autocomplete}
                       value={this.props.value}
                       onKeyDown={this.props._onKeyDown} onChange={this.props._onChange}/>
                <a href="#" className="fa fa-times-circle" onClick={this._clearInput} tabIndex="-1"></a>
            </div>
        );
    }

});

module.exports = InputClearable;