import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import './App.css';

import SideBar from './components/SideBar';
import AppHeader from './components/AppHeader';

import base from './base';

const appTitleBase = 'Financial Assistant';

class App extends Component {
  constructor() {
    super();

    this.updateAppTitle = this.updateAppTitle.bind(this);
    this.renderContent = this.renderContent.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);

    this.state = {
      appTitle: appTitleBase,
      uid: null
    };
  }

  componentDidMount() {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, { user });
      }
    });
  }

  authenticate() {
    base.authWithOAuthPopup('github', this.authHandler);
  }

  authHandler(err, authData) {
    if (err) {
      console.error(err);
      return;
    }

    this.setState({
      uid: authData.user.uid
    });
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

  renderContent() {
    if (this.state.uid === null) {
      return (
        <div className="App">
          <RaisedButton
            primary
            label="Login with GitHub"
            labelPosition="after"
            onTouchTap={this.authenticate}
            icon={<FontIcon className="muidocs-icon-custom-github" />}
          />
        </div>
      );
    }
    return (
      <div className="App">
        <div className="header">
          <AppHeader title={this.state.appTitle} />
        </div>
        <div className="main">
          <div className="side-bar">
            <SideBar updateAppTitle={this.updateAppTitle} />
          </div>
          <div className="content-wrap">
            {
              React.cloneElement(this.props.children, { uid: this.state.uid })
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <MuiThemeProvider>
        {
          this.renderContent()
        }
      </MuiThemeProvider>
    );
  }
}

export default App;
