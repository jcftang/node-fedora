/**
 * @author Quirijn Groot Bluemink
 */
var res;
var meta;
//var parser = require('xml2json');
var http = require("http");
var options = {
	//host: '134.226.114.78',
	host: 'howest-server.tchpc.tcd.ie',
	port: 9191,
	auth: 'fedoraAdmin:admin'
};

exports.getFedoraList = function getFedoraList(searchTerm, onSuccess, onError){
	searchTerm= (searchTerm == "") ? searchTerm = "*" : searchTerm;
	options.path = '/fedora/objects?terms='+escape(searchTerm)+'&pid=true&subject=true&label=true&resultFormat=xml';
	
	http.get(options, function(res) {
		var resultData = "";
		res.on('data', function (xml) {
			resultData += xml;
		});
		res.on('end', function () {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		onError(e);
	});
	
}
exports.getFedoraObject = function getFedoraObject(objectPID, onSuccess, onError){
	options.path = '/fedora/objects/'+objectPID+'/objectXML';
	
	http.get(options, function(res) {
		var resultData = "";
		res.on('data', function (xml) {
			resultData += xml;
		});
		res.on('end', function () {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		onError(e);
	});	
}
exports.createFedoraObject = function createFedoraObject(namespace, label, onSuccess, onError){

	createObject(namespace, label, onSuccess, onError);
}
function createObject(namespace, label, onSuccess, onError){
	options.method = 'POST';
	options.path = '/fedora/objects/new?namespace='+namespace+'&label=' +escape(label);
	http.request(options, function(res) {
	
		res.setEncoding('utf8');
		var resultData = "";
		res.on('data', function (xml) {
			resultData += xml;
		});
		res.on('end', function () {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		onError(e);
	}).end();
}
exports.getNextPID = function getNextPID(namespace, onSuccess, onError){
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
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		onError(e);
	}).end();
}
exports.deleteObject = function deleteObject(pid, onSuccess, onError){
	options.method = 'DELETE';
	options.path = '/fedora/objects/'+pid;
	http.request(options, function(res) {
	
		res.setEncoding('utf8');
		var resultData = "";
		res.on('data', function (xml) {
			resultData += xml;
		});
		res.on('end', function () {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		onError(e);
	}).end();
}
