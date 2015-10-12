var path = require('path')
var fs = require('fs');

var utils = require('./utils.js')

module.exports = function(app, args){
	/* Routing */

	app.get('/', function(req, res) {
	  res.sendFile(__dirname + '/index.html');
	});

	app.get('/photo/:id', function(req, res) {
	  // return the photo by ID here
	  // this is the main way the app will receive photos live.
	  console.log(req.params.id)
	  app.db.find({id : parseInt(req.params.id)}, function(err, records){
	  	if (records.length == 1){
	  		var filename = records[0].thumb_path
	  		res.sendFile(__dirname + "/" + filename);		
	  	} else {
	  		res.send("no such file")
	  	}
	  })
	  
	});

	app.get('/photos/recent', function(req, res) {
		app.db.find({})
			  .sort({timestamp: -1})
			  .exec(function (err, records){
			  	res.json(records)
			  })
	  // return the last N photos here
	  // this route is to be hit initially on client app connect to load latest photos.
	  // probably needs an ?offset=<int> parameter so that infinite scroll can be handled
	  // fs.readdir(args.photoDir, function(err, files){
	  // 	files = files.filter(function(f){return f.match(/[0-9]{4}/)})
	  // 	ids = files.reverse().slice(0,30).map(function(f, ix){return parseInt(f.match(/[0-9]{4}/))})
	  // 	res.json(ids);
	  // })

	});
}