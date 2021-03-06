/**
 * @author Quirijn Groot Bluemink
 */
var res;
var meta;
var http = require("http");
var mime = require("mime");
var winston = require("winston");


var _config
var options


// To hardcode the configuration use this snippet 
/*
options = {
	host : "localhost", // Don't add http://
	port : 9090,
	auth : "fedoraAdmin:admin"
};
*/

// Recieves a config varible that is used within the package
exports.configure = function configure(config) {
	_config = config
	 options = {
		host : config.fedoraURL,
		port : config.fedoraPort,
		auth : config.fedoraAuth
	};
	winston.log("info", "Fedora package configured")
}


function checkConfiguration(){
	if(options){
		return true
	}else{
		winston.log("error", "No configuration found")
		return false
	}
}


/*
 Function: getFedoraList

 Queries a FedoraCommons instance for a list of objects according to the search term

 Parameters:

 searchTerm - The term used to search with
 onSuccess - Callback function to be execute when successfull, contains xml file with the results
 onError - Callback function to be execute when unsuccessfull

 */
exports.getFedoraList = function getFedoraList(searchTerm, onSuccess, onError) {
	if(!checkConfiguration()){
		onError("Fedora is not configured");
	}
	searchTerm = (searchTerm == "") ? searchTerm = "*" : searchTerm;
	options.path = '/fedora/objects?terms=' + escape(searchTerm) + '&pid=true&subject=true&label=true&resultFormat=xml';

	http.get(options, function(res) {
		var resultData = "";
		res.on('data', function(xml) {
			resultData += xml;
		});
		res.on('end', function() {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		winston.log("error", e)
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
exports.getFedoraObject = function getFedoraObject(objectPID, onSuccess, onError) {
	if(!checkConfiguration()){
		onError("Fedora is not configured");
	}
	options.path = '/fedora/objects/' + objectPID + '/objectXML';

	http.get(options, function(res) {
		var resultData = "";
		res.on('data', function(xml) {
			resultData += xml;
		});
		res.on('end', function() {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		winston.log("error", e)
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
exports.createFedoraObject = function createFedoraObject(namespace, label, onSuccess, onError) {
	if(!checkConfiguration()){
		onError("Fedora is not configured");
	}
	options.method = 'POST';
	options.path = '/fedora/objects/new?namespace=' + namespace + '&label=' + escape(label);
	http.request(options, function(res) {

		res.setEncoding('utf8');
		var resultData = "";
		res.on('data', function(xml) {
			resultData += xml;
		});
		res.on('end', function() {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		winston.log("error", e)
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
exports.getNextPID = function getNextPID(namespace, onSuccess, onError) {
	if(!checkConfiguration()){
		onError("Fedora is not configured");
	}
	var numberPIDs = 1;
	options.method = 'POST';
	options.path = '/fedora/objects/nextPID?numPIDs=' + numberPIDs + "&namespace=" + namespace + "&format=xml";
	http.request(options, function(res) {

		res.setEncoding('utf8');
		var resultData = "";
		res.on('data', function(xml) {
			resultData += xml;
		});
		res.on('end', function() {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		winston.log("error", e)
		onError(e);
	}).end();
}


/*
 Function: addXMLDatastream

 Adds a datastream to the existing FedoraObject containing xml

 Parameters:

 pid - The pid of the FedoraObject
 dsId - The ID for the datastream
 data - The data to be stored in the datastream
 onSuccess - Callback function to be execute when successfull, contains XML data with the new PID
 onError - Callback function to be execute when unsuccessfull

 */
exports.addXMLDatastream = function addDatastream(pid, dsId, data, onSuccess, onError) {
	if(!checkConfiguration()){
		onError("Fedora is not configured");
	}
	options.method = 'POST';
	options.path = '/fedora/objects/' + pid + '/datastreams/' + dsId + '?mimeType=text/xml&controlGroup=X';
	var req = http.request(options, function(res) {

		res.setEncoding('utf8');
		var resultData = "";
		res.on('data', function(xml) {
			resultData += xml;
		});
		res.on('end', function() {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		winston.log("error", e)
		onError(e);
	})
	req.write(data + "\n")
	req.end();
}


/*
 Function: addMediaDatastream

 Adds a datastream to the existing FedoraObject containing media

 Parameters:

 pid - The pid of the FedoraObject
 dsId - The ID for the datastream
 data - The data to be stored in the datastream
 onSuccess - Callback function to be execute when successfull, contains XML data with the new PID
 onError - Callback function to be execute when unsuccessfull

 */
exports.addMediaDatastream = function addDatastream(pid, dsId, data, onSuccess, onError) {
	if(!checkConfiguration()){
		onError("Fedora is not configured");
	}
	var mediaLocation = _config.publicDirectory + data.fileLocation[0].fileLocation
	options.method = 'POST';
	options.path = '/fedora/objects/' + pid + '/datastreams/' + dsId + '?controlGroup=M&mimeType='+mime.lookup(mediaLocation)+'&dsLabel=Somemediafile&dsLocation='+mediaLocation;
	var req = http.request(options, function(res) {

		res.setEncoding('utf8');
		var resultData = "";
		res.on('data', function(xml) {
			resultData += xml;
		});
		res.on('end', function() {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		winston.log("error", e)
		onError(e);
	})
	req.end();
}



/*
 Function: modifyXMLDatastream

 Modifies a datastream to the existing FedoraObject containing xml

 Parameters:

 pid - The pid of the FedoraObject
 dsId - The ID for the datastream
 data - The data to be stored in the datastream
 onSuccess - Callback function to be execute when successfull, contains XML data with the new PID
 onError - Callback function to be execute when unsuccessfull

 */
exports.modifyXMLDatastream = function modifyDatastream(pid, dsId, data, onSuccess, onError) {
	if(!checkConfiguration()){
		onError("Fedora is not configured");
	}
	options.method = 'PUT';
	options.path = '/fedora/objects/' + pid + '/datastreams/' + dsId + '?mimeType=text/xml';
	var req = http.request(options, function(res) {

		res.setEncoding('utf8');
		var resultData = "";
		res.on('data', function(xml) {
			resultData += xml;
		});
		res.on('end', function() {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		winston.log("error", e)
		onError(e);
	})
	req.write(data + "\n")
	req.end();
}


/*
 Function: modifyMediaDatastream

 Modifies a datastream to the existing FedoraObject containing media

 Parameters:

 pid - The pid of the FedoraObject
 dsId - The ID for the datastream
 data - The data to be stored in the datastream
 onSuccess - Callback function to be execute when successfull, contains XML data with the new PID
 onError - Callback function to be execute when unsuccessfull

 */
exports.modifyMediaDatastream = function modifyDatastream(pid, dsId, data, onSuccess, onError) {
	if(!checkConfiguration()){
		onError("Fedora is not configured");
	}
	var mediaLocation = _config.publicDirectory + data.fileLocation
	options.method = 'PUT';
	options.path = '/fedora/objects/' + pid + '/datastreams/' + dsId + '?controlGroup=M&mimeType='+mime.lookup(mediaLocation)+'&dsLabel=Somemediafile&dsLocation='+mediaLocation;
	var req = http.request(options, function(res) {

		res.setEncoding('utf8');
		var resultData = "";
		res.on('data', function(xml) {
			resultData += xml;
		});
		res.on('end', function() {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		winston.log("error", e)
		onError(e);
	})
	req.end();
}


/*
 Function: deleteObject

 Queries a FedoraCommons instance to delete the object with the given PID

 Parameters:

 pid - The PID of the object that needs to be deleted
 onSuccess - Callback function to be execute when successfull, contains a date string
 onError - Callback function to be execute when unsuccessfull

 */
exports.deleteObject = function deleteObject(pid, onSuccess, onError) {
	if(!checkConfiguration()){
		onError("Fedora is not configured");
	}
	options.method = 'DELETE';
	options.path = '/fedora/objects/' + pid;
	http.request(options, function(res) {

		res.setEncoding('utf8');
		var resultData = "";
		res.on('data', function(xml) {
			resultData += xml;
		});
		res.on('end', function() {
			onSuccess(resultData);
		});
	}).on('error', function(e) {
		winston.log("error", e)
		onError(e);
	}).end();
}
