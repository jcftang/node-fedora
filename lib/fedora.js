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
/*
	Function: getFedoraList

	Queries a FedoraCommons instance for a list of objects according to the search term

	Parameters:

		searchTerm - The term used to search with
		onSuccess - Callback function to be execute when successfull, contains xml file with the results
		onError - Callback function to be execute when unsuccessfull

*/
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
/*
	Function: getFedoraObject

	Queries a FedoraCommons instance for the object with the given PID

	Parameters:

		objectPID - The PID of the requested object
		onSuccess - Callback function to be execute when successfull, contains the FOXML data
		onError - Callback function to be execute when unsuccessfull

*/
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
/*
	Function: createFedoraObject

	Queries a FedoraCommons instance to create a new object in the given namespace and with the given label

	Parameters:

		namespace - The namespace in which the new PID will be generated
		label - The label for the new object
		onSuccess - Callback function to be execute when successfull, contains the PID of the new object
		onError - Callback function to be execute when unsuccessfull

*/
exports.createFedoraObject = function createFedoraObject(namespace, label, onSuccess, onError){
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
/*
	Function: getNextPID

	Queries a FedoraCommons instance for the next available PID in the given namespace

	Parameters:

		namespace - The namespace in which the new PID will be generated
		onSuccess - Callback function to be execute when successfull, contains XML data with the new PID
		onError - Callback function to be execute when unsuccessfull

*/
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
/*
	Function: deleteObject

	Queries a FedoraCommons instance to delete the object with the given PID

	Parameters:

		pid - The PID of the object that needs to be deleted
		onSuccess - Callback function to be execute when successfull, contains a date string
		onError - Callback function to be execute when unsuccessfull

*/
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
