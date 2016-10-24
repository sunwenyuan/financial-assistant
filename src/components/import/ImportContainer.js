import XLSX from 'xlsx';
import React from 'react';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

class ImportContainer extends React.Component {
  constructor() {
    super();
    this.handleBankSelectionChange = this.handleBankSelectionChange.bind(this);
    this.handleFileSelectionChange = this.handleFileSelectionChange.bind(this);
    this.state = {
      bank: 'seb'
    };
  }

  handleBankSelectionChange(e, index, value) {
    this.setState({
      bank: value
    });
  }

  handleFileSelectionChange(e) {
    const file = e.target.file;
    console.log(file);
  }

  render() {
    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text="Select Bank" />
            <SelectField
              hintText="Select Bank"
              value={this.state.bank}
              onChange={this.handleBankSelectionChange}
            >
              <MenuItem value="seb" primaryText="SEB" />
              <MenuItem value="remember" primaryText="Remember" />
              <MenuItem value="okq8" primaryText="OKQ8" />
            </SelectField>
            <TextField
              id="file-upload-field"
              type="file"
              onChange={this.handleFileSelectionChange}
            />
            <FlatButton label="Import" />
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}

export default ImportContainer;
