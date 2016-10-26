import _ from 'lodash';

export function aggregateByMonth(input) {
  const output = {};

  _.forEach(input, (record) => {
    const [year, month] = record.date.split('-');
    const index = `${year}-${month}`;
    if (output[index] === undefined) {
      output[index] = [];
    }
    const newRecord = { ...record };
    delete newRecord.needAttention;
    newRecord.amount = newRecord.amount.toString();
    output[index].push(newRecord);
  });

  return output;
}

function matchRecord(originalRecord, additionalRecord) {
  return additionalRecord.receiver === originalRecord.receiver && additionalRecord.date === originalRecord.date && additionalRecord.amount.toString() === originalRecord.amount.toString();
}

export function mergeData(originalData, additionalData) {
  const monthArray = Object.keys(additionalData);

  const output = {};
  _.forEach(monthArray, (month, index) => {
    if (originalData[index] === null) {
      output[month] = additionalData[month];
    } else {
      const oneMonthOriginalData = [...originalData[index]];

      _.forEach(additionalData[month], (additionalRecord) => {
        const match = _.find(oneMonthOriginalData, originalRecord => matchRecord(originalRecord, additionalRecord));

        if (match === undefined) {
          oneMonthOriginalData.push(additionalRecord);
        }
      });

      output[month] = oneMonthOriginalData;
    }
  });
  return output;
}
