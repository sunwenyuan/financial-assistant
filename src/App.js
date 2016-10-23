import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.css';

import SideBar from './components/SideBar';
import AppHeader from './components/AppHeader';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="header">
            <AppHeader />
          </div>
          <div className="main">
            <div className="side-bar">
              <SideBar />
            </div>
            <div className="content-wrap">
              {this.props.children}
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
