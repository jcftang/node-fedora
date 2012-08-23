[![build status](https://secure.travis-ci.org/jcftang/node-fedora.png)](http://travis-ci.org/jcftang/node-fedora)
# Fedora Library

Library to be able to query a Fedora Commons instance from Node.js using the official Fedora REST API.

## Configuration

There are 2 ways to configure the package:

Hard coding it into lib/fedora.js
	fedora.js contains a commented out snippet that could be used

The recommended way is using the configure method called from your application or library
	var fedora = require("fedora")
	var config = {
		fedoraURL : "localhost", // Don't add http://
		fedoraPort : 9090,
		fedoraAuth : "fedoraAdmin:admin"
	};
	fedora.configure(config)

## Testing

There are some tests which can be run, the tests use the 'mocha' framework and assumes that there is fedora-commons repository installed.

## Opportunities

Implementing all of the functionality from Fedora Commons.
