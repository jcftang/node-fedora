
var assert = require('assert');
var data = require('../lib/admin');

module.exports = {
	'test String#length': function(beforeExit, assert) {
		assert.equal(6, 'foobar'.length);
	},
	
	'test2 String#length': function(beforeExit, assert) {
		// need to setup req
		var req, res;
		data.getItems(req,res);
		assert.equal(6, 'foobar'.length);
	}
};
