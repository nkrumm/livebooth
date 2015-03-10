var React = require('react')
var Container = require("./components/container.jsx")
var Header = require("./components/header.jsx")

React.render(
		<div><Header /><Container /></div>,
        document.getElementById('app')
);