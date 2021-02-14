import React from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import AppState from './model/AppState';
import { Redirect, Route, BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import Modules from './pages/Modules';
import ModulesEdit from './pages/ModulesEdit';
import axios from 'axios';
import DailySummary from './pages/DailySummary';
import MonthlySummary from './pages/MonthlySummary';
import YearlySummary from './pages/YearlySummary';

class App extends React.Component {

  state: AppState = new AppState();

  constructor(props: any) {
    super(props);
    this.setState = this.setState.bind(this);
    this.buttonAction = this.buttonAction.bind(this);
    this.enterAction = this.enterAction.bind(this);
    this.dateAction = this.dateAction.bind(this);
  }


  buttonAction() {
    axios.post('http://localhost:34560/api/addtimestamp', { date: '02.02.1997', module: 'm1', rectime: 54, username: 'jonathan' });
  }
  
  enterAction() {
    const name = $('#userNameInput').val() as string;
    this.setState({ userName: name });
  }

  dateAction() {
    const date = $('#dateInput').val() as string;
    this.setState({ date: date });
  }

  render() {
    return (
      <Router>
        <div id="root">
          <Switch>
            <Route exact path="/main">
              <div className="App">
                <div>{ this.state.userName === '' ? <input id="userNameInput" placeholder="Username?" /> : null }</div>
                <div>
                { this.state.userName === '' ? <button id="userNameButton" onClick={this.enterAction}>enter</button> : null }
                  
                </div>
                <div>{ this.state.date === '' ? <input id="dateInput" placeholder="Date?" /> : null }</div>
                <div>
                { this.state.date === '' ? <button id="dateButton" onClick={this.dateAction}>enter date</button> : null }
                  
                </div>
                <div>
                  <Link to="/modules">
                    <button id="modulesButton" disabled={this.state.userName === ''}>modules</button>
                  </Link>
                </div>
                <div>
                  <button id="testButton" onClick={this.buttonAction}  disabled={this.state.userName === ''}>addtimestamp</button>
                </div>
                <div>
                  <Link to="/dailysummary">
                    <button id="dailySummaryButton"  disabled={this.state.userName === ''}>DailySummary</button>
                  </Link>
                </div>
                <div>
                  <Link to="/monthlysummary">
                    <button id="monthlySummaryButton"  disabled={this.state.userName === ''}>monthlysummary</button>
                  </Link>
                </div>
                <div>
                  <Link to="/yearlysummary">
                    <button id="yearlySummaryButton"  disabled={this.state.userName === ''}>yearlysummary</button>
                  </Link>
                </div>
              </div>
            </Route>
            <Route exact path="/modules">
              <Modules appState={this.state} appSetState={this.setState} />
            </Route>
            <Route exact path="/modules/edit">
              <ModulesEdit appState={this.state} appSetState={this.setState} />
            </Route>

            <Route exact path="/dailysummary">
              <DailySummary appState={this.state} appSetState={this.setState} />
            </Route>
            <Route exact path="/monthlysummary">
              <MonthlySummary appState={this.state} appSetState={this.setState} />
            </Route>
            <Route exact path="/yearlysummary">
              <YearlySummary appState={this.state} appSetState={this.setState} />
            </Route>
            <Route path="/">
              <Redirect to="/main" />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
