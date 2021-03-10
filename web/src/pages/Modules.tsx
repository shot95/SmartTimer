import React from "react";
import { Link, withRouter } from "react-router-dom";
import Module, { ModuleDTO } from "../model/Module";
import TimeStamp, { TimeStampDTO } from "../model/TimeStamp";
import PageProps from "./page-props";
import axios from 'axios';
import Event from "../model/Event";


class Modules extends React.Component<PageProps>{

    constructor(props: PageProps) {
        super(props);
        this.delete = this.delete.bind(this);
    }

    async componentDidMount() {
        //load products from server

        if (this.props.appState.userName === '') {
            this.props.history.push('/main');
            return;
        }
        console.log('Modules.tsx didmount called');
        await this.props.appState.loadTimeStampsFromServer(this.props.appState.userName);
        this.props.appSetState({ modules: this.props.appState.modules });
    }

    async delete(id: string) {
        var userName = this.props.appState.userName;
        if (userName === '') return;
        userName = userName.toUpperCase();

        const mod = this.props.appState.getFromModules(id);
        const tss = mod!!.timeStamps;
        for (var ts of tss) {
            const tsDto: TimeStampDTO = {
                id: ts.id,
                date: ts.date,
                module: ts.module.id,
                recordedTime: ts.recordedTime
            }

            const event: Event = {
                topic: `timestamps${userName}`,
                id: tsDto.id,
                date: new Date().toISOString(),
                state: 'unregistered',
                payload: tsDto
            }

            await axios.post(this.props.appState.serverURL + '/api/submit', event);
            this.props.appSetState({ modules: this.props.appState.modules });

        }


        const moduleDto: ModuleDTO = {
            id: id,
            name: mod!!.name,
            buttonID: mod!!.buttonID,
            sumTime: mod!!.sumTime
        }

        const event: Event = {
            topic: `modules${userName}`,
            id: moduleDto.id,
            date: new Date().toISOString(),
            state: 'unregistered',
            payload: moduleDto
        }

        await axios.post(this.props.appState.serverURL + '/api/submit', event);

        this.props.appState.removeModule(id);
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
                    <h1>Modules</h1>
                </div>
                <div>
                    <Link to="/modules/edit">
                        <button id="addButton" disabled={this.props.appState.userName === ''}>Add</button>
                    </Link>
                </div>
                <hr/>
                <div>
                    <span className="ModulSpan"><h2>Module name</h2></span>
                    <span className="ModulSpan"><h2>Button Id</h2></span>
                    <span className="ModulSpanshort"><h2>Modul Id</h2></span>
                    <span className="ModulSpanshort"><h2>delete</h2></span>
                </div>
                {
                    this.props.appState.getModulesAsList().map((module) => {
                        return (
                            <div key={module.id} className="SpanSurrounder">
                                <span className="ModulSpan">{module.name || '?'}</span>
                                <span className="ModulSpan">{module.buttonID}</span>
                                <span className="ModulSpanshort">{module.id}</span>
                                <span className="ModulSpanshort"><button onClick={() => this.delete(module.id)}>delete</button></span>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default withRouter(Modules)