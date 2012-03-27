/**
 * @author mvanwamb
 * @author Quirijn Groot Bluemink
 */
var res;
var meta;
var Mongolian = require("mongolian");
var ObjectId =  require('mongolian').ObjectId   // new ObjectId(byteBuffer or hexString)
var helper = require('./helpers');
var fs = require('fs');
var image;


exports.updateItem = function(data,vw){
	res = vw;
	meta = data.body;
	var files = data.files;

	//console.log(items);
	helper.update(meta,files);
	//gridfs();
}


/*
   Function: loadImg

   Searches for an images and displays it.

   Parameters:

      id - the id of the file
      name - the filenameshutdownServer
      res - the view object (res)

*/
exports.loadImg = function loadImg(id,name,res){
	//setup connection with mongodb
	var server = new Mongolian
	db = server.db("mydb");
	items = db.collection("items")
	//get gridfs object
	var gridfs = db.gridfs()// name defaults to 'fs'
	//search for a file with a certain name and an id
	//new ObjectId coverts the String version of the id into a byte one
	gridfs.findOne({filename:name,_id:new ObjectId(id)}, function(err, file) {
			//sends back the image to the view
			if (!err && file) {
				res.writeHead(200, {'Content-Type': 'image/jpeg'});
                var stream = file.readStream();
                //incase the file couldn't be loaded it logs an error
                stream.on("error", function(err){
                    console.log(err); 
                    
                }).pipe(res);
            }
            //runs if there is an error with finding the file
            else
            {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('404 Not Found\n');
                res.end();
            }
		})
}


/*
   Function: findImages

   Searches for all files linked to a metadata object

   Parameters:

      req - request objectshutdownServer
      res - result object

   Returns:

      array of the corresponding files.
*/
exports.findImages = function findImages(req,res){
	//setting up connection with the server
	var server = new Mongolian;
	db = server.db("mydb");
	items = db.collection("items");
	var gridfs = db.gridfs()
	var files = new Array();
	//search for a file with the id that is provided in the request (in url)
	gridfs.find({metadata:{id:req.params.id}}).forEach(function(file) {
		//converting the id from bytes to a string id
		file._id = file._id.toString();
		files.push(file);
	}, function() {
		//send back the files to the client
		res.send(files);
	});

}


//gets all the files related to an item
exports.getAll = function getAlItems(res){
	//setup a connection
	var server = new Mongolian
	db = server.db("mydb");
	items = db.collection("items")
	
	var gridfs = db.gridfs()// 
	var arr = new Array();
	gridfs.find().forEach(function(file) {
		// do something with a single post
		arr.push(file);
	}, function() {
		res.render('all', {
				items:arr, id:"all", title:"All"
			})
	})


}


exports.edit = function edit(req,res){

		var array = new Array();
		
		helper.getSeries(function(data){
			var array = new Array();
			array = data;
			res.render('edit', {
				title : "Edit",id:"edit",series:array
			})
		});	

}


/*
   Function: getAllSeries

   Sends back all series to the request

   Parameters:

      req - request object
      res - result object
*/
exports.getAllSeries = function getAllSeries(req, res) {

		var array = new Array();
		helper.getSeries(function(data){
		res.send(data);
		});
}


/*
   Function: getItems

   Searches for all files linked to a metadata object

   Parameters:

      req - request object
      res - result object

   Returns:

      array of the corresponding files.
*/
exports.getItems = function getItems(id,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")
			
	items.find({parentId:id}).sort({ created: 1 }).toArray(function (err, array) {
	for(item in array){
			array[item]._id = array[item]._id.toString();
		}
		res.send(array);
	})
}


exports.getItem = function(id,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series")
			
	items.findOne({_id:new ObjectId(id)},function (err, array) {
			array._id = array._id.toString();
		res.send(array);
	})
}


exports.createSeries = function(req,res){

	var items = helper.getDatabaseCollection("series");
	var rootItem = {}
	var files = req.body;
	
	rootItem.type = "serie"
	for(var i in files) {
			rootItem[i] = files[i];
	}
	items.insert(rootItem, function(err, value) {
		if(err) {
			console.log(err);
			
			return -1
		} else {
				res.redirect('/create');
			return 0
		}

	});
	


}

exports.createCollection = function(req,res){

	var items = helper.getDatabaseCollection("series");
	var rootItem = {}
	var files = req.body;
	
	rootItem.type = "collection"
	for(var i in files) {
			rootItem[i] = files[i];
	}
	items.insert(rootItem, function(err, value) {
		if(err) {
			console.log(err);
			
			return -1;
		} else {
			res.redirect('/create');
			return 0;
		}

	});
	

}
exports.createitem = function(req,res){
	console.log("item");
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections

	var item = {};
	var items = db.collection("series")
	var files = req.body;
	for(var i in files) {
		if(i != 'amount' && i!= "series") {
			item[i] = files[i];
		}

	}
	item.parentId = files.series;
	item.type = "item";
	for(var i = 0; i < req.body.amount; i++) {
		item._id = new ObjectId();
		item.objectId = i + 1;
		items.insert(item, function(err, value) {
			if(err) {
				console.log(err);
			}else{
				res.render('_includes/complete', {
				title : "Complete",
				id : "complete",
				item : "Everything"
			})
			}
		});
	}	
}


exports.removeItem = function(req,res){
	var server = new Mongolian
	// Get database
	db = server.db("mydb");
	// Get collections
	items = db.collection("series");
	items.remove({_id:new ObjectId(req.params.id)},function(err,value){
		if(err){
			console.log(err);
		}
	
	})
		items.remove({parentId:req.params.id},function(err,value){
		if(err){
			console.log(err);
		}

	})

	res.send("0");
}
