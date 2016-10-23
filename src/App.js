import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.css';

import SideBar from './components/SideBar';
import AppHeader from './components/AppHeader';

const appTitleBase = 'Financial Assistant';

class App extends Component {
  constructor() {
    super();

    this.updateAppTitle = this.updateAppTitle.bind(this);

    this.state = {
      appTitle: appTitleBase
    };
  }

  updateAppTitle(sectionText) {
    let appTitle = appTitleBase;
    if (sectionText) {
      appTitle += ` -> ${sectionText}`;
    }
    this.setState({
      appTitle
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <div className="header">
            <AppHeader title={this.state.appTitle} />
          </div>
          <div className="main">
            <div className="side-bar">
              <SideBar updateAppTitle={this.updateAppTitle} />
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
