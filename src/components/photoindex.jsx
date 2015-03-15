/** @jsx React.DOM */
var React = require('react')
require("../main.css")
var Thumbnail = require("./thumbnail.jsx")

module.exports = React.createClass({
    displayName: 'PhotoIndex',
    render: function(){
    	var thumbs = this.state.photos.map(function(d, ix){
    		return <Thumbnail id={d.id} />
    	})
        return (<div id="photos">{thumbs}</div>)
    },
    componentDidMount: function(){
    	var socket = io();

		socket.on('new photo', function(msg){
			console.log(msg);
			var src = "/photos/" + msg;
			this.setState({
				photos: [{src: src}].concat(this.state.photos)
			})
		}.bind(this));

        $.get("/photos/recent").done(function(data){
            var photos = data.map(function(id, ix){return {id: id};})
            this.setState({
                photos: photos
            })
        }.bind(this));
    }, 
    getInitialState: function (){
    	return {
    		photos: []
    	}
    }
})