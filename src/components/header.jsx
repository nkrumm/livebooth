/** @jsx React.DOM */
var React = require('react')
require("../main.css")
var State = require('react-router').State;
var Navigation = require('react-router').Navigation;


module.exports = React.createClass({
    displayName: 'Header',
    mixins: [State, Navigation],
    handleHome: function(){
    	this.transitionTo('index');
    },
    render: function(){
  		return (
  			<div id="header">
  				<div className="left-menu">
	  				<a onClick={this.handleHome}><i className="fa fa-home"></i></a>
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