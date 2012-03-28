var assert = require('assert');
var fedora = require('fedora');

module.exports = {
	'test1 GetFedoraList': function(beforeExit, assert) {
		xml = fedora.getFedoraList();
		assert.isDefined(xml);
		assert.isNotNull(xml);
	},
	'test2 GetFedoraItem': function(beforeExit, assert) {
		fedora.getFedoraObject("dri:100", function(resultData){
			
			assert.includes(resultData,"dri:100");
		});
	},
	'test3 GetNextPID': function(beforeExit, assert) {
		
		fedora.getNextPID("node", function(result){
			assert.includes(result,"node:");
		});
	}
};
// uuid
//mocha, connect
