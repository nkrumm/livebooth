/** @jsx React.DOM */
var React = require('react')
require("../main.css")

const Dialog = require('material-ui/lib/dialog');
const FlatButton = require('material-ui/lib/flat-button');

module.exports = React.createClass({
    displayName: 'HelpView',
    show: function(){
        this.refs.dialog.show();
    },
    handleClose: function(){
        this.refs.dialog.dismiss();
    },
    render: function(){
  		return (
        <div id="helpdialog">
  			<Dialog ref="dialog"
  				title="How to photo booth: It's easy!"
  				actionFocus="submit"
  				actions = {[
  					<FlatButton
  						label="Got it!"
  						primary={true}
              style={{fontSize: "16pt"}}
  						onClick={this.handleClose} />
  				]}>
  			<h3><span style={{fontSize: 40}}>👯</span> Grab some friends and props</h3>
        <h3><span style={{fontSize: 40}}>📷</span> Find the camera remote and snap away!</h3>
        <h3><span style={{fontSize: 40}}>🔥</span> Share photos by email or text with the <span className="fa-stack"><i className="fa fa-circle fa-stack-2x" style={{color: "#ff4081"}}></i><i className="fa fa-share fa-stack-1x fa-inverse"></i></span> button</h3>
        <hr />
        <h3 style={{color: "#AAA"}}>Is this broken? Let one of the groomsmen know 😨</h3>
  			</Dialog>
        </div>
  			)
    },

});