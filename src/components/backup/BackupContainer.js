import FileSaver from 'file-saver';
import _ from 'lodash';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import BackupIcon from 'material-ui/svg-icons/action/backup';
import base from '../../base';

class BackupContainer extends React.Component {
  constructor() {
    super();
    this.getFirebaseEndpoint = this.getFirebaseEndpoint.bind(this);
    this.handleMonthSelectionChange = this.handleMonthSelectionChange.bind(this);
    this.doBackup = this.doBackup.bind(this);

    this.state = {
      selectedMonth: '',
      months: []
    };
  }

  componentDidMount() {
    base
      .fetch(this.getFirebaseEndpoint(), {
        context: this
      })
      .then((response) => {
        const months = Object.keys(response);
        const selectedMonth = months.length > 0 ? months[0] : '';
        this.setState({
          months,
          selectedMonth
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getFirebaseEndpoint(month) {
    let endpoint = `users/${this.props.uid}/transactions`;
    if (month !== undefined) {
      endpoint += `/${month}`;
    }
    return endpoint;
  }

  handleMonthSelectionChange(e, index, value) {
    this.setState({
      selectedMonth: value
    });
  }

  doBackup() {
    base
      .fetch(this.getFirebaseEndpoint(this.state.selectedMonth), {
        context: this,
        isArray: true
      })
      .then((transactions) => {
        const categoryNameArray = Object.keys(transactions[0]);
        let csvContent = `${categoryNameArray.join(',')}\n`;
        _.forEach(transactions, (transaction, index) => {
          const valueArray = [];
          _.forEach(categoryNameArray, (categoryName) => {
            valueArray.push(transaction[categoryName]);
          });
          const dataString = valueArray.join(',');
          csvContent += index < transactions.length ? `${dataString}\n` : dataString;
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        FileSaver.saveAs(blob, `${this.state.selectedMonth}.fat.csv`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="backup-container">
        <div className="backup-content">
          <SelectField
            floatingLabelText="Month to Backup"
            value={this.state.selectedMonth}
            onChange={this.handleMonthSelectionChange}
          >
            {
              this.state.months.map(month => <MenuItem key={month} value={month} primaryText={month} />)
            }
          </SelectField>
          <RaisedButton
            primary
            labelPosition="after"
            label="Backup"
            icon={<BackupIcon />}
            onTouchTap={this.doBackup}
            disabled={this.state.selectedMonth === ''}
          />
        </div>
      </div>
    );
  }
}

BackupContainer.propTypes = {
  uid: React.PropTypes.string
};

export default BackupContainer;
