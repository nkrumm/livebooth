var lwip = require('lwip')
var path = require('path')

var processPhoto = function(input_path, callback){
	var outpath = path.join("thumbs/", path.basename(input_path));

	lwip.open(input_path, function(err, image){
	    image.batch()
	    .scale(0.5)
	    .writeFile(outpath, function(err, image){
	    	callback(path.basename(outpath))
	    });
	});
	
}

module.exports = processPhoto