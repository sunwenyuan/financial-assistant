import React from 'react';
import { withRouter } from 'react-router';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
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

import Divider from 'material-ui/Divider';

class SideBarMenu extends React.Component {
  constructor() {
    super();
    this.menuItemClicked = this.menuItemClicked.bind(this);
  }

  menuItemClicked(e, menuItem) {
    this.props.router.push(`/${menuItem.key}`);
  }

  render() {
    return (
      <Menu onItemTouchTap={this.menuItemClicked}>
        <MenuItem primaryText="Accounts Summary" key="account-summary" leftIcon={<Home />} />
        <Divider />
        <MenuItem primaryText="Expenses" key="expenses" leftIcon={<ShoppingBasket />} />
        <MenuItem primaryText="Income" key="income" leftIcon={<BusinessCenter />} />
        <MenuItem primaryText="Bills" key="bills" leftIcon={<Receipt />} />
        <MenuItem primaryText="Investments" key="investments" leftIcon={<Security />} />
        <MenuItem primaryText="Savings" key="savings" leftIcon={<LocalAtm />} />
        <MenuItem primaryText="Cash" key="cash" leftIcon={<AttachMoney />} />
        <Divider />
        <MenuItem primaryText="Budget" key="budget" leftIcon={<Mail />} />
        <MenuItem primaryText="People" key="people" leftIcon={<Group />} />
        <Divider />
        <MenuItem primaryText="Import" key="import" leftIcon={<GetApp />} />
        <MenuItem primaryText="Settings" key="settings" leftIcon={<Settings />} />
      </Menu>
    );
  }
}

SideBarMenu.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  })
};

export default withRouter(SideBarMenu);
