import React from 'react';

class AppHeader extends React.Component {
  render() {
    return (
      <h2>{this.props.title}</h2>
    );
  }
}

AppHeader.propTypes = {
  title: React.PropTypes.string.isRequired
};

export default AppHeader;
