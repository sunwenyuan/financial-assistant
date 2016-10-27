import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import FamilyMemberPanel from './FamilyMemberPanel';
import ExpenseCategoriesPanel from './ExpenseCategoriesPanel';
import SetBudgetPanel from './SetBudgetPanel';

class SettingsContainer extends React.Component {
  render() {
    return (
      <Tabs className="settings-container">
        <Tab label="Family Members">
          <FamilyMemberPanel uid={this.props.uid} />
        </Tab>
        <Tab label="Expense Categories">
          <ExpenseCategoriesPanel uid={this.props.uid} />
        </Tab>
        <Tab label="Set Budget">
          <SetBudgetPanel />
        </Tab>
      </Tabs>
    );
  }
}

SettingsContainer.propTypes = {
  uid: React.PropTypes.string
};

export default SettingsContainer;
