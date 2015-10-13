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
        var id_ix = window.photo_ids.indexOf(this.state.currentId);
        var dir = index > this.state.ids.filter(function(x){return isNaN(x) == false}).indexOf(this.state.currentId) ? 1 : -1
        var new_id_ix = id_ix + dir;
        id = window.photo_ids[new_id_ix]
        if (id !== undefined){
          id = parseInt(id, 10)
          var ids = [window.photo_ids[new_id_ix-1], id, window.photo_ids[new_id_ix+1]]
          ids = ids.map(function(x){return parseInt(x, 10)});
          this.setState({
              ids: ids,
              currentId: id
          })
          this.replaceWith('photo', {"id": id});
        } 

    },
    componentDidMount: function(){

      this.opts = {
        jumpToPage: this.state.ids.indexOf(this.state.currentId) + 1,
        onSwipeEnd: this.handleSwipe,
        direction: "horizontal",
        afterInitialize: function(){$("li.dragend-page > img").show();}

      }
      this.dragend = $(this.refs.dragend.getDOMNode()).dragend(this.opts);
      this.setState({firstLoad: false})

    },
    getInitialState: function(){
      var id = parseInt(this.getParams().id)
      var id_ix = window.photo_ids.indexOf(id)
      var ids = [window.photo_ids[id_ix-1], id, window.photo_ids[id_ix+1]]
      ids = ids.map(function(x){return parseInt(x, 10)});
      return {
        ids: ids,
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
      var images = this.state.ids.filter(function(x){return isNaN(x)==false}).map(function(d, ix){
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
