import React, { Component } from 'react';
import Profile from './Profile.js';
import Signin from './Signin.js';
import {
  UserSession,
  AppConfig
} from 'blockstack';

import InitialMenu from './InitialMenu.js';

const appConfig = new AppConfig();
const userSession = new UserSession({ appConfig: appConfig });

export default class App extends Component {


  handleSignIn(e) {
    e.preventDefault();
    userSession.redirectToSignIn(); // we should edit this to redirect to mail page
    //userSession.redirectToYourMail();
  }

  redirectToLoginPage(){
    
  }

  handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  render() { //checks if user is signed in
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          { !userSession.isUserSignedIn() ?
            <Signin userSession={userSession} handleSignIn={ this.handleSignIn } />
            : <InitialMenu userSession={userSession} handleSignOut={ this.handleSignOut } />
          }
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData})
      });
    }
  }
}
