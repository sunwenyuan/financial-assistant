import React from 'react';
import { List, makeSelectable } from 'material-ui/List';

import _ from 'lodash';

function wrapState(ComposedComponent) {
  class SelectableList extends React.Component {
    constructor() {
      super();
      this.handleRequestChange = this.handleRequestChange.bind(this);
      this.getTextByKey = this.getTextByKey.bind(this);
    }

    componentWillMount() {
      const selectionText = this.getTextByKey(this.props.defaultValue);
      this.props.onSelectionChange(this.props.defaultValue, selectionText);
      this.setState({
        selectedKey: this.props.defaultValue,
      });
    }

    getTextByKey(key) {
      const selectedItem = _.find(this.props.children, item => key === item.props.value);
      if (selectedItem !== undefined) {
        return selectedItem.props.primaryText;
      }
      return null;
    }

    handleRequestChange(event, key) {
      this.getTextByKey(key);
      if (key !== this.state.selectedKey) {
        const selectionText = this.getTextByKey(this.state.selectedKey);
        this.props.onSelectionChange(key, selectionText);
      }
      this.setState({
        selectedKey: key,
      });
    }

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedKey}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  }

  SelectableList.propTypes = {
    children: React.PropTypes.node.isRequired,
    defaultValue: React.PropTypes.string.isRequired,
    onSelectionChange: React.PropTypes.func
  };

  return SelectableList;
}

export default wrapState(makeSelectable(List));
