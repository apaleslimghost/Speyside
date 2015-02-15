var History = require('html5-history');

function Speyside(handler) {
	this.handler = handler.bind(this);
}

Speyside.prototype.listen = function() {
	History.Adapter.bind(window, 'statechange', triggerHandler.bind(this));
	triggerHandler.call(this);

	function triggerHandler() {
		this.handler({state: History.getState().data, url: location.pathname});
	}
};

Speyside.prototype.navigate = function(url, state) {
	this.handler({url: url, state: state});
	History.pushState(state, null, url);
};

Speyside.createServer = function(handler) {
	return new Speyside(handler);
};

module.exports = Speyside;
