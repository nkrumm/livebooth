/** @jsx React.DOM */
var React = require('react')
var PhotoIndex = require("./components/photoindex.jsx")
var Header = require("./components/header.jsx")
var HelpView = require("./components/helpview.jsx")
var PhotoView = require("./components/photoview.jsx")
var PhotoShare = require("./components/photoshare.jsx")

var Router = require('react-router'); // or var Router = ReactRouter; in browsers
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
	render: function () {
    	return (
    		<div>
    			<Header />
    			<RouteHandler />
    		</div>
    	)
	}
})


var routes = (
  <Route name='app' handler={App} path="/">
    <DefaultRoute name="index" handler={PhotoIndex} />    
    <Route name="photo" path="/photo/:id" handler={PhotoView} />
    <Route name="share" path="/share/:id" handler={PhotoShare} />
    <Route name="help" handler={HelpView} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});