
var Reflux = require('reflux');
var AppActions = require('./appactions.js').AppActions;

var injectTapEventPlugin = require("react-tap-event-plugin");

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

var photoStore = Reflux.createStore({
  init: function() {
    this.listenTo(AppActions.shareViaMMS,this.sendMMS);
    this.listenTo(AppActions.shareViaEmail,this.sendEmail);

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
				data: JSON.stringify({to: phonenumber, type: "mms"}),
		        contentType: 'application/json',
	            url: '/photo/'+id+'/share'
            })
  		} else {
  			return false
  		}
  	})
  },
  sendEmail: function(id, email){
	$.ajax({
		type: 'POST',
		data: JSON.stringify({to: email, type: "email"}),
        contentType: 'application/json',
        url: '/photo/'+id+'/share'
    })

  }
})


module.exports = photoStore
