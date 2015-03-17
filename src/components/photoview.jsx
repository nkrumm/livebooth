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
    handleShare: function(){

    },
    render: function(){
  		return (

  		<div id="photodetail">
  			<div className="content"><img src={"/photo/" + this.getParams().id} /></div>
  			<div className="footer">
				<div className="button backward" onClick={this.handleBackward}>
					<i className="fa fa-angle-double-left fa-lg"></i> 
					</div>
				<div className="button share" onClick={this.handleShare}>
					<i className="fa fa-envelope-o fa-lg"></i>
				</div>
				<div className="button forward" onClick={this.handleForward}><i className="fa fa-angle-double-right fa-lg"></i></div>
			</div>
  		</div>)
    },
})