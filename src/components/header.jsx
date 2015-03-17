/** @jsx React.DOM */
var React = require('react')
require("../main.css")


module.exports = React.createClass({
    displayName: 'Header',
    render: function(){
  		return (
  			<div id="header">
  				<div className="left-menu">
	  				<a href="/"><i className="fa fa-home"></i></a>
	  			</div>
	  			<div className="title">
	  				A+N's Photo Booth
	  			</div>
	  			<div className="right-menu">
	  				<i className="fa fa-question"></i>
	  			</div>
  			</div>)
    },
})