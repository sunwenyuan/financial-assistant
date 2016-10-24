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

const errorTexts = {
  NONE: '',
  IS_REQUIRED: 'Category name is required!',
  ALREADY_EXISTS: 'Category already exists!'
};

class ExpenseCategoriesPanel extends React.Component {
  constructor() {
    super();

    this.renderCategoryRow = this.renderCategoryRow.bind(this);
    this.closeEditCategoryDialog = this.closeEditCategoryDialog.bind(this);
    this.submitCategory = this.submitCategory.bind(this);
    this.handleEditCategoryTextFieldChange = this.handleEditCategoryTextFieldChange.bind(this);
    this.renderEditCategoryDialog = this.renderEditCategoryDialog.bind(this);
    this.openEditCategoryDialog = this.openEditCategoryDialog.bind(this);
    this.startEditCategory = this.startEditCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.startCreateCategory = this.startCreateCategory.bind(this);

    this.state = {
      categories: [],
      isEditDialogOpen: false,
      categoryInEditing: '',
      newCategory: '',
      editCategoryErrorText: errorTexts.NONE
    };
  }

  closeEditCategoryDialog() {
    this.setState({
      isEditDialogOpen: false
    });
  }

  openEditCategoryDialog() {
    this.setState({
      isEditDialogOpen: true
    });
  }

  startEditCategory(e, category) {
    this.setState({
      categoryInEditing: category,
      newCategory: ''
    });

    // set text field error text
    this.setState({
      editCategoryErrorText: errorTexts.ALREADY_EXISTS
    });
    this.openEditCategoryDialog();
  }

  deleteCategory(e, category) {
    const categories = this.state.categories;
    _.remove(categories, item => item === category);
    this.setState({
      categories
    });
  }

  startCreateCategory() {
    this.setState({
      categoryInEditing: '',
      newCategory: ''
    });

    // set text field error text
    this.setState({
      editCategoryErrorText: errorTexts.IS_REQUIRED
    });
    this.openEditCategoryDialog();
  }

  submitCategory() {
    // check if category name changed
    if (this.state.categoryInEditing !== this.state.newCategory) {
      const categories = this.state.categories;
      if (this.state.categoryInEditing === '') {
        // triggered by create category, just push the new category to state
        categories.push(this.state.newCategory);
        this.setState({
          categories
        });
      } else {
        // triggered by edit category, find index of existing category and change it
        const index = _.findIndex(categories, category => category === this.state.categoryInEditing);
        if (index > -1) {
          categories[index] = this.state.newCategory;
          this.setState({
            categories
          });
        }
      }
    }
    this.closeEditCategoryDialog();
  }

  handleEditCategoryTextFieldChange(e) {
    this.setState({
      newCategory: e.target.value
    });

    // update text field error text
    let errorText = errorTexts.NONE;
    if (e.target.value === '') {
      errorText = errorTexts.IS_REQUIRED;
    } else {
      const categories = this.state.categories;
      const index = _.findIndex(categories, category => category === e.target.value);
      if (index > -1) {
        errorText = errorTexts.ALREADY_EXISTS;
      }
    }
    this.setState({
      editCategoryErrorText: errorText
    });
  }

  renderCategoryRow(category) {
    return (
      <TableRow key={category}>
        <TableRowColumn>
          {category}
        </TableRowColumn>
        <TableRowColumn>
          <IconButton onTouchTap={e => this.startEditCategory(e, category)}>
            <EditIcon />
          </IconButton>
          <IconButton onTouchTap={e => this.deleteCategory(e, category)}>
            <DeleteIcon />
          </IconButton>
        </TableRowColumn>
      </TableRow>
    );
  }

  renderEditCategoryDialog() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.closeEditCategoryDialog}
      />,
      <FlatButton
        label="Submit"
        primary
        onTouchTap={this.submitCategory}
      />
    ];

    return (
      <Dialog title="Category" actions={actions} modal open={this.state.isEditDialogOpen}>
        <TextField hintText="Category" defaultValue={this.state.categoryInEditing} onChange={this.handleEditCategoryTextFieldChange} />
      </Dialog>
    );
  }

  render() {
    const createCategoryBtn = <FlatButton label="Create Category" onTouchTap={this.startCreateCategory} />;
    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            {createCategoryBtn}
          </ToolbarGroup>
        </Toolbar>
        <Table>
          <TableHeader displaySelectAll={false} enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Category</TableHeaderColumn>
              <TableHeaderColumn>Operations</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              this.state.categories
                .map(this.renderCategoryRow)
            }
          </TableBody>
        </Table>
        {
          this.renderEditCategoryDialog()
        }
      </div>
    );
  }
}

export default ExpenseCategoriesPanel;
