var assert = require('assert');
var data = require('../lib/dri');

module.exports = {
	'getSeries': function() {
		var series = data.getAllSeries();
		assert.isNotNull(series);
	}
};
