import _ from 'lodash';
import BigNumber from 'bignumber.js';

/*
Output data format:
[{
  receiver:  // name of receiver, string
  amount:    // number of transaction, number
  date:      // transfer date, string 2016-10-18
  type:      // type of transaction, string, possible values: 'in', 'out'
  needAttention:   // If this transaction need manually deal with, boolean
  category:  // Expense category, string
  payfor:    // this transaction paid for whom, string
  isInvestment: // if this is an investment, boolean
}]
*/

const sebColumns = {
  amount: 'Belopp',
  receiver: 'Text / mottagare',
  date: 'Valutadatum'
};

function convertSebData(inputData) {
  const outputData = [];
  _.forEach(inputData, (record) => {
    let amountString = record[sebColumns.amount];
    const type = amountString.charAt(0) === '-' ? 'out' : 'in';
    amountString = amountString.replace('-', '');
    amountString = amountString.replace(',', '');
    const outputRecord = {
      amount: new BigNumber(amountString),
      receiver: record[sebColumns.receiver],
      date: record[sebColumns.date],
      type,
      needAttention: false,
      category: '',
      payfor: '',
      isInvestment: false
    };
    outputData.push(outputRecord);
  });
  return outputData;
}

const okq8Columns = {
  amount: 'Belopp SEK',
  receiver: 'Inköpsställe/Butiksnamn',
  date: 'Valuteringsdatum',
  type: 'Specifikation av kortköp'
};

function convertOkq8Data(inputData) {
  const outputData = [];
  _.forEach(inputData, (record) => {
    const outputRecord = {
      amount: new BigNumber(record[okq8Columns.amount]),
      receiver: record[okq8Columns.receiver],
      date: record[okq8Columns.date],
      type: record[okq8Columns.type] === 'Köp' ? 'out' : 'in',
      needAttention: false,
      category: '',
      payfor: '',
      isInvestment: false
    };
    outputData.push(outputRecord);
  });
  return outputData;
}

const rememberColumns = {
  amount: 'Fakturabelopp',
  receiver: 'Detaljer',
  date: 'Datum'
};

function convertRememberData(inputData) {
  const outputData = [];
  _.forEach(inputData, (record) => {
    let amountString = record[rememberColumns.amount];
    const type = amountString.charAt(0) === '-' ? 'out' : 'in';
    amountString = amountString.replace('-', '');
    amountString = amountString.replace(',', '.');
    const outputRecord = {
      amount: new BigNumber(amountString),
      receiver: record[rememberColumns.receiver],
      date: record[rememberColumns.date],
      type,
      needAttention: false,
      category: '',
      payfor: '',
      isInvestment: false
    };
    outputData.push(outputRecord);
  });
  return outputData;
}

function formatRawData(bank = 'seb', inputData) {
  if (bank === 'okq8') {
    return convertOkq8Data(inputData);
  } else if (bank === 'remember') {
    return convertRememberData(inputData);
  }
  return convertSebData(inputData);
}

export default formatRawData;
