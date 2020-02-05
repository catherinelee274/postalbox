import React from 'react'
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import App from './App.js';

// Require Sass file so webpack can build it
import 'bootstrap/dist/css/bootstrap.css';
import'./styles/style.css';
import InitialMenu from './InitialMenu.js';

function MainApp() {
    return (
        <div>
            <Switch>
                <Route path="/po">
                    <App />
                </Route>
                <Route path="/">
                    <App />
                </Route>
            </Switch>
        </div>
    )
}

ReactDOM.render(
    <BrowserRouter><MainApp /></BrowserRouter>,
    document.getElementById('root')
);