/**
 * @author Quirijn Groot Bluemink
 */
var res;
var meta;
var Mongolian = require("mongolian");
var ObjectId =  require('mongolian').ObjectId   // new ObjectId(byteBuffer or hexString)
//var parser = require('xml2json');
var http = require("http");
var options = {
	//host: '134.226.114.78',
	host: 'howest-server.tchpc.tcd.ie',
	port: 9191,
	auth: 'fedoraAdmin:admin'
};

exports.getFedoraList = function getFedoraList(){
	options.path = '/fedora/objects?terms=*&pid=true&subject=true&label=true&resultFormat=xml';
	
	http.get(options, function(res) {
		var resultData = "";
		res.on('data', function (xml) {
			resultData += xml;
		});
		res.on('end', function () {
			//console.log(resultData);
			return resultData;
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
	
}
exports.getFedoraObject = function getFedoraObject(objectPID){
	options.path = '/fedora/objects/dri:100/objectXML';
	
	http.get(options, function(res) {
		var resultData = "";
		res.on('data', function (xml) {
			resultData += xml;
		});
		res.on('end', function () {
			//console.log(resultData);
			return resultData;
		});
	}).on('error', function(e) {
		console.log("" + e);
	});	
}
exports.createFedoraObject = function createFedoraObject(namespace, callback){

	this.getNextPID(namespace, function(pid){
		//console.log(pid);
		callback(pid);
	});
}
function createObject(label, callback){
	options.method = 'POST';
	options.path = '/fedora/objects/new?namespace=node&label=test';
	http.request(options, function(res) {
	
		res.setEncoding('utf8');
		var resultData = "";
		res.on('data', function (xml) {
			resultData += xml;
		});
		res.on('end', function () {
			console.log("createObject: " + resultData);
		});
	}).on('error', function(e) {
		console.log("createObject: " + e);
	}).end();
}
exports.getNextPID = function getNextPID(namespace, callback){
	var numberPIDs = 1;
	options.method = 'POST';
	options.path = '/fedora/objects/nextPID?numPIDs='+numberPIDs+"&namespace="+namespace+"&format=xml";
	http.request(options, function(res) {
	
		res.setEncoding('utf8');
		var resultData = "";
		res.on('data', function (xml) {
			resultData += xml;
		});
		res.on('end', function () {
			//json = parser.toJson(resultData, {object: true});
			//console.log("End, PID: " + json.pidList.pid);
			callback(resultData);
		});
	}).on('error', function(e) {
		console.log("getNextPID: " + e);
	}).end();
}


















