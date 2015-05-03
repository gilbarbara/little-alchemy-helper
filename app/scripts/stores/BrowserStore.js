var assign        = require('react/lib/Object.assign'),
	EventEmitter  = require('events').EventEmitter,
	AppConstants  = require('../constants/AppConstants'),
	AppDispatcher = require('../dispatcher/AppDispatcher'),
	Store         = require('../utils/Store'),
	StateHelper   = require('../utils/State');

var State = StateHelper.init({
	name: 'browserState',
	state: {
		alert: null
	}
});

var BrowserStore = assign(new Store(), EventEmitter.prototype, {
	process: function (payload) {
		var action = payload.action;

		switch (action.type) {

			case AppConstants.ActionTypes.SHOW_ALERT:
			{
				this.setAlertMessage(action.status, action.message, action.withTimeout);
				this.emitChange(AppConstants.ActionTypes.SHOW_ALERT);
				break;
			}

			case AppConstants.ActionTypes.NAVIGATE:
			{
				this.navigateTo(action.destination, action.params, action.query);
				this.emitChange(AppConstants.ActionTypes.NAVIGATE);
				break;
			}

			default:
			{
				break;
			}
		}
	},

	setAlertMessage: function (status, message, withTimeout) {
		var state = State.get();
		state.alert = {
			status: status,
			message: message,
			withTimeout: withTimeout
		};
		State.set(state);
	},

	getAlertMessage: function () {
		var state = State.get();
		var alert = state.alert;
		state.alert = null;
		State.set(state);
		return alert;
	},

	navigateTo: function (destination, params, query) {
		var state = State.get();
		state.currentPath = destination;
		state.params = params;
		State.set(state);
	}

});

BrowserStore.dispatchToken = AppDispatcher.register(BrowserStore.process.bind(BrowserStore));

module.exports = BrowserStore;
