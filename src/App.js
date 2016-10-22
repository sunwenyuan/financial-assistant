import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.css';

import SideBarMenu from './components/SideBarMenu';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="side-bar">
            <SideBarMenu />
          </div>
          <div className="content-wrap">
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
