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
    handleSwipe: function(el, ev, index){
        console.log("handleSwipe index is: " + index)
        var dir = index == 2 ? 1 : -1
        var newId = this.state.currentId + dir;
        this.setState({
            ids: this.state.ids.map(function(id){return id + dir;}),
            currentId: newId
        })
        this.replaceWith('photo', {id: newId});
    },
    componentDidMount: function(){
      this.opts = {
        jumpToPage: 2,
        onSwipeEnd: this.handleSwipe.bind(this),
      }
      this.dragend = $(this.refs.dragend.getDOMNode()).dragend(this.opts);
    },
    getInitialState: function(){
      var id = parseInt(this.getParams().id);
      return {
        ids: [id - 1, id, id + 1],
        currentId: id
      }
    },
    componentDidUpdate: function(){
      this.dragend = $(this.refs.dragend.getDOMNode()).dragend(this.opts);
    }, 
    render: function(){
      console.log("render")
      console.log(this.state.ids)
      var images = this.state.ids.map(function(d, ix){
        return <li key={d} className="dragend-page"><img src={"/photo/" + d} /></li>
      })
  		return (

  		<div id="photodetail">
  			<div className="content" ref="dragend">
          <ul style={{padding: 0}}>
            {images}
          </ul>
        </div>
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