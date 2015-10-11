var express = require("express");
var app = express();
var flow = require("flow");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chokidar = require('chokidar');
var datastore = require('nedb')
var path = require('path')
var photos = require('./photos.js')

var args = require('commander')
			  .version('0.0.1')
			  .option('-d, --photo-dir [dir]', 'Directory of incoming photos to watch; default is ./', "./")
			  .parse(process.argv);

require("./routes.js")(app, args)
app.use(express.static("assets/"));

//init the storage backend for mapping paths --> photo ids
app.db = new datastore();

// set the currentId to 1 for now (TODO change this when we go to a persistent db)
var currentId = 1;
console.log("currentId is " + String(currentId))

var photoWorkflow = flow.define(
	function(in_path){
		this.in_path = in_path // save in_path for use in next function
		// create a thumbnail if needed and pass thumb_path to next function
		this.basename = path.basename(in_path)
		photos.processPhoto(in_path, this)
	},
	function(thumb_path){
		// look for records
		this.thumb_path = thumb_path
		app.db.find({basename: this.basename}, this)
	},
	function(err, records){
		if (records.length == 0){
			// no record exists
			var record = {id: currentId, thumb_path: this.thumb_path}
			console.log("new record " + this.basename + " ==> " + JSON.stringify(record))
			app.db.insert(record, this)
			//save currentId in this context
			this.currentId = currentId
			//increment currentId
			currentId += 1
		} else {
			console.log("existing record")
			this.currentId = record.currentId
			this.thumb_path = thumb_path
		}
	},
	function(){
		io.emit('new photo', this.currentId);
	}

)


var watcher = chokidar.watch(
	path.join(args.photoDir, "/*.JPG"), 
	{
		ignored: /[\/\\]\./,
		persistent: true,
		ignoreInitial: false
	}).on('add', photoWorkflow);



/* Server */

http.listen(3000, function(){
  console.log('listening on *:3000');
});
