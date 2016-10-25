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
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import Dialog from 'material-ui/Dialog';

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
  ['note', 'Note'],
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
    this.handleTransactionCategoryChange = this.handleTransactionCategoryChange.bind(this);
    this.handlePayforChange = this.handlePayforChange.bind(this);
    this.handleIsInvestmentChange = this.handleIsInvestmentChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.openNoteDialog = this.openNoteDialog.bind(this);
    this.closeNoteDialog = this.closeNoteDialog.bind(this);
    this.submitNote = this.submitNote.bind(this);

    this.note = '';
    this.rowNumber = null;

    this.state = {
      bank: 'okq8',
      familyMembers: [],
      categories: [],
      transactions: [],
      isNoteDialogOpen: false
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

  openNoteDialog(columnKey) {
    const rowNumber = columnKey.split('_')[1];
    const record = this.state.transactions[rowNumber];
    this.note = record.note;
    this.rowNumber = rowNumber;
    this.setState({
      isNoteDialogOpen: true
    });
  }

  closeNoteDialog() {
    this.setState({
      isNoteDialogOpen: false
    });
  }

  submitNote() {
    const rowNumber = this.rowNumber;
    const transactions = [...this.state.transactions];
    transactions[rowNumber].note = this.note;
    this.rowNumber = null;
    this.note = '';
    this.setState({
      transactions
    });
    this.closeNoteDialog();
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
      // console.log(transactions);
      this.setState({
        transactions
      });
    };
    reader.readAsBinaryString(file);
  }

  deleteRecordFromTransaction(columnKey) {
    const rowNumber = columnKey.split('_')[1];
    const transactions = [...this.state.transactions];
    const newTransactions = [...transactions.slice(0, rowNumber), ...transactions.slice(rowNumber + 1)];
    this.setState({
      transactions: newTransactions
    });
  }

  handleTransactionCategoryChange(columnKey, payload) {
    const rowNumber = columnKey.split('_')[1];
    const transactions = [...this.state.transactions];
    transactions[rowNumber].category = payload;
    this.setState({
      transactions
    });
  }

  handlePayforChange(columnKey, payload) {
    const rowNumber = columnKey.split('_')[1];
    const transactions = [...this.state.transactions];
    transactions[rowNumber].payfor = payload;
    this.setState({
      transactions
    });
  }

  handleIsInvestmentChange(columnKey, payload) {
    const rowNumber = columnKey.split('_')[1];
    const transactions = [...this.state.transactions];
    transactions[rowNumber].isInvestment = payload;
    this.setState({
      transactions
    });
  }

  handleNoteChange(e) {
    this.note = e.target.value;
  }

  renderNodeDialog() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.closeNoteDialog}
      />,
      <FlatButton
        label="submit"
        primary
        onTouchTap={this.submitNote}
      />
    ];
    return (
      <Dialog title="Note" actions={actions} modal open={this.state.isNoteDialogOpen}>
        <TextField
          hintText="Note"
          defaultValue={this.note}
          onChange={this.handleNoteChange}
        />
      </Dialog>
    );
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
                    <IconButton
                      onTouchTap={() => {
                        this.deleteRecordFromTransaction(columnKey);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onTouchTap={() => {
                        this.openNoteDialog(columnKey);
                      }}
                    >
                      <EditIcon />
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
                      onChange={(e, selectedNumber, payload) => {
                        this.handleTransactionCategoryChange(columnKey, payload);
                      }}
                    >
                      {
                        this.state.categories
                          .map((category) => {
                            if (category !== 'Income') {
                              return (<MenuItem key={category} value={category} primaryText={category} />);
                            }
                            return '';
                          })
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
                      onCheck={(e, isInputChecked) => {
                        this.handleIsInvestmentChange(columnKey, isInputChecked);
                      }}
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
                      onChange={(e, selectedNumber, payload) => {
                        this.handlePayforChange(columnKey, payload);
                      }}
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
        {
          this.renderNodeDialog()
        }
      </div>
    );
  }
}

ImportContainer.propTypes = {
  uid: React.PropTypes.string
};

export default ImportContainer;
