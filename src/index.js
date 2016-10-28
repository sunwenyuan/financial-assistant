import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './App';
import './index.css';

import SummaryContainer from './components/summary/SummaryContainer';
import TrendContainer from './components/trend/TrendContainer';
import BillsContainer from './components/BillsContainer';
import BudgetContainer from './components/BudgetContainer';
import CashContainer from './components/CashContainer';
import ExpensesContainer from './components/expenses/ExpensesContainer';
import ImportContainer from './components/import/ImportContainer';
import IncomeContainer from './components/income/IncomeContainer';
import InvestmentsContainer from './components/investments/InvestmentsContainer';
import PeopleContainer from './components/PeopleContainer';
import SavingsContainer from './components/SavingsContainer';
import SettingsContainer from './components/settings/SettingsContainer';
import WelcomePage from './components/WelcomePage';
import BackupContainer from './components/backup/BackupContainer';

injectTapEventPlugin();

const Root = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={WelcomePage} />
      <Route path="summary" component={SummaryContainer} />
      <Route path="trend" component={TrendContainer} />
      <Route path="expenses" component={ExpensesContainer} />
      <Route path="income" component={IncomeContainer} />
      <Route path="bills" component={BillsContainer} />
      <Route path="investments" component={InvestmentsContainer} />
      <Route path="savings" component={SavingsContainer} />
      <Route path="cash" component={CashContainer} />
      <Route path="budget" component={BudgetContainer} />
      <Route path="people" component={PeopleContainer} />
      <Route path="import" component={ImportContainer} />
      <Route path="backup" component={BackupContainer} />
      <Route path="settings" component={SettingsContainer} />
    </Route>
  </Router>
);

ReactDOM.render(
  Root,
  document.getElementById('root')
);
