import _ from 'lodash';

/*
Input data format:
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

const dailyExpensesKeywords = ['ica', 'coop', 'city gross', 'matrix', 'oriental supermarket', 'oriental', 'pressbyrån', 'lidl', 'kina li', 'biltema', 'kicks', 'willys', 'systembolage', 'enkla vardag'];
const needAttentionKeywords = ['paypal', 'klarna'];
const electronicsKeywords = ['apple', 'media markt', 'elgiganten'];
const carKeywords = ['circle', 'statoil', 'qpark', 'parkman', 'dekra', 'trängselskatt transports'];
const clothingKeywords = ['intersport', 'polarn o.pyret', 'polarn o pyr', 'polarn', 'decathlon', 'nike', 'ecco', 'timberland', 'lindex', 'åhlens', 'h m', 'h&m', 'björn borg', 'jack&jones', 'dea axelsson', 'esprit', 'stadium', 'asics', 'dressman'];
const healthKeywords = ['sats', 'apotek', 'apoteket', 'karolinska'];
const toysKeywords = ['brleksaker', 'toysrus', 'lekia'];
const homeKeywords = ['ikea', 'lån', 'hsb', 'bredbandsbolaget', 'skype', 'tele2', 'comviq'];
const restaurantKeywords = ['restaurang tang', 'burger', 'mcdonalds', 'mcdonald', 'max', 'subway', 'restaurang', 'pizzeria', 'sushi', 'starbucks', 'pizza', 'yogiboost', 'coffee'];
const insuranceKeywords = ['if', 'trygg-hansa'];
const investmentKeywords = ['isk'];
const educationKeywords = ['arvato', 'huddinge kommun'];

const needAttentionLimit = 2000;

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function checkForCategory(receiver, keywords) {
  const match = _.find(keywords, (keyword) => {
    let pattern;
    if (keyword === 'åhlens') {
      pattern = /åhlens/;
    } else {
      pattern = '\\b';
      pattern += escapeRegExp(keyword);
      pattern += '\\b';
    }
    return new RegExp(pattern, 'i').test(receiver);
  });
  return match !== undefined;
}

function analyzeData(input) {
  const output = [];
  _.forEach(input, (record) => {
    const newRecord = { ...record };
    // check if this record should be kept, record should be removed if receiver is Wenyuan Sun or Ping Jia
    if (newRecord.receiver.toLowerCase() === 'wenyuan sun' || newRecord.receiver.toLowerCase() === 'ping jia') {
      return;
    }

    // if type is 'in', set category to 'Income'
    if (newRecord.type === 'in') {
      newRecord.category = 'Income';
    }

    const receiver = newRecord.receiver;
    // check for daily expenses category
    if (checkForCategory(receiver, dailyExpensesKeywords)) {
      newRecord.category = 'Daily Expenses';
    } else if (checkForCategory(receiver, electronicsKeywords)) {
      newRecord.category = 'Electronics';
    } else if (checkForCategory(receiver, carKeywords)) {
      newRecord.category = 'Car';
    } else if (checkForCategory(receiver, clothingKeywords)) {
      newRecord.category = 'Clothing';
    } else if (checkForCategory(receiver, healthKeywords)) {
      newRecord.category = 'Health';
    } else if (checkForCategory(receiver, toysKeywords)) {
      newRecord.category = 'Toys';
    } else if (checkForCategory(receiver, needAttentionKeywords)) {
      newRecord.needAttention = true;
    } else if (checkForCategory(receiver, homeKeywords)) {
      newRecord.category = 'Home';
    } else if (checkForCategory(receiver, restaurantKeywords)) {
      newRecord.category = 'Restaurant';
    } else if (checkForCategory(receiver, insuranceKeywords)) {
      newRecord.category = 'Insurance';
    } else if (checkForCategory(receiver, investmentKeywords)) {
      newRecord.category = 'Investment';
    } else if (checkForCategory(receiver, educationKeywords)) {
      newRecord.category = 'Education';
    }

    // Set default payfor to 'Whole Family'
    newRecord.payfor = 'Whole Family';

    // check amount, if it's more than needAttentionLimit, set needAttention to true
    if (newRecord.amount.greaterThan(needAttentionLimit)) {
      newRecord.needAttention = true;
    }

    output.push(newRecord);
  });

  return output;
}

export default analyzeData;
