/** @jsx React.DOM */
var React = require('react')
require("../main.css")
var State = require('react-router').State;
var Navigation = require('react-router').Navigation;

module.exports = React.createClass({
    displayName: 'PhotoView',
    mixins: [State, Navigation],
    handleForward: function(){
		this.transitionTo('photo', {id: parseInt(this.getParams().id) + 1});
    },
    handleBackward: function(){
		this.transitionTo('photo', {id: parseInt(this.getParams().id) - 1});
    },
    render: function(){
  		return (

  		<div id="photodetail">
  			<div className="content"><img src={"/photo/" + this.getParams().id} /></div>
  			<div className="footer">
				<div className="button backward" onClick={this.handleBackward}>Back</div>
				<div className="button forward" onClick={this.handleForward}>Forward</div>
			</div>
  		</div>)
    },
})