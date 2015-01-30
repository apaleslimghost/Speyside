<h1 align="center">
	<img src="https://raw.githubusercontent.com/quarterto/Speyside/master/logo.png"><br>
	<a href="http://badge.fury.io/js/speyside">
		<img src="https://badge.fury.io/js/speyside.svg" alt="npm version">
	</a>
	<a href="https://travis-ci.org/quarterto/Speyside">
		<img src="https://travis-ci.org/quarterto/Speyside.svg" alt="Build status">
	</a>
</h1>

Clientside history server. Has an interface broadly similar to Node's `http`, so if you're clever you can reuse your server handlers.

```javascript
var spey = require('speyside');

var server = spey.createServer(function(req) {
	console.log(req.url, req.state);
});

server.listen();
server.navigate('/foo', {bar: 'baz'}); //⇒ '/foo' {bar: 'baz'}
```

Licence
---
MIT