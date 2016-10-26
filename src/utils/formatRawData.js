import _ from 'lodash';
import BigNumber from 'bignumber.js';
import analyzeData from './analyzeData';

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
  note:       // string
}]
*/

// Convert SEB data
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
      note: ''
    };
    outputData.push(outputRecord);
  });
  return outputData;
}
// End of SEB data

// Convert OKQ8 data
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
      type: (record[okq8Columns.type] === 'Köp' || record[okq8Columns.type] === 'Reserverat belopp') ? 'out' : 'in',
      needAttention: false,
      category: '',
      payfor: '',
      note: ''
    };
    outputData.push(outputRecord);
  });
  return outputData;
}
// End of OKQ8 data

// Convert Remember data
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
      note: ''
    };
    outputData.push(outputRecord);
  });
  return outputData;
}
// End of Remember data

function formatRawData(bank = 'seb', inputData) {
  let formatedData;
  if (bank === 'okq8') {
    formatedData = convertOkq8Data(inputData);
  } else if (bank === 'remember') {
    formatedData = convertRememberData(inputData);
  } else {
    formatedData = convertSebData(inputData);
  }
  return analyzeData(formatedData);
}

export default formatRawData;
