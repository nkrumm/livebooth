var lwip = require('lwip')
var path = require('path')
var fs = require('fs')

var processPhoto = function(callback, input_path){
	var outpath = path.join("thumbs/", path.basename(input_path));
	if (!fs.existsSync(outpath)){
		lwip.open(input_path, function(err, image){
		    image.batch()
		    .scale(0.5)
		    .writeFile(outpath, function(err, image){
		    	callback(path.basename(outpath))
		    });
		});
	} else {
		callback(path.basename(outpath))
	}
}

module.exports.processPhoto = processPhoto