/** @jsx React.DOM */
var React = require('react')
require("../main.css")
var State = require('react-router').State;

module.exports = React.createClass({
    displayName: 'PhotoView',
    mixins: [State],
    render: function(){
  		return (<div id="photodetail">
  			<div><img src={"/photo/" + this.getParams().id} /></div>
  		</div>)
    },
})