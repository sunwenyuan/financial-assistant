import moment from 'moment';
import _ from 'lodash';
import React from 'react';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import PreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import NextIcon from 'material-ui/svg-icons/av/skip-next';

import base from '../../base';

const tableHeaderMapping = [
  ['date', 'Date'],
  ['receiver', 'Receiver'],
  ['amount', 'Amount'],
  ['category', 'Category'],
  ['payfor', 'Pay For'],
  ['note', 'Note']
];

class ExpensesContainer extends React.Component {
  constructor() {
    super();
    this.goPreviousMonth = this.goPreviousMonth.bind(this);
    this.goNextMonth = this.goNextMonth.bind(this);
    this.getTransactions = this.getTransactions.bind(this);

    const now = moment().format('YYYY-MM');
    this.state = {
      month: now,
      transactions: []
    };
  }

  componentDidMount() {
    this.getTransactions(this.state.month);
  }

  getFirebaseEndpoint(month) {
    let endpoint = `users/${this.props.uid}/transactions`;
    if (month !== undefined) {
      endpoint += `/${month}`;
    }
    return endpoint;
  }

  getTransactions(month) {
    base
      .fetch(this.getFirebaseEndpoint(month), {
        context: this,
        isArray: true
      })
      .then((transactions) => {
        const newTransactions = [];
        _.forEach(transactions, (transaction) => {
          const category = transaction.category;
          if (category !== 'Income' && category !== 'Investment') {
            newTransactions.push(transaction);
          }
        });
        this.setState({
          month,
          transactions: newTransactions
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  goPreviousMonth() {
    const previousMonth = moment(`${this.state.month}-01`).subtract(1, 'M').format('YYYY-MM');
    this.getTransactions(previousMonth);
  }

  goNextMonth() {
    const nextMonth = moment(`${this.state.month}-01`).add(1, 'M').format('YYYY-MM');
    this.getTransactions(nextMonth);
  }

  render() {
    return (
      <div className="expenses-container">
        <Toolbar className="expenses-container-toolbar">
          <ToolbarGroup>
            <RaisedButton
              label="Previous Month"
              primary
              labelPosition="after"
              icon={<PreviousIcon />}
              onTouchTap={this.goPreviousMonth}
            />
            <ToolbarTitle text={this.state.month} />
            <RaisedButton
              label="Next Month"
              primary
              labelPosition="before"
              icon={<NextIcon />}
              disabled={moment(`${this.state.month}-01`).add(1, 'M').unix() > moment().unix()}
              onTouchTap={this.goNextMonth}
            />
          </ToolbarGroup>
        </Toolbar>
        <div className="expenses-container-table-wrapper">
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
                  .map((record, index) => (
                    <TableRow key={index}>
                      {
                        tableHeaderMapping
                          .map((header) => {
                            const [headerName] = [...header];
                            const columnKey = `row_${index}_${headerName}`;
                            return (
                              <TableRowColumn key={columnKey}>
                                {record[headerName]}
                              </TableRowColumn>
                            );
                          })
                      }
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

ExpensesContainer.propTypes = {
  uid: React.PropTypes.string
};

export default ExpensesContainer;
