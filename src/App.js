import React from 'react';
import Auth from './components/Auth.js';
import Profile from './components/Profile.js';
import './App.css';
import { BrowserRouter ,Router, Switch, Route, Redirect } from "react-router-dom";
import history from "./utils/history.js";

function App() {  

  return (
    <BrowserRouter>
      <Router history={history}>
        <div className="App">
          <main className="App-main">
            <Switch>
              <Route exact path="/signup" component={Auth} />
              <Route exact path="/profile" component={Profile} />
              <Redirect exact from="*" to="/signup" />
            </Switch>
          </main>
        </div>
      </Router>
    </BrowserRouter>
  );
}

export default App;
