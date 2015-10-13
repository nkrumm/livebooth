var Reflux = require("reflux");

var AppActions = Reflux.createActions([
	"newPhoto",
	"shareViaMMS",
	"shareViaEmail"
])


module.exports.AppActions = AppActions;