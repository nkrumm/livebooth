
var React = require('react')
var actions = require("../appactions.js").AppActions

const Dialog = require('material-ui/lib/dialog');
const TextField = require('material-ui/lib/text-field');
const FlatButton = require('material-ui/lib/flat-button');
const Colors = require ('material-ui/lib/styles/colors');

function isValidPhone(p) {
  var phoneRe = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
  var digits = p.replace(/\D/g, "");
  return (digits.match(phoneRe) !== null);
}

function isValidEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

module.exports = React.createClass({
    displayName: 'PhotoView',
    show: function(){
        this.setState({
            error: false
        })
        this.refs.dialog.show();
    },
    handleCancel: function(){
        this.setState({
            error: false
        })
        this.refs.dialog.dismiss();
    },
    handleSend: function(){
        var somethingIsValid = false
        if (isValidPhone(this.refs.telephone.getValue())){
            actions.shareViaMMS(this.props.id, this.refs.telephone.getValue())
            somethingIsValid = true
        }
        if (isValidEmail(this.refs.email.getValue())){
            //actions.shareViaEmail(this.props.id, this.refs.email.getValue())
            somethingIsValid = true
        }
        if (!somethingIsValid){
            this.setState({
                error: true
            })
        } else {
            this.refs.dialog.dismiss();
        }
        
    },
    getInitialState: function(){
        return {
            error: false
        }
    },
    render: function(){
        if (this.state.error){
            var error_msg = (<p>Please enter a valid 10-digit phone number or email!</p>)
        } else {
            var error_msg = null
        }
        return (
        <Dialog ref="dialog" contentStyle={{width: "33%"}}
            title="Text/share this photo!"
            actionFocus="submit" width="40%"
            actions = {[
              <FlatButton
                label="Cancel"
                secondary={true}
                onClick={this.handleCancel}/>,
              <FlatButton
                label="Send!"
                style={{fontSize: "16pt"}}
                primary={true}
                onClick={this.handleSend} />
            ]}>
        <i className="fa fa-phone fa-2x" style={{paddingRight: 22, color: Colors.green500}}></i><TextField ref="telephone"
            floatingLabelText="Click to enter your phone number"
            style={{fontSize: "16pt", width: "80%"}}
            hintText="(555) 555-1234" type="tel" />
        <br />
        <i className="fa fa-envelope fa-lg" style={{paddingRight: 22, paddingLeft: 3, color: Colors.deepPurple500}}></i><TextField ref="email"
            floatingLabelText="Or here to email"
            style={{fontSize: "16pt", width: "80%"}}
            hintText="Email" />

        {error_msg}

        </Dialog>
    )
    }
});