/** @jsx React.DOM */
var React = require('react')
var Reflux = require('reflux')
require("../main.css")
var State = require('react-router').State;
var Navigation = require('react-router').Navigation;

var photoStore = require("../photoStore.js")
var actions = require("../appactions.js").AppActions

var notNull = function(x){
  return x !== null
}

module.exports = React.createClass({
    displayName: 'PhotoShare',
    mixins: [State, Navigation, Reflux.ListenerMixin],
    handleShare: function(e){
      e.preventDefault()
      actions.shareViaMMS(this.state.id, this.refs.telephone.getDOMNode().value)
    },
    getInitialState: function(){
      return {
        id: parseInt(this.getParams().id)
      }
    },
    componentDidMount: function(){
      this.listenTo(photoStore, this.onStatusChange);
    },
    
    onStatusChange: function(){

    },
    render: function(){
  		return (<div id="photoshare">
  			<img src={'/photo/' + this.state.id} width="50%"/>
        <br />
        <form>
          <input ref="telephone" name="telephone" type="tel" />
          <input type="submit" value="text me!" onClick={this.handleShare} />
        </form>
  		</div>)
    },
})
