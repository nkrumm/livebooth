
var Reflux = require('reflux');
var AppActions = require('./appactions.js').AppActions;


var photoStore = Reflux.createStore({
  init: function() {
    this.listenTo(AppActions.shareViaMMS,this.sendMMS);

    this.photos = []

    // set up websocket to listen for new photos
    this.socket = io();
	this.socket.on('new photo', function(msg){
		console.log(msg);
		this.photos.unshift({"id": msg})
		this.trigger()
	}.bind(this));

	// get initial photoset
    $.get("/photos/recent").done(function(records){
        this.photos = records.map(function(r, ix){return {id: r.id};})
    	this.trigger();
    }.bind(this));

  },
  getAllPhotos: function(){
  	return this.photos
  },
  getNextPhoto: function(id){
  	// return next photo
  	if (this.photos.length > 0){
  		var ix = this.photos.map(function(d){return d.id}).indexOf(id)
  		return this.photos[ix + 1] || {id: null}
  	} else {
  		return {id: null}
  	}
  },
  getPrevPhoto: function(id){
  	// return previous photo
  	if (this.photos.length > 0){
  		var ix = this.photos.map(function(d){return d.id}).indexOf(id)
  		return this.photos[ix - 1] || {id: null}
  	} else {
  		return {id: null}
  	}
  },
  sendMMS: function(id, phonenumber){
  	//send a photo by MMS
  	// first ensure that it has been uploaded to S3
  	$.get("/photo/" + id + "/status").done(function(data){
  		if (data.s3path){
  			//photo is uploaded, share it!
  			$.ajax({
				type: 'POST',
				data: JSON.stringify({to: phonenumber}),
		        contentType: 'application/json',
	            url: '/photo/'+id+'/share'
            })
  		} else {
  			return false
  		}
  	})
  }
})


module.exports = photoStore
