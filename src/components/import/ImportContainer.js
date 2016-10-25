import XLSX from 'xlsx';
import React from 'react';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';

import formatRawData from '../../utils/formatRawData';
import base from '../../base';

const tableHeaderMapping = [
  ['date', 'Date'],
  ['receiver', 'Receiver'],
  ['amount', 'Amount'],
  ['type', 'Type'],
  ['category', 'Category'],
  ['payfor', 'Pay For'],
  ['isInvestment', 'Is Investment'],
  ['operations', 'Operations']
];

class ImportContainer extends React.Component {
  constructor() {
    super();
    this.handleBankSelectionChange = this.handleBankSelectionChange.bind(this);
    this.handleFileSelectionChange = this.handleFileSelectionChange.bind(this);
    this.renderTableRow = this.renderTableRow.bind(this);
    this.deleteRecordFromTransaction = this.deleteRecordFromTransaction.bind(this);
    this.getFirebaseCategoryEndpoint = this.getFirebaseCategoryEndpoint.bind(this);
    this.getFirebaseMemberEndpoint = this.getFirebaseMemberEndpoint.bind(this);

    this.state = {
      bank: 'okq8',
      familyMembers: [],
      categories: [],
      transactions: []
    };
  }

  componentDidMount() {
    this.membersRef = base
      .bindToState(this.getFirebaseMemberEndpoint(), {
        context: this,
        state: 'familyMembers',
        asArray: true
      });

    this.categoriesRef = base
      .bindToState(this.getFirebaseCategoryEndpoint(), {
        context: this,
        state: 'categories',
        asArray: true
      });
  }

  componentWillUnmount() {
    base.removeBinding(this.membersRef);
    base.removeBinding(this.categoriesRef);
  }

  getFirebaseMemberEndpoint() {
    return `users/${this.props.uid}/members`;
  }

  getFirebaseCategoryEndpoint() {
    return `users/${this.props.uid}/categories`;
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
    const rowStyle = {};
    const rowDisabled = record.type === 'in';
    if (record.needAttention === true) {
      rowStyle.backgroundColor = '#F44336';
    }
    return (
      <TableRow style={rowStyle} key={index}>
        {
          tableHeaderMapping
            .map((header) => {
              const [headerName] = [...header];
              const columnKey = `row_${index}_${headerName}`;
              if (headerName === 'operations') {
                return (
                  <TableRowColumn key={columnKey}>
                    <IconButton onTouchTap={e => this.deleteRecordFromTransaction(e)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableRowColumn>
                );
              } else if (headerName === 'category') {
                return (
                  <TableRowColumn key={columnKey}>
                    <SelectField
                      hintText="Select Category"
                      value={record.category}
                      disabled={rowDisabled}
                      onChange={this.handleTransactionCategoryChange}
                    >
                      {
                        this.state.categories
                          .map(category => (<MenuItem key={category} value={category} primaryText={category} />))
                      }
                    </SelectField>
                  </TableRowColumn>
                );
              } else if (headerName === 'amount') {
                return (
                  <TableRowColumn key={columnKey}>
                    {record[headerName].toString()}
                  </TableRowColumn>
                );
              } else if (headerName === 'isInvestment') {
                return (
                  <TableRowColumn key={columnKey}>
                    <Checkbox
                      checked={record[headerName]}
                      disabled={rowDisabled}
                    />
                  </TableRowColumn>
                );
              } else if (headerName === 'payfor') {
                return (
                  <TableRowColumn key={columnKey}>
                    <SelectField
                      hintText="Select Member"
                      value={record[headerName]}
                      disabled={rowDisabled}
                      onChange={this.handlePayforChange}
                    >
                      {
                        this.state.familyMembers
                          .map(familyMember => (<MenuItem key={familyMember} value={familyMember} primaryText={familyMember} />))
                      }
                    </SelectField>
                  </TableRowColumn>
                );
              }
              return (
                <TableRowColumn key={columnKey}>
                  {record[headerName]}
                </TableRowColumn>
              );
            })
        }
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
                {
                  tableHeaderMapping
                    .map((header, index) => <TableHeaderColumn key={index}>{header[1]}</TableHeaderColumn>)
                }
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

ImportContainer.propTypes = {
  uid: React.PropTypes.string
};

export default ImportContainer;
