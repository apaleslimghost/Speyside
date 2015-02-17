var test = require('tape');
var sinon = require('sinon');

var Speyside = require('../');
var History = require('html5-history');

test('Speyside integration tests', function(t) {
	t.test('listen', function (t) {
		t.test('should call handler with initial state', function(t) {
			t.plan(3);

			var handler = sinon.spy();

			Speyside.createServer(handler).listen();

			t.ok(handler.called, 'handler was called');
			t.same(handler.lastCall.args[0].state, History.getState().data);
			t.equal(handler.lastCall.args[0].url, global.location.pathname);
		});

		t.test('should bind history adaptor to window', function(t) {
			t.plan(3);

			var handler = sinon.spy();
			var state = {};

			Speyside.createServer(handler).listen();
			History.replaceState(state, null, '/foo');

			t.ok(handler.called, 'handler was called');
			t.same(handler.lastCall.args[0].state, state);
			t.equal(handler.lastCall.args[0].url, '/foo');
		});
	});
});