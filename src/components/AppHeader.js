import React from 'react';

class AppHeader extends React.Component {
  render() {
    return (
      <span>{this.props.title}</span>
    );
  }
}

AppHeader.propTypes = {
  title: React.PropTypes.string.isRequired
};

export default AppHeader;
