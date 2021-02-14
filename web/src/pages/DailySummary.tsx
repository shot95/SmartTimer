import React from "react";
import { Link, withRouter } from "react-router-dom";
import Module from "../model/Module";
import PageProps from "./page-props";


class DailySummary extends React.Component<PageProps>{
    
    constructor(props: PageProps) {
        super(props);
    }

    async componentDidMount() {
        
        if (this.props.appState.userName === '' || this.props.appState.date === '') {
            this.props.history.push('/main');
            return;
        }
        //load timestamps from server
        console.log('DailySummary.tsx didmount called');
        await this.props.appState.loadTimeStampsFromServer(this.props.appState.userName);
        this.props.appSetState({modules: this.props.appState.modules});
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
                    Daily Summary for {this.props.appState.date}
                </div>
            
                <div>
                    <span>Module name</span>
                    <span>time</span>
                </div>
                
                {
                    this.props.appState.userName === '' && this.props.appState.date === ''? null :
                    this.props.appState.getModulesAsList().map((module) => {
                        let sum = 0.0;
                        module.timeStamps.filter((ts) => ts.date === this.props.appState.date).forEach((val, ind, arr) => {
                            sum += val.recordedTime;
                        })
                        sum /= 60;
                        return(
                            <div key={module.id}>
                                <span>{module.name || '?'}</span>
                                <span>{sum.toFixed(1)}min</span>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default withRouter(DailySummary)