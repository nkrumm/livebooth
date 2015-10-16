
var React = require('react')
var actions = require("../appactions.js").AppActions

const Dialog = require('material-ui/lib/dialog');
const TextField = require('material-ui/lib/text-field');
const FlatButton = require('material-ui/lib/flat-button');

module.exports = React.createClass({
    displayName: 'PhotoView',
    show: function(){
        this.refs.dialog.show();
    },
    handleCancel: function(){
        this.refs.dialog.dismiss();
    },
    handleSend: function(){
        this.refs.dialog.dismiss();
        actions.shareViaMMS(this.props.id, this.refs.telephone.getValue())
    },
    render: function(){
        return (
        <Dialog ref="dialog"
            title="Text/share this photo!"
            actionFocus="submit" width="40%"
            actions = {[
              <FlatButton
                label="Cancel"
                secondary={true}
                onClick={this.handleCancel}/>,
              <FlatButton
                label="Send it!"
                primary={true}
                onClick={this.handleSend} />
            ]}>
        <TextField ref="telephone"
            floatingLabelText="Click to enter your phone number" type="tel" />
        </Dialog>
    )
    }
});