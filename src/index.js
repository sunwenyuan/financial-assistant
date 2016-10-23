import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import './index.css';

import AccountsSummaryContainer from './components/AccountsSummaryContainer';
import BillsContainer from './components/BillsContainer';
import BudgetContainer from './components/BudgetContainer';
import CashContainer from './components/CashContainer';
import ExpensesContainer from './components/ExpensesContainer';
import ImportContainer from './components/ImportContainer';
import IncomeContainer from './components/IncomeContainer';
import InvestmentsContainer from './components/InvestmentsContainer';
import PeopleContainer from './components/PeopleContainer';
import SavingsContainer from './components/SavingsContainer';
import SettingsContainer from './components/settings/SettingsContainer';

injectTapEventPlugin();

const Root = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="account-summary" component={AccountsSummaryContainer} />
      <Route path="expenses" component={ExpensesContainer} />
      <Route path="income" component={IncomeContainer} />
      <Route path="bills" component={BillsContainer} />
      <Route path="investments" component={InvestmentsContainer} />
      <Route path="savings" component={SavingsContainer} />
      <Route path="cash" component={CashContainer} />
      <Route path="budget" component={BudgetContainer} />
      <Route path="people" component={PeopleContainer} />
      <Route path="import" component={ImportContainer} />
      <Route path="settings" component={SettingsContainer} />
    </Route>
  </Router>
);

ReactDOM.render(
  Root,
  document.getElementById('root')
);
