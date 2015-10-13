/** @jsx React.DOM */
var React = require('react')
require("../main.css")
var Thumbnail = require("./thumbnail.jsx")

module.exports = React.createClass({
    displayName: 'PhotoIndex',
    render: function(){
        if (this.state.photos !== undefined){
            var thumbs = this.state.photos.map(function(d, ix){
                    return <Thumbnail id={d.id} />
                }.bind(this))
        } else {
            thumbs = null;
        }
        return (<div id="photos">{thumbs}</div>)
    },
    componentDidMount: function(){
    	var socket = io();

		socket.on('new photo', function(msg){
			console.log(msg);
			this.setState({
				photos: [{"id": msg}].concat(this.state.photos)
			})
            window.photo_ids = this.state.photos.map(function(d){return d.id});
		}.bind(this));

        $.get("/photos/recent").done(function(records){
            var photos = records.map(function(r, ix){return {id: r.id};})
            this.setState({
                photos: photos
            })
            window.photo_ids = this.state.photos.map(function(d){return d.id});
        }.bind(this));
    }, 
    getInitialState: function (){
    	return {
    		photos: []
    	}
    }
})