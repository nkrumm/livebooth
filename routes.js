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
	  app.db.find({id : parseInt(req.params.id)}, function(err, records){
	  	if (records.length == 1){
	  		var filename = records[0].full_path
	  		res.sendFile(__dirname + "/" + filename);		
	  	} else {
	  		res.send("no such file")
	  	}
	  })
	  
	});

	app.get('/thumbnail/:id', function(req, res) {
	  // return the thumbnail by ID here
	  app.db.find({id : parseInt(req.params.id)}, function(err, records){
	  	if (records.length == 1){
	  		var filename = records[0].thumb_path
	  		res.sendFile(__dirname + "/" + filename);		
	  	} else {
	  		res.send("no such file")
	  	}
	  })
	  
	});

	app.get('/photo/:id/status', function(req, res) {
		app.db.find({id : parseInt(req.params.id)}, function(err, records){
	  	if (records.length == 1){
	  		res.json(records[0])
	  	} else {
	  		res.send("no such file")
	  	}
	  })	  	
	});

	app.post('/photo/:id/share', function(req, res){
		console.log(req.body)
		app.db.find({id : parseInt(req.params.id)}, function(err, records){
	  	if (records.length == 1){
	  		if (records[0].uploaded){
	  			rec = records[0]
	  			console.log(rec)
	  			if (req.body.type == "mms"){
	  				console.log("sending mms to " + req.body.to)
		  			app.twilio.messages.create({ 
						to: req.body.to, 
						from: app.twilio.my_number,
						mediaUrl: rec.s3path,  
					},
					function(err, message) { console.log(err || message); }
					);
					res.json({status: "ok"})
				} else if (req.body.type == "email"){
					console.log("sending email to " + req.body.to)
					app.email.send({
						from:    "April & Nik <aprilandnik@gmail.com>", 
					   	to:      req.body.to,
					   	subject: "Photobooth photo",
					   	text: "<3, April and Nik",
					   	attachment: [{path: rec.full_path, type: "image/jpeg", name: "photobooth.jpeg"}]
					},
					function(err, message) { console.log(err || message); }
					);
					res.json({status: "ok"})
				} else {
					res.send("Must specify a 'type' field in POST as either 'mms' or 'email'!")
				}
	  		} else {
	  			res.send("no such file or image is not yet uploaded")	
	  		}
	  	} else {
	  		res.send("no such file or image is not yet uploaded")
	  	}
	  	});
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