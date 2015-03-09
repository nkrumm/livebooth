var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chokidar = require('chokidar');
var path = require('path')
var photos = require('./photos.js')

var args = require('commander')
			  .version('0.0.1')
			  .option('-d, --photo-dir [dir]', 'Directory of incoming photos to watch; default is ./', "./")
			  .parse(process.argv);

require("./routes.js")(app, args)
app.use(express.static("assets/"));

io.on('connection', function(socket){
  console.log('Connected.');
});

var sendImageToClient = function(msg){
  io.emit('new photo', msg);
}

var watcher = chokidar.watch(path.join(args.photoDir, "/*.JPG"), {
  ignored: /[\/\\]\./, persistent: true, ignoreInitial: true
}).on('add', function(in_path) {
	console.log(in_path);
	var thumb_path = photos.processPhoto(sendImageToClient, in_path);
	// Todo: add photo to database, and send ID via socket-io
  
});



/* Server */

http.listen(3000, function(){
  console.log('listening on *:3000');
});
