/** @jsx React.DOM */
var React = require('react')
require("../main.css")
var State = require('react-router').State;
var Navigation = require('react-router').Navigation;

module.exports = React.createClass({
    displayName: 'PhotoView',
    mixins: [State, Navigation],
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
        onSwipeEnd: this.handleSwipe,
        direction: "horizontal",
        afterInitialize: function(){$("li.dragend-page > img").show();}

      }
      this.dragend = $(this.refs.dragend.getDOMNode()).dragend(this.opts);
      this.setState({firstLoad: false})

    },
    getInitialState: function(){
      var id = parseInt(this.getParams().id);
      return {
        ids: [id - 1, id, id + 1],
        currentId: id,
        firstLoad: true
      }
    },
    componentDidUpdate: function(){
      this.dragend = $(this.refs.dragend.getDOMNode()).dragend(this.opts);
    }, 
    render: function(){
      console.log("render")
      console.log(this.state.ids)
      console.log("Current ID: " + this.state.currentId)
      if (this.state.firstLoad){
        var s = {"display": "none"}
      } else {
        var s = {};
      }
      var images = this.state.ids.map(function(d, ix){
        return <li key={d} className="dragend-page"><img src={"/photo/" + d} style={s} /></li>
      })
  		return (

  		<div id="photodetail">
  			<div className="content" ref="dragend">
          <ul style={{padding: 0}}>
            {images}
          </ul>
        </div>
  			
  		</div>)
    },
})
