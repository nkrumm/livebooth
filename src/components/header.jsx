/** @jsx React.DOM */
var React = require('react')
require("../main.css")
var State = require('react-router').State;
var Navigation = require('react-router').Navigation;

var HelpDialog = require("./helpdialog.jsx")

const FloatingButton = require('material-ui/lib/floating-action-button');

module.exports = React.createClass({
    displayName: 'Header',
    mixins: [State, Navigation],
    handleHome: function(){
    	this.transitionTo('index');
    },
    handleHelp: function(){
        this.refs.helpdialog.show()
    },
    render: function(){
  		return (
  			<div id="header">
  				<div className="left-menu">
	  				<FloatingButton
		                primary={true}
		                onClick={this.handleHome}><i className="fa fa-home fa-lg"></i></FloatingButton>
	  			</div>
	  			<div className="title">A&N's Photobooth
	  			</div>
	  			<div className="right-menu">
	  			<FloatingButton style={{position: "relative"}} onClick={this.handleHelp}>
                    <i className="fa fa-lg fa-question"></i>
          </FloatingButton>
          <HelpDialog ref="helpdialog"/>
	  			</div>
  			</div>)
    },
})