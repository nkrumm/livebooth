var lwip = require('lwip')
var path = require('path')
var fs = require('fs')

var processPhoto = function(input_path, callback){
	var thumb_path = path.join("thumbs/", path.basename(input_path));
	var full_path = path.join("full_size/", path.basename(input_path));
	if (fs.existsSync(thumb_path) && fs.existsSync(full_path)){
		callback(thumb_path, full_path)
	} else {
		// todo, use promises here
		lwip.open(input_path, function(err, image){
		    image.batch().scale(0.15)
		    .writeFile(thumb_path, function(err, image){
		    	console.log("done writing thumb")
		    	lwip.open(input_path, function(err, image){
				    image.batch().scale(0.40)
				    .writeFile(full_path, function(err, image){
				    	console.log("done writing full size image")
				    	callback(thumb_path, full_path)
				    })
				});
		    })
		});
	}
}

module.exports.processPhoto = processPhoto