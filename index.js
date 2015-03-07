var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chokidar = require('chokidar');
var path = require('path')

var args = require('commander')
			  .version('0.0.1')
			  .option('-d, --photo-dir [dir]', 'Directory of incoming photos to watch; default is ./', "./")
			  .parse(process.argv);

console.log("Watching " + args.photoDir)


/* Routing */

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get(/photos\/[0-9]{1,}$/, function(req, res) {
  // return the photo by ID here
  // this is the main way the app will receive photos live.
  res.send(req.url)
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

var watcher = chokidar.watch(path.join(args.photoDir, "/*.JPG"), {
  ignored: /[\/\\]\./, persistent: true
}).on('add', function(path) {
	console.log(path)
	// Todo: process photo (resize)
	// Todo: add photo to database, and send ID via socket-io
    io.emit('new photo', path);
});



/* Server */

http.listen(3000, function(){
  console.log('listening on *:3000');
});
