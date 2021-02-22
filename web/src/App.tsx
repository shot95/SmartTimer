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
    this.enterAction = this.enterAction.bind(this);
    this.dateAction = this.dateAction.bind(this);
  }

  async newData() {
    await axios.post('http://localhost:34560/api/addtimestamp', {
      date: '2021-01-03T12:00:00.000Z',
      module: 'm1',
      rectime: 20 * 60,
      username: 'jonathan'
    });
    await axios.post('http://localhost:34560/api/addtimestamp', {
      date: '2021-01-03T13:00:00.000Z',
      module: 'm1',
      rectime: 30 * 60,
      username: 'jonathan'
    });
    await axios.post('http://localhost:34560/api/addtimestamp', {
      date: '2021-01-03T15:00:00.000Z',
      module: 'm1',
      rectime: 10 * 60,
      username: 'jonathan'
    });

    await axios.post('http://localhost:34560/api/addtimestamp', {
      date: '2021-01-03T08:32:10.000Z',
      module: 'm2',
      rectime: 20 * 60,
      username: 'jonathan'
    });
    await axios.post('http://localhost:34560/api/addtimestamp', {
      date: '2021-01-03T12:32:10.120Z',
      module: 'm2',
      rectime: 40 * 60,
      username: 'jonathan'
    });
  }

  enterAction() {
    const name = $('#userNameInput').val() as string;
    this.setState({ userName: name });
  }

  dateAction() {
    const date = $('#dateInput').val() as string;
    const isoString = `${date.substring(6, 10)}-${date.substring(3, 5)}-${date.substring(0, 2)}T00:00:00.000Z`;
    //YYYY-MM-DDTHH:mm:ss.sssZ
    this.setState({ date: isoString });
  }

  render() {
    return (
      <Router>
        <div id="root">
          <Switch>
            <Route exact path="/main">
              <div className="App">
                <div>{this.state.userName === '' ? <input id="userNameInput" placeholder="Username?" /> : null}</div>
                <div>
                  {this.state.userName === '' ? <button id="userNameButton" onClick={this.enterAction}>enter</button> : null}

                </div>
                <div><input id="dateInput" placeholder="dd.mm.yyyy?" defaultValue={this.state.date} /></div>
                <div>
                  <button id="dateButton" onClick={this.dateAction}>enter date</button>

                </div>
                <div>
                  <button id="newDataButton" onClick={this.newData}>new data</button>

                </div>
                <div>
                  <Link to="/modules">
                    <button id="modulesButton" disabled={this.state.userName === ''}>Modules</button>
                  </Link>
                </div>
                <div>
                  <Link to="/dailysummary">
                    <button id="dailySummaryButton" disabled={this.state.userName === '' && this.state.date === ''}>Daily Summary</button>
                  </Link>
                </div>
                <div>
                  <Link to="/monthlysummary">
                    <button id="monthlySummaryButton" disabled={this.state.userName === '' && this.state.date === ''}>Monthly Summary</button>
                  </Link>
                </div>
                <div>
                  <Link to="/yearlysummary">
                    <button id="yearlySummaryButton" disabled={this.state.userName === '' && this.state.date === ''}>Yearly Summary</button>
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
