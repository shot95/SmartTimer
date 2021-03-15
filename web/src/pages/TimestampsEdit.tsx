import React from "react";
import { Link, withRouter } from "react-router-dom";
import Event from '../model/Event';
import axios from 'axios';
import PageProps from "./page-props";
import Module, { ModuleDTO } from "../model/Module";
import { TimeStampDTO } from "../model/TimeStamp";


class TimestampsEdit extends React.Component<PageProps>{

    constructor(props: PageProps) {
        super(props);
        this.delete = this.delete.bind(this);
    }

    async componentDidMount() {

        if (this.props.appState.userName === '' || this.props.appState.date === '') {
            this.props.history.push('/main');
            return;
        }
        //load timestamps from server
        console.log('DailySummary.tsx didmount called');
        await this.props.appState.loadTimeStampsFromServer(this.props.appState.userName);
        this.props.appSetState({ modules: this.props.appState.modules });
    }
    
    async delete(id: string, module: Module){
        
        var userName = this.props.appState.userName;
        if (userName === '') return;
        userName = userName.toUpperCase();

        const ts = module.timeStamps.filter((val,ind,arr) => val.id === id).pop();
        module.timeStamps = module.timeStamps.filter((val,ind,arr) => val.id !== id);
        
        const tsDto : TimeStampDTO = {
            id: ts!!.id,
            date: ts!!.date,
            module: ts!!.module.id,
            recordedTime: ts!!.recordedTime
        }

        const event : Event = {
            topic: `timestamps${userName}`,
            id: tsDto.id,
            date: new Date().toISOString(),
            state: 'unregistered',
            payload: tsDto
        }

        await axios.post(this.props.appState.serverURL + '/api/submit', event);
        
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
                    <h1>Timestamps for {this.props.appState.date.substring(0, 10)}</h1>
                </div>
                <hr/>

                <div>
                    <span className="TsEdit"><h2>id</h2></span>
                    <span className="TsEdit"><h2>date</h2></span>
                    <span className="TsEditshort"><h2>time</h2></span>
                    <span className="TsEditshort"><h2>delete</h2></span>
                </div>

                {
                    this.props.appState.userName === '' && this.props.appState.date === '' ? null :
                        this.props.appState.getModulesAsList().map((module) => {
                            let sum : JSX.Element[] = [];
                            module.timeStamps.filter((ts) => {
                                const tsDate = new Date(ts.date);
                                const searchDate = new Date(this.props.appState.date);
                                return tsDate.getUTCFullYear() === searchDate.getUTCFullYear()
                                    && tsDate.getUTCMonth() === searchDate.getUTCMonth()
                                    && tsDate.getUTCDate() === searchDate.getUTCDate()
                            }).forEach((val, ind, arr) => {
                                sum.push(
                                    <div key={val.id}>
                                        <span className="TsEdit">{val.id || '?'}</span>
                                        <span className="TsEdit">{val.date || '?'}</span>
                                        <span className="TsEditshort">{val.recordedTime || '?'}</span>
                                        <span className="TsEditshort"><button onClick={() => this.delete(val.id, val.module)}>delete</button></span>
                                    </div>
                                )
                            })
                            return (
                                sum
                            );
                        })
                }
            </div>
        );
    }
}

export default withRouter(TimestampsEdit)