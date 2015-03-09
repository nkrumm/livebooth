/** @jsx React.DOM */
var React = require('react')
require("../main.css")
var Thumbnail = require("./thumbnail.jsx")

module.exports = React.createClass({
    displayName: 'PhotoContainer',
    render: function(){
    	var thumbs = this.state.photos.map(function(d, ix){
    		return <Thumbnail src={d.src} />
    	})
        return (<div id="photos">{thumbs}</div>)
    },
    componentDidMount: function(){
    	var socket = io();

		socket.on('new photo', function(msg){
			console.log(msg);
			var src = "/photos/" + msg;
			this.setState({
				photos: this.state.photos.concat([{src: src}])
			})
		}.bind(this));
    }, 
    getInitialState: function (){
    	return {
    		photos: []
    	}
    }
})