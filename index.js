function Speyside(handler) {
	this.handler = handler.bind(this);
}

Speyside.prototype.listen = function() {
	window.addEventListener('popstate', this.handler);
	this.handler({state: history.state, url: location.pathname});
};

Speyside.prototype.navigate = function(url, state) {
	this.handler({state: state, url: url});
	history.pushState(state, null, url);
};

Speyside.createServer = function(handler) {
	return new Speyside(handler);
};