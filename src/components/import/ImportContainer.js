import XLSX from 'xlsx';
import React from 'react';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

import formatRawData from '../../utils/formatRawData';

const tableHeaderMapping = {
  date: 'Date',
  receiver: 'Receiver',
  amount: 'Amount',
  type: 'Type',
  needAttention: 'Need Attention'
};

class ImportContainer extends React.Component {
  constructor() {
    super();
    this.handleBankSelectionChange = this.handleBankSelectionChange.bind(this);
    this.handleFileSelectionChange = this.handleFileSelectionChange.bind(this);
    this.renderTableRow = this.renderTableRow.bind(this);
    this.deleteRecordFromTransaction = this.deleteRecordFromTransaction.bind(this);
    this.state = {
      bank: 'okq8',
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
      const transactions = formatRawData(this.state.bank, XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]));
      console.log(transactions);
      this.setState({
        transactions
      });
    };
    reader.readAsBinaryString(file);
  }

  deleteRecordFromTransaction(e) {
    console.log(e);
    console.log(this.state.transactions);
  }

  renderTableRow(record, index) {
    console.log(record);
    return (
      <TableRow key={index}>
        <TableRowColumn>{record.date}</TableRowColumn>
        <TableRowColumn>{record.receiver}</TableRowColumn>
        <TableRowColumn>{record.amount.toString()}</TableRowColumn>
        <TableRowColumn>{record.type}</TableRowColumn>
        <TableRowColumn>{record.needAttention}</TableRowColumn>
        <TableRowColumn>
          <IconButton onTouchTap={e => this.deleteRecordFromTransaction(e)}>
            <DeleteIcon />
          </IconButton>
        </TableRowColumn>
      </TableRow>
    );
  }

  render() {
    return (
      <div className="import-container">
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
        <div className="import-table-container">
          <Table>
            <TableHeader displaySelectAll={false} enableSelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Date</TableHeaderColumn>
                <TableHeaderColumn>Receiver</TableHeaderColumn>
                <TableHeaderColumn>Amount</TableHeaderColumn>
                <TableHeaderColumn>Type</TableHeaderColumn>
                <TableHeaderColumn>Need Attention</TableHeaderColumn>
                <TableHeaderColumn>Operations</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {
                this.state.transactions
                  .map(this.renderTableRow)
              }
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default ImportContainer;
