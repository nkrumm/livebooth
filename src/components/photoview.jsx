/** @jsx React.DOM */
var React = require('react')
require("../main.css")
var State = require('react-router').State;

module.exports = React.createClass({
    displayName: 'PhotoView',
    mixins: [State],
    render: function(){
  		return (

  		<div id="photodetail">
  			<div className="content"><img src={"/photo/" + this.getParams().id} width="100%"/></div>	
			<div className="button backward">Back</div>
			<div className="button forward">Forward</div>
  		</div>)
    },
})