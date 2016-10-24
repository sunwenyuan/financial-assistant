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
  amount: 'Belopp SEK',
  receiver: 'Inköpsställe/Butiksnamn',
  date: 'Valuteringsdatum',
  type: 'Specifikation av kortköp'
};

function convertOkq8Data(inputData) {
  const outputData = [];
  _.forEach(inputData, (record) => {
    const outputRecord = {
      amount: new BigNumber(record[columns.amount]),
      receiver: record[columns.receiver],
      date: record[columns.date],
      type: record[columns.type] === 'Köp' ? 'out' : 'in',
      needAttention: false
    };
    outputData.push(outputRecord);
  });
  return outputData;
}

export default convertOkq8Data;
