var sinon = require('sinon');
var expect = require('sinon-expect').enhance(
	require('expect.js'), sinon, 'was'
);
var rewire = require('rewire');

var Speyside = rewire('../');
var win = {}, History = {
	Adapter: {bind: sinon.spy()},
	getState: sinon.stub(),
	pushState: sinon.spy()
};

Speyside.__set__({
	History: History
});

if(!global.window) {
	global.window = win;
}
if(!global.location) {
	global.location = {pathname: '/'};
}

exports['Speyside unit tests'] = {
	'createServer': {
		'should return instance of server': function() {
			expect(Speyside.createServer(function() {})).to.be.a(Speyside);
		}
	},
	'listen': {
		'should call handler with initial state': function() {
			var state = {};
			History.getState.returns(state);
			var handler = sinon.spy();

			Speyside.createServer(handler).listen();

			expect(handler).was.called();
			expect(handler.lastCall.args[0]).to.eql({
				state: state,
				url: global.location.pathname
			});
		},
		'should bind history adaptor to window': function() {
			var handler = sinon.spy();

			Speyside.createServer(handler).listen();

			expect(History.Adapter.bind).was.calledWith(
				global.window, 'statechange'
			);
		}
	},
	'navigate': {
		'should call handler immediately': function() {
			var handler = sinon.spy();
			var state = {};

			Speyside.createServer(handler).navigate('/foo', state);

			expect(handler).was.called();
			expect(handler.lastCall.args[0]).to.eql({
				state: state,
				url: '/foo'
			});
		}
	}
};