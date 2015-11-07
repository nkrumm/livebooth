/** @jsx React.DOM */
var React = require('react')
var PhotoIndex = require("./components/photoindex.jsx")
var Header = require("./components/header.jsx")
var HelpView = require("./components/helpview.jsx")
var PhotoView = require("./components/photoview.jsx")

var Router = require('react-router'); // or var Router = ReactRouter; in browsers
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Navigation = require('react-router').Navigation;

var HOME_SCREEN_TIMEOUT = 180 // seconds, set to null if no timeout
var home_screen_timout_id;

var App = React.createClass({
  mixins: [Navigation],
	render: function () {
    	return (
    		<div>
    			<Header />
    			<RouteHandler />
    		</div>
    	)
	},
  getInitialState() {
    return {
      home_screen_timout_id: 0
    }
  },
  componentDidUpdate: function () {
    if (HOME_SCREEN_TIMEOUT != null){
      window.clearTimeout(home_screen_timout_id)
      home_screen_timout_id = setTimeout(function() {this.replaceWith('index')}.bind(this), HOME_SCREEN_TIMEOUT * 1000)
    }
  }
})


var routes = (
  <Route name='app' handler={App} path="/">
    <DefaultRoute name="index" handler={PhotoIndex} />    
    <Route name="photo" path="/photo/:id" handler={PhotoView} />
    <Route name="help" handler={HelpView} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});