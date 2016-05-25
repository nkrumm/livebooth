/** @jsx React.DOM */
var React = require('react')
require("../main.css")
var Navigation = require('react-router').Navigation;

module.exports = React.createClass({
    displayName: 'PhotoThumbnail',
    mixins: [Navigation],
    handleClick: function(){
    	this.transitionTo('photo', {id: this.props.id});
    },
    render: function(){
        return (<div className="photodiv" onClick={this.handleClick}><img src={"/thumbnail/" + this.props.id} /></div>)
    }
})