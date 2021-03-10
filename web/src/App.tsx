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
import TimestampsEdit from './pages/TimestampsEdit';

class App extends React.Component {

  state: AppState = new AppState();

  constructor(props: any) {
    super(props);
    this.setState = this.setState.bind(this);
    this.enterAction = this.enterAction.bind(this);
    this.dateAction = this.dateAction.bind(this);
    //this.newData = this.newData.bind(this);
  }

  /*async newData() {
    for (let months = 3; months < 11; months++) {
      for (let days = 1; days < 29; days++) {
        for (let hrs = 7; hrs < 16; hrs++) {
          let random = Math.floor(Math.random() * (60 * 60) + 1);
          await axios.post('http://localhost:34560/api/addtimestamp', {
            date: `2021-${this.pad(months, 2)}-${this.pad(days, 2)}T${this.pad(hrs, 2)}:00:00.000Z`,
            module: 'm1',
            rectime: random,
            username: 'jonathan'
          });
          await axios.post('http://localhost:34560/api/addtimestamp', {
            date: `2021-${this.pad(months, 2)}-${this.pad(days, 2)}T${this.pad(hrs, 2)}:00:00.000Z`,
            module: 'm2',
            rectime: (60*60) - random,
            username: 'jonathan'
          });
        }
      }
    }
  }*/
  pad(num: number, size: number): string {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  enterAction() {
    const name = $('#userNameInput').val() as string;
    this.setState({ userName: name });
  }

  dateAction() {
    const date = $('#dateInput').val() as string;
    const isoString = `${date.substring(0, 4)}-${date.substring(5, 7)}-${date.substring(8, 10)}T00:00:00.000Z`;
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
                <div><input id="dateInput" placeholder="yyyy.mm.dd?" defaultValue={this.state.date.substring(0,10)} /></div>
                <div>
                  <button id="dateButton" onClick={this.dateAction}>enter date</button>

                </div>
                <hr></hr>
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
            <Route exact path="/timestamps/edit">
              <TimestampsEdit appState={this.state} appSetState={this.setState} />
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
