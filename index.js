var History = require('html5-history');
var Transform = require('stream').Transform;
var util = require('util');

function Request(req, server) {
	Transform.call(this);

	this.server = server;
	this.url = req.url;
	this.state = req.state;
	if(req.state.readable) {
		req.state.pipe(this);
	} else if(req.state.body) {
		this.write(req.state.body);
	}
}
util.inherits(Request, Transform);

Request.prototype._transform = function(chunk, encoding, callback) {
	callback(null, chunk);
};

Request.prototype.navigate = function(url, state) {
	this.server.navigate(url, state);
};

function Speyside(handler) {
	this._handler = handler;
}

Speyside.prototype.listen = function() {
	History.Adapter.bind(window, 'statechange', triggerHandler.bind(this));
	triggerHandler.call(this);

	function triggerHandler() {
		this.handler({state: History.getState().data, url: location.pathname});
	}

	return this;
};

Speyside.prototype.handler = function(req) {
	this._handler.call(this, new Request(req, this));
};

Speyside.prototype.navigate = function(url, state) {
	this.handler({url: url, state: state});
	History.pushState(state, null, url);
};

Speyside.createServer = function(handler) {
	return new Speyside(handler);
};

module.exports = Speyside;
