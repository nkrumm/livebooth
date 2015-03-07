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
})

io.on('connection', function(socket){
  console.log('Connected.');
});

/* Directory watch code */

var watcher = chokidar.watch(path.join(args.photoDir, "/*.JPG"), {
  ignored: /[\/\\]\./, persistent: true
}).on('add', function(path) {
	console.log(path)
    io.emit('new photo', path);
});



/* Server */

http.listen(3000, function(){
  console.log('listening on *:3000');
});
