var sinon  = require('sinon');
var expect = require('sinon-expect').enhance(
	require('expect.js'), sinon, 'was'
);
var rewire = require('rewire');
var from   = require('from');
var concat = require('concat-stream');

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
			History.getState.returns({data: state});
			var handler = sinon.spy();

			Speyside.createServer(handler).listen();

			expect(handler).was.called();
			expect(handler.lastCall.args[0]).to.have.property(
				'state', state
			);
			expect(handler.lastCall.args[0]).to.have.property(
				'url', global.location.pathname
			);
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
			expect(handler.lastCall.args[0]).to.have.property(
				'state', state
			);
			expect(handler.lastCall.args[0]).to.have.property(
				'url', '/foo'
			);
		}
	},
	'body': {
		'should pass through request body stream': function(done) {
			var body = from(['hello']);
			Speyside.createServer(function(req) {
				req.on('error', done);
				req.pipe(concat(function(body) {
					expect(body.toString('utf8')).to.be('hello');
					done();
				}));
			}).handler(body);
		}
	}
};