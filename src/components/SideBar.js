import React from 'react';
import { withRouter } from 'react-router';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';


import Settings from 'material-ui/svg-icons/action/settings';
import AttachMoney from 'material-ui/svg-icons/editor/attach-money';
import ShoppingBasket from 'material-ui/svg-icons/action/shopping-basket';
import Group from 'material-ui/svg-icons/social/group';
import Home from 'material-ui/svg-icons/action/home';
import Receipt from 'material-ui/svg-icons/action/receipt';
import GetApp from 'material-ui/svg-icons/action/get-app';
import BusinessCenter from 'material-ui/svg-icons/places/business-center';
import LocalAtm from 'material-ui/svg-icons/maps/local-atm';
import Security from 'material-ui/svg-icons/hardware/security';
import Mail from 'material-ui/svg-icons/content/mail';

import SelectableList from './SelectableList';

class SideBar extends React.Component {
  constructor() {
    super();
    this.listItemClicked = this.listItemClicked.bind(this);
  }

  listItemClicked(value, text) {
    this.props.updateAppTitle(text);
    this.props.router.push(`/${value}`);
  }

  render() {
    return (
      <SelectableList onSelectionChange={this.listItemClicked} defaultValue="settings">
        <ListItem value="account-summary" primaryText="Accounts Summary" leftIcon={<Home />} />
        <Divider />
        <ListItem primaryText="Expenses" value="expenses" leftIcon={<ShoppingBasket />} />
        <ListItem primaryText="Income" value="income" leftIcon={<BusinessCenter />} />
        <ListItem primaryText="Bills" value="bills" leftIcon={<Receipt />} />
        <ListItem primaryText="Investments" value="investments" leftIcon={<Security />} />
        <ListItem primaryText="Savings" value="savings" leftIcon={<LocalAtm />} />
        <ListItem primaryText="Cash" value="cash" leftIcon={<AttachMoney />} />
        <Divider />
        <ListItem primaryText="Budget" value="budget" leftIcon={<Mail />} />
        <ListItem primaryText="People" value="people" leftIcon={<Group />} />
        <Divider />
        <ListItem primaryText="Import" value="import" leftIcon={<GetApp />} />
        <ListItem primaryText="Settings" value="settings" leftIcon={<Settings />} />
      </SelectableList>
    );
  }
}

SideBar.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }),
  updateAppTitle: React.PropTypes.func.isRequired
};

export default withRouter(SideBar);
