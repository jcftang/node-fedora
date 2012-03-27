var assert = require('assert');
var fedora = require('fedora');

module.exports = {
	'test1 GetFedoraList': function(beforeExit, assert) {
		xml = fedora.getFedoraList();
		assert.isDefined(xml);
		assert.isNotNull(xml);
	},
	'test2 GetFedoraItem': function(beforeExit, assert) {
		xml = fedora.getFedoraObject();
		assert.isDefined(xml);
		assert.isNotNull(xml);
	},
	'test3 GetNextPID': function(beforeExit, assert) {
		
		fedora.createFedoraObject("node", function(result){
			assert.includes(result,"node:");
		});
	}
};
// uuid
//mocha, connect
