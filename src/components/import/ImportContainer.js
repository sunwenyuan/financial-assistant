import XLSX from 'xlsx';
import React from 'react';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import convertOkq8Data from '../../utils/convertOkq8Data';
import convertSebData from '../../utils/convertSebData';

class ImportContainer extends React.Component {
  constructor() {
    super();
    this.handleBankSelectionChange = this.handleBankSelectionChange.bind(this);
    this.handleFileSelectionChange = this.handleFileSelectionChange.bind(this);
    this.state = {
      bank: 'seb',
      transactions: []
    };
  }

  handleBankSelectionChange(e, index, value) {
    this.setState({
      bank: value
    });
  }

  handleFileSelectionChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (readerLoadEvent) => {
      const data = readerLoadEvent.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const bank = this.state.bank;
      // console.log(workbook);
      // console.log(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
      let transactions;
      switch (bank) {
        case 'okq8':
          transactions = convertOkq8Data(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
          break;
        case 'seb':
          transactions = convertSebData(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
          break;
        default:
          transactions = convertOkq8Data(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
          break;
      }
      console.log(transactions);
      this.setState({
        transactions
      });
    };
    reader.readAsBinaryString(file);
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
