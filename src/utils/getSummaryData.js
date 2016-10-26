import _ from 'lodash';
import BigNumber from 'bignumber.js';

function getSummaryData(input) {
  const summary = {};
  const output = [];
  _.forEach(input, (record) => {
    const category = record.category === '' ? 'Other' : record.category;
    const amount = new BigNumber(record.amount);
    if (summary[category] === undefined) {
      summary[category] = amount;
    } else {
      summary[category] = summary[category].plus(amount);
    }
  });

  _.forEach(Object.keys(summary), (category) => {
    output.push({
      name: category,
      y: summary[category].toNumber()
    });
  });

  return output;
}

export default getSummaryData;
