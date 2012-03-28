var assert = require('assert');
var fedora = require('fedora');
var testNamespace = "node";
var testLabel = "A very nice test label";
var testResult = "";
module.exports = {
	'test1 CreateFedoraObject': function(done) {
		
		fedora.createFedoraObject(testNamespace,testLabel, function(result){
			testResult = result;
			console.log("CreateFedoraObject" + testResult);
			assert.includes(result,"node:");
			done();
		});
	},
	'test2 GetFedoraList': function(done) {
		console.log("GetFedoraList" + testResult);
		fedora.getFedoraList(function(resultData){
			assert.isDefined(resultData);
			done();
		}, 
		function(e){
			console.log(e);
		});
	},
	'test3 GetFedoraItem': function(done) {
		console.log("GetFedoraItem" + testResult);
		fedora.getFedoraObject(testResult, function(resultData){
			assert.includes(resultData,testResult);
			done();
		});
	},
	'test4 DeleteObject': function(done) {
		
		fedora.deleteObject(testResult, function(resultData){
			console.log(resultData);
			//assert.includes(resultData,"node:");
			done();
		});
	},
	'test5 GetNextPID': function(done) {
		
		fedora.getNextPID("node", function(resultData){
			assert.includes(resultData,"node:");
			done();
		});
	}
};
