import React from 'react';
import { List, makeSelectable } from 'material-ui/List';

function wrapState(ComposedComponent) {
  class SelectableList extends React.Component {
    constructor() {
      super();
      this.handleRequestChange = this.handleRequestChange.bind(this);
    }

    componentWillMount() {
      this.props.onSelectionChange(this.props.defaultValue);
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange(event, index) {
      if (index !== this.state.selectedIndex) {
        this.props.onSelectionChange(index);
      }
      this.setState({
        selectedIndex: index,
      });
    }

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };

  SelectableList.propTypes = {
    children: React.PropTypes.node.isRequired,
    defaultValue: React.PropTypes.string.isRequired,
    onSelectionChange: React.PropTypes.func
  };

  return SelectableList;
}

export default wrapState(makeSelectable(List));