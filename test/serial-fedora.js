var should = require('should');
var fedora = require('fedora');

var testNamespace = "8node";
var testLabel = "A very nice test label datastream";
var testResult = "";

var config = {
	"uploadDirectory" : "/home/qgrootbl/pubic_html/uploads/",
	"publicDirectory" : "http://ceres.tchpc.tcd.ie/~qgrootbl/uploads/",
	"fedoraURL" : "howest-server.tchpc.tcd.ie",
	"fedoraPort" : 9191,
	"fedoraAuth" : "fedoraAdmin:admin"
}
describe('Test cases for the node-fedora package', function() {
	fedora.configure(config);
	describe('Calling createFedoraObject(), will create a fedoraObject', function() {
		it('should create a fedoraObject', function(done) {
			fedora.createFedoraObject(testNamespace, testLabel, function(result) {
				testResult = result;
				result.should.exist
				result.should.include(testNamespace + ":");
				done();
			});
		});
	}), describe('Calling getFedoraList(), Get a list of fedoraObjects', function() {
		it('should return a list of fedoraObjects from the fedora repository', function() {
			fedora.getFedoraList("*", function(resultData) {
				resultData.should.exist
				resultData.should.include('result');
				resultData.should.not.be.empty
			}, function(error) {
				should.not.exist(error);
			});
		})
	}), describe('Calling getFedoraObject(), get a fedoraObject', function() {
		it('should return a fedoraObject', function(done) {
			fedora.getFedoraObject(testResult, function(resultData) {
				resultData.should.include(testResult);
				done();
			});
		});
	}), describe('Calling addXMLDatastream(), to add a Datastream to an existing fedoraObject', function() {
		it('should return the datastream', function(done) {
			var data = '<oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd"><dc:title>jhdgj</dc:title><dc:identifier>4f8ffc8ff889d6ab44000001</dc:identifier></oai_dc:dc>'
			fedora.addXMLDatastream(testResult, "DC", data, function(resultData) {
				resultData.should.include(testResult);
				resultData.should.include("4f8ffc8ff889d6ab44000001");
				done();
			}, function(err) {
				console.log(err);
			});
		});
	}), describe('Calling modifyXMLDatastream(), to add a Datastream to an existing fedoraObject', function() {
		it('should return the datastream', function(done) {
			var data = '<oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd"><dc:title>jhdgj - updated!</dc:title><dc:identifier>4f8ffc8ff889d6ab44000001</dc:identifier></oai_dc:dc>'
			fedora.modifyXMLDatastream(testResult, "DC", data, function(resultData) {
				resultData.should.include(testResult);
				resultData.should.include("4f8ffc8ff889d6ab44000001");
				resultData.should.include("updated");
				done();
			}, function(err) {
				console.log(err);
			});
		});
	}), describe('Calling addMediaDatastream(), to add a Datastream to an existing fedoraObject', function() {
		it('should return the datastream', function(done) {
			var data = {
				fileLocation: 'd9375fdf1fa331bbe0b4aa79f766972f0d408a29/Eagle_Fall_Sunrise.jpg'
			}
			fedora.addMediaDatastream(testResult, "IMAGE", data, function(resultData) {
				resultData.should.include(testResult);
				done();
			}, function(err) {
				console.log(err);
			});
		});
	}), describe('Calling modifyMediaDatastream(), to add a Datastream to an existing fedoraObject', function() {
		it('should return the datastream', function(done) {
			var data = {
				fileLocation: 'd9375fdf1fa331bbe0b4aa79f766972f0d408a29/Eagle_Fall_Sunrise.jpg'
			}
			fedora.modifyMediaDatastream(testResult, "IMAGE", data, function(resultData) {
				resultData.should.include(testResult);
				console.log(resultData)
				done();
			}, function(err) {
				console.log(err);
			});
		});
	}), describe('Calling deleteObject(), will delete an object from fedora', function() {
		it('should delete the requested object from fedora', function(done) {
			fedora.deleteObject(testResult, function(resultData) {
				var myregexp = new RegExp("[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.?[0-9]*Z");
				resultData.should.match(myregexp);
				done();
			}, function(error) {
				should.not.exist(error);
			});
		})
	}), describe('Calling getNextPID(), will get the next PID that is available from fedora', function() {
		it('should return the next PID from fedora', function(done) {
			fedora.getNextPID("node", function(resultData) {
				resultData.should.include("node:");
				done();
			});
		});
	})
})
