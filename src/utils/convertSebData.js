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
}]
*/

const columns = {
  amount: 'Belopp',
  receiver: 'Text / mottagare',
  date: 'Valutadatum'
};

function convertSebData(inputData) {
  const outputData = [];
  _.forEach(inputData, (record) => {
    let amountString = record[columns.amount];
    const type = amountString.charAt(0) === '-' ? 'out' : 'in';
    amountString = amountString.replace('-', '');
    amountString = amountString.replace(',', '');
    const outputRecord = {
      amount: new BigNumber(amountString),
      receiver: record[columns.receiver],
      date: record[columns.date],
      type,
      needAttention: false
    };
    outputData.push(outputRecord);
  });
  return outputData;
}

export default convertSebData;
