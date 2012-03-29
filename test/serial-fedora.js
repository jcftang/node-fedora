var assert = require('assert');
var fedora = require('fedora');
var testNamespace = "node";
var testLabel = "A very nice test label";
var testResult = "";
module.exports = {
	'test1 CreateFedoraObject': function(done) {
		
		fedora.createFedoraObject(testNamespace,testLabel, function(result){
			testResult = result;
			assert.includes(result,testNamespace+":");
			done();
		});
	},
	'test2 GetFedoraList': function(done) {
		fedora.getFedoraList("*",function(resultData){
			assert.isDefined(resultData);
			done();
		}, 
		function(e){
			console.log(e);
		});
	},
	'test3 GetFedoraItem': function(done) {
		fedora.getFedoraObject(testResult, function(resultData){
			assert.includes(resultData,testResult);
			done();
		});
	},
	'test4 DeleteObject': function(done) {
		
		fedora.deleteObject(testResult, function(resultData){
			myregexp = new RegExp("[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]+Z");
			assert.match(resultData,myregexp);
			done();
		}, function(e){
			console.log(e);
			});
	},
	'test5 GetNextPID': function(done) {
		
		fedora.getNextPID("node", function(resultData){
			assert.includes(resultData,"node:");
			done();
		});
	}
};
