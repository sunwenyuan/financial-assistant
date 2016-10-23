import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import FamilyMemberPanel from './FamilyMemberPanel';
import ExpenseCategoriesPanel from './ExpenseCategoriesPanel';
import SetBudgetPanel from './SetBudgetPanel';

class SettingsContainer extends React.Component {
  render() {
    return (
      <Tabs>
        <Tab label="Family Members">
          <FamilyMemberPanel />
        </Tab>
        <Tab label="Expense Categories">
          <ExpenseCategoriesPanel />
        </Tab>
        <Tab label="Set Budget">
          <SetBudgetPanel />
        </Tab>
      </Tabs>
    );
  }
}

export default SettingsContainer;
