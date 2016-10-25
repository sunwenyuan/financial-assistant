import _ from 'lodash';
import React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/border-color';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import base from '../../base';

const errorTexts = {
  NONE: '',
  IS_REQUIRED: 'Family member name is required!',
  ALREADY_EXISTS: 'Family member already exists!'
};

class FamilyMemberPanel extends React.Component {
  constructor() {
    super();

    // Bind this
    this.handleEditFamilyMemberTextFieldChange = this.handleEditFamilyMemberTextFieldChange.bind(this);
    this.renderFamilyMemberRow = this.renderFamilyMemberRow.bind(this);
    this.deleteFamilyMember = this.deleteFamilyMember.bind(this);
    this.startCreateFamilyMember = this.startCreateFamilyMember.bind(this);
    this.startEditFamilyMember = this.startEditFamilyMember.bind(this);
    this.submitFamilyMember = this.submitFamilyMember.bind(this);
    this.closeEditFamilyMemberDialog = this.closeEditFamilyMemberDialog.bind(this);
    this.openEditFamilyMemberDialog = this.openEditFamilyMemberDialog.bind(this);
    this.getFirebaseEndpoint = this.getFirebaseEndpoint.bind(this);

    // init state
    this.state = {
      familyMembers: [],
      isEditFamilyMemberDialogOpen: false,
      familyMemberInEditing: '',
      newFamilyMember: '',
      editFamilyMemberErrorText: errorTexts.NONE
    };
  }

  componentDidMount() {
    this.ref = base
      .syncState(this.getFirebaseEndpoint(), {
        context: this,
        state: 'familyMembers',
        asArray: true
      });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  getFirebaseEndpoint() {
    return `users/${this.props.uid}/members`;
  }

  startCreateFamilyMember() {
    this.setState({
      familyMemberInEditing: '',
      newFamilyMember: ''
    });

    // Set text field error text
    this.setState({
      editFamilyMemberErrorText: errorTexts.IS_REQUIRED
    });
    this.openEditFamilyMemberDialog();
  }

  startEditFamilyMember(e, familyMember) {
    this.setState({
      familyMemberInEditing: familyMember,
      newFamilyMember: familyMember
    });

    // Set text field error text
    this.setState({
      editFamilyMemberErrorText: errorTexts.ALREADY_EXISTS
    });
    this.openEditFamilyMemberDialog();
  }

  submitFamilyMember() {
    // check if family member value changed
    if (this.state.familyMemberInEditing !== this.state.newFamilyMember) {
      const familyMembers = [...this.state.familyMembers];

      if (this.state.familyMemberInEditing === '') {
        // if triggered by create family member, just push the new family member to state
        familyMembers.push(this.state.newFamilyMember);
        this.setState({
          familyMembers
        });
      } else {
        // triggered by edit family member, find index of existing family member and change it
        const index = _.findIndex(familyMembers, familyMember => familyMember === this.state.familyMemberInEditing);
        if (index > -1) {
          familyMembers[index] = this.state.newFamilyMember;
          this.setState({
            familyMembers
          });
        }
      }
    }
    this.closeEditFamilyMemberDialog();
  }

  deleteFamilyMember(e, familyMember) {
    const familyMembers = this.state.familyMembers;
    _.remove(familyMembers, item => item === familyMember);
    this.setState({
      familyMembers
    });
  }

  closeEditFamilyMemberDialog() {
    this.setState({
      isEditFamilyMemberDialogOpen: false
    });
  }

  openEditFamilyMemberDialog() {
    this.setState({
      isEditFamilyMemberDialogOpen: true
    });
  }

  handleEditFamilyMemberTextFieldChange(e) {
    this.setState({
      newFamilyMember: e.target.value
    });

    // update text field error text
    let errorText = errorTexts.NONE;
    if (e.target.value === '') {
      errorText = errorTexts.IS_REQUIRED;
    } else {
      const familyMembers = this.state.familyMembers;
      const index = _.findIndex(familyMembers, familyMember => familyMember === e.target.value);
      if (index > -1) {
        errorText = errorTexts.ALREADY_EXISTS;
      }
    }
    this.setState({
      editFamilyMemberErrorText: errorText
    });
  }

  renderFamilyMemberRow(familyMember) {
    return (
      <TableRow key={familyMember}>
        <TableRowColumn>
          {familyMember}
        </TableRowColumn>
        <TableRowColumn>
          <IconButton onTouchTap={e => this.startEditFamilyMember(e, familyMember)}>
            <EditIcon />
          </IconButton>
          <IconButton onTouchTap={e => this.deleteFamilyMember(e, familyMember)}>
            <DeleteIcon />
          </IconButton>
        </TableRowColumn>
      </TableRow>
    );
  }

  renderEditFamilyMemberDialog() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.closeEditFamilyMemberDialog}
      />,
      <FlatButton
        label="Submit"
        primary
        onTouchTap={this.submitFamilyMember}
      />
    ];

    return (
      <Dialog title="Family Member" actions={actions} modal open={this.state.isEditFamilyMemberDialogOpen}>
        <TextField
          hintText="Family Member Name"
          errorText={this.state.editFamilyMemberErrorText}
          defaultValue={this.state.familyMemberInEditing}
          onChange={this.handleEditFamilyMemberTextFieldChange}
        />
      </Dialog>
    );
  }

  render() {
    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            <FlatButton label="Create Member" onTouchTap={this.startCreateFamilyMember} />
          </ToolbarGroup>
        </Toolbar>
        <Table>
          <TableHeader displaySelectAll={false} enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Operations</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              this.state.familyMembers
                .map(this.renderFamilyMemberRow)
            }
          </TableBody>
        </Table>
        {
          this.renderEditFamilyMemberDialog()
        }
      </div>
    );
  }
}

FamilyMemberPanel.propTypes = {
  uid: React.PropTypes.string
};

export default FamilyMemberPanel;
