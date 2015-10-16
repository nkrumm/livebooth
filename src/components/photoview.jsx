/** @jsx React.DOM */
var React = require('react')
var Reflux = require('reflux')
require("../main.css")
var State = require('react-router').State;
var Navigation = require('react-router').Navigation;

var photoStore = require("../photoStore")
const FloatingButton = require('material-ui/lib/floating-action-button');
var ShareDialog = require("./sharedialog.jsx")

var notNull = function(x){
  return x !== null
}

module.exports = React.createClass({
    displayName: 'PhotoView',
    mixins: [State, Navigation, Reflux.ListenerMixin],
    handleShare: function(){
        this.refs.sharedialog.show()
    },
    handleSwipe: function(el, ev, index){
        var new_id = this.state.ids[index]
        var new_ids = this._getIds(new_id)
        var new_currentPage = new_ids.indexOf(new_id) + 1

        this.setState({
          ids: new_ids,
          currentId: new_id,
          currentPage: new_currentPage
        })
        this.replaceWith('photo', {"id": new_id});
    },
    componentDidMount: function(){
      this.listenTo(photoStore, this.onStatusChange);
      this.opts = {
        jumpToPage: this.state.currentPage,
        onSwipeEnd: this.handleSwipe,
        direction: "horizontal",
        afterInitialize: function(){$("li.dragend-page > img").show();}
      }
      this.dragend = $(this.refs.dragend.getDOMNode()).dragend(this.opts);
      this.setState({firstLoad: false})
    },
    _getIds: function(id){
      var prev_id = photoStore.getPrevPhoto(id).id
      var next_id = photoStore.getNextPhoto(id).id
      var ids = [prev_id, id, next_id].filter(notNull)
      return ids
    },
    onStatusChange: function(){
      var id = parseInt(this.getParams().id)
      var ids = this._getIds(id)
      var currentPage = ids.indexOf(this.state.currentId) + 1
      this.setState({
        ids: ids,
        currentId: id,
        currentPage: currentPage
      })
    },
    getInitialState: function(){
      var id = parseInt(this.getParams().id)
      var ids = this._getIds(id)
      var currentPage = ids.indexOf(id) + 1
      return {
        ids: ids,
        currentId: id,
        currentPage: currentPage,
        firstLoad: true,
        shareDialog: false
      }
    },
    componentDidUpdate: function(){
      this.opts = {
        jumpToPage: this.state.currentPage,
        onSwipeEnd: this.handleSwipe,
        direction: "horizontal",
        afterInitialize: function(){$("li.dragend-page > img").show();}
      }
      this.dragend = $(this.refs.dragend.getDOMNode()).dragend(this.opts);
    }, 
    render: function(){
      if (this.state.firstLoad){
        var s = {"display": "none"}
      } else {
        var s = {};
      }
      var images = this.state.ids.map(function(d, ix){return (
              <li key={d} className="dragend-page">
                <img src={"/photo/" + d} style={s} />
              </li>)
      })

  		return (
  		<div id="photodetail">
  			<div className="content" ref="dragend">
          <ul style={{padding: 0}}>
            {images}
          </ul>
        </div>
  			<FloatingButton style={{position: "absolute", bottom: 50, right: 75}} onClick={this.handleShare}>
          <i className="fa fa-lg fa-share"></i>
        </FloatingButton>
        <ShareDialog ref="sharedialog" id={this.state.currentId}/>
  		</div>)
    },
})
