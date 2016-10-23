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


class FamilyMemberPanel extends React.Component {
  constructor() {
    super();
    this.handleEditFamilyMemberTextFieldChange = this.handleEditFamilyMemberTextFieldChange.bind(this);
    this.renderFamilyMemberRow = this.renderFamilyMemberRow.bind(this);
    this.deleteFamilyMember = this.deleteFamilyMember.bind(this);
    this.startCreateFamilyMember = this.startCreateFamilyMember.bind(this);
    this.startEditFamilyMember = this.startEditFamilyMember.bind(this);
    this.submitFamilyMember = this.submitFamilyMember.bind(this);
    this.closeEditFamilyMemberDialog = this.closeEditFamilyMemberDialog.bind(this);
    this.openEditFamilyMemberDialog = this.openEditFamilyMemberDialog.bind(this);
    this.state = {
      familyMembers: ['Wenyuan Sun', 'Ping Jia'],
      isEditFamilyMemberDialogOpen: false,
      familyMemberInEditing: '',
      newFamilyMember: ''
    };
  }

  startCreateFamilyMember() {
    this.setState({
      familyMemberInEditing: '',
      newFamilyMember: ''
    });
    this.openEditFamilyMemberDialog();
  }

  startEditFamilyMember(e, familyMember) {
    this.setState({
      familyMemberInEditing: familyMember,
      newFamilyMember: familyMember
    });
    this.openEditFamilyMemberDialog();
  }

  submitFamilyMember() {
    if (this.state.familyMemberInEditing !== this.state.newFamilyMember) {
      const familyMembers = this.state.familyMembers;
      if (this.state.familyMemberInEditing === '') {
        familyMembers.push(this.state.newFamilyMember);
        this.setState({
          familyMembers
        });
      } else {
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
        <TextField hintText="Family Member Name" defaultValue={this.state.familyMemberInEditing} onChange={this.handleEditFamilyMemberTextFieldChange} />
      </Dialog>
    );
  }

  render() {
    const createFamilyMemberBtn = <FlatButton label="Create Member" onTouchTap={this.startCreateFamilyMember} />;
    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            {createFamilyMemberBtn}
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

export default FamilyMemberPanel;
