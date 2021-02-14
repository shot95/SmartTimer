import React from "react";
import { Link, withRouter } from "react-router-dom";
import Module from "../model/Module";
import PageProps from "./page-props";


class YearlySummary extends React.Component<PageProps>{

    constructor(props: PageProps) {
        super(props);
    }

    async componentDidMount() {
        
        if (this.props.appState.userName === '' || this.props.appState.date === '') {
            this.props.history.push('/main');
            return;
        }
        //load products from server
        console.log('DailySummary.tsx didmount called');
        await this.props.appState.loadTimeStampsFromServer(this.props.appState.userName);
        this.props.appSetState({ modules: this.props.appState.modules });
    }

    render() {
        return (
            <div className="App">
                <div>
                    <Link to="/main">
                        <button id="mainButton">Main</button>
                    </Link>
                </div>
                <div>
                    Yearly Summary for {this.props.appState.date.substring(6,10)}
                </div>
                <div>
                    <span>Module name</span>
                    <span>time</span>
                </div>

                {
                    this.props.appState.userName === '' && this.props.appState.date === '' ? null :
                        this.props.appState.getModulesAsList().map((module) => {
                            let sum = 0.0;
                            console.log(`${this.props.appState.date.substring(6, 10)}`)
                            module.timeStamps.filter((ts) => ts.date.substring(6, 10) === this.props.appState.date.substring(6, 10)).forEach((val, ind, arr) => {
                                sum += val.recordedTime;
                            })
                            sum /= 60;
                            sum /= 60;
                            sum /= 8; //8h per day
                            return (
                                <div key={module.id}>
                                    <span>{module.name || '?'}</span>
                                    <span>{sum.toFixed(1)}working Days</span>
                                </div>
                            );
                        })
                }
            </div>
        );
    }
}

export default withRouter(YearlySummary)