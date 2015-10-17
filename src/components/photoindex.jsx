/** @jsx React.DOM */
var React = require('react')
var Reflux = require('reflux')
require("../main.css")
var Thumbnail = require("./thumbnail.jsx")
var photoStore = require("../photoStore.js")

module.exports = React.createClass({
    displayName: 'PhotoIndex',
    mixins: [Reflux.ListenerMixin],
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
    	this.listenTo(photoStore, this.onStatusChange);
    }, 
    getInitialState: function (){
        console.log("GIS")
    	return {
    		photos: []
    	}
    },
    onStatusChange: function(){
        // handle update from store here
        this.setState({
            photos: photoStore.getAllPhotos()
        })
    },
    componentWillMount: function(){
        // handle update from store here
        this.setState({
            photos: photoStore.getAllPhotos()
        })
    }
})