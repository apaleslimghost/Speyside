var sinon = require('sinon');
var expect = require('sinon-expect').enhance(
	require('expect.js'), sinon, 'was'
);

var Speyside = require('../');
var History = require('html5-history');

var indent = 1;
function it(label, fn) {
	indent++;
	try {
		fn();
		console.log(Array(indent).join('  ') + '✓ ' + label);
	} catch(e) {
		console.log(Array(indent).join('  ') + '✖ ' + label);
		console.log('\n' + e.message + '\n' + e.stack + '\n');
	}
	indent--;
}

function describe(label, fn) {
	indent++;
	try {
		console.log(Array(indent).join('  ') + label);
		fn();
	} catch(e) {}
	indent--;
}

describe('Speyside integration tests', function() {
	describe('listen', function () {
		it('should call handler with initial state', function() {
			var handler = sinon.spy();

			Speyside.createServer(handler).listen();

			expect(handler).was.called();
			expect(handler.lastCall.args[0]).to.eql({
				state: History.getState().data,
				url: global.location.pathname
			});
		});
		it('should bind history adaptor to window', function() {
			var handler = sinon.spy();
			var state = {};

			Speyside.createServer(handler).listen();
			History.replaceState(state, null, '/foo');

			expect(handler).was.called();
			expect(handler.lastCall.args[0]).to.eql({
				state: state,
				url: '/foo'
			});
		});
	});
});
