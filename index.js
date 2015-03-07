var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chokidar = require('chokidar');
var path = require('path')
var processPhoto = require('./imagemanipulation.js')

var args = require('commander')
			  .version('0.0.1')
			  .option('-d, --photo-dir [dir]', 'Directory of incoming photos to watch; default is ./', "./")
			  .parse(process.argv);

console.log("Watching " + args.photoDir)


/* Routing */

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get(/photos\/IMG_[0-9]{4}.JPG$/, function(req, res) {
  // return the photo by ID here
  // this is the main way the app will receive photos live.
  res.sendFile(__dirname + "/thumbs/" + path.basename(req.url));
});

app.get('/photos/recent', function(req, res) {
  // return the last N photos here
  // this route is to be hit initially on client app connect to load latest photos.
  // probably needs an ?offset=<int> parameter so that infinite scroll can be handled
  res.json({})
});


io.on('connection', function(socket){
  console.log('Connected.');
});

/* Directory watch code */

var sendImageToClient = function(msg){
  io.emit('new photo', msg);
}

var watcher = chokidar.watch(path.join(args.photoDir, "/*.JPG"), {
  ignored: /[\/\\]\./, persistent: true, ignoreInitial: true
}).on('add', function(in_path) {
	console.log(in_path);
	var thumb_path = processPhoto(in_path, sendImageToClient);
	// Todo: add photo to database, and send ID via socket-io
  
});



/* Server */

http.listen(3000, function(){
  console.log('listening on *:3000');
});
