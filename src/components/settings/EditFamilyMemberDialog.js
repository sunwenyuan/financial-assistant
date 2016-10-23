import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class EditFamilyMemberDialog extends React.Component {
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.props.closeDialog}
      />,
      <FlatButton
        label="Submit"
        primary
        onTouchTap={e => this.props.submitFamilyMember(e, this.props.familyMember)}
      />
    ];

    return (
      <Dialog title="Family Member" actions={actions} modal open={this.props.isOpen}>
        <TextField hintText="Family Member Name" defaultValue={this.props.familyMember} />
      </Dialog>
    );
  }
}

EditFamilyMemberDialog.propTypes = {
  isOpen: React.PropTypes.bool.isRequired,
  closeDialog: React.PropTypes.func.isRequired,
  submitFamilyMember: React.PropTypes.func.isRequired,
  familyMember: React.PropTypes.string.isRequired
};

export default EditFamilyMemberDialog;
