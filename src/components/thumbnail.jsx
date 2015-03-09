/** @jsx React.DOM */
var React = require('react')
require("../main.css")

module.exports = React.createClass({
    displayName: 'PhotoThumbnail',
    render: function(){
        return (<div className="photodiv"><img src={this.props.src} /></div>)
    }
})