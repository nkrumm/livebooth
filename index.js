var express = require("express");
var app = express();
var flow = require("flow");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var chokidar = require('chokidar');
var datastore = require('nedb')
var aws = require('aws-sdk')
var path = require('path')
var photos = require('./photos.js')

var args = require('commander')
			  .version('0.0.1')
			  .option('-d, --photo-dir [dir]', 'Directory of incoming photos to watch; default is ./', "./")
			  .parse(process.argv);

require("./routes.js")(app, args)
app.use(express.static("assets/"));

//setup AWS
aws.config.region = 'us-east-1';
var s3bucket = new aws.S3({params: {Bucket: 'wedding-photostore'}});

//init the storage backend for mapping paths --> photo ids
app.db = new datastore();

// set the currentId to 1 for now (TODO change this when we go to a persistent db)
var currentId = 1;
console.log("currentId is " + String(currentId))

var photoWorkflow = flow.define(
	function(in_path){
		this.in_path = in_path // save in_path for use in next function
		this.basename = path.basename(in_path)
		fs.stat(this.in_path, this)
	},
	function(err, stats){
		// save timestamp
		this.timestamp = stats.ctime.getTime();
		// create a thumbnail if needed and pass thumb_path to next function
		photos.processPhoto(this.in_path, this)
	},
	function(thumb_path){
		// look for records
		this.thumb_path = thumb_path
		app.db.find({basename: this.basename}, this)
	},
	function(err, records){
		if (records.length == 0){
			// no record exists
			var record = {
				id: currentId,
				thumb_path: this.thumb_path,
				timestamp: this.timestamp
			}
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
		this() // go to next step
	},
	function(){
		// upload to AWS s3 bucket if necessary
		
		var fileBuffer = fs.readFileSync(this.thumb_path);
		var params = {
			Key: this.basename,
			Body: fileBuffer,
			ACL: 'public-read'};

		s3bucket.headObject({Key: this.basename}, function (err, metadata) {  
			if (err) {  
				// Not uploaded yet
				console.log("Uploading " + this.basename)
				s3bucket.upload(params, function(err, data) {
					if (err) {
					  console.log("Error uploading data: ", err);
					  app.db.update({id: this.currentId}, {$set: {uploaded: false}}, {upsert: true})
					} else {
					  s3path = "https://s3.amazonaws.com/wedding-photostore/" + encodeURIComponent(this.basename)
					  console.log("Successfully uploaded " + this.basename);
					  app.db.update({id: this.currentId}, {$set: {uploaded: true, s3path: s3path}}, {upsert: true})
					}
				}.bind(this));
			} else {  
				//console.log("already uploaded!")
				s3path = "https://s3.amazonaws.com/wedding-photostore/" + encodeURIComponent(this.basename)
				app.db.update({id: this.currentId}, {$set: {uploaded: true, s3path: s3path}}, {upsert: true})
			}
		}.bind(this));
		
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
