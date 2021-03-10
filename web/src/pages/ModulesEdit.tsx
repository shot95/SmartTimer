import React from "react";
import { Link, withRouter } from "react-router-dom";
import $ from 'jquery';
import Event from '../model/Event';
import axios from 'axios';
import PageProps from "./page-props";
import { ModuleDTO } from "../model/Module";


class ModulesEdit extends React.Component<PageProps>{
    
    constructor(props: PageProps) {
        super(props);
        this.okButtonAction = this.okButtonAction.bind(this);
    }

    componentDidMount(){
        if (this.props.appState.userName === ''){
            this.props.history.push('/main')
        }
    }

    async okButtonAction() {
        const name = $('#moduleNameInput').val() as string;
        const buttonId = $('#buttonIdInput').val() as string;
        const moduleId = $('#moduleIdInput').val() as string;
        this.props.appState.haveModule(moduleId,name,buttonId);
        console.log(`Button pressed for ${name} ${moduleId}`);
        
        const moduleDTO : ModuleDTO = {
            name: name, 
            id: moduleId,
            buttonID: buttonId,
            sumTime: 0,
        };

        const userName = this.props.appState.userName.toUpperCase();

        const event : Event = {
            topic: `modules${userName}`, 
            id: moduleDTO.id, 
            date: new Date().toISOString(), 
            state: 'created',
            payload: moduleDTO,
        };

        const res = await axios.post(this.props.appState.serverURL + "/api/submit", event);
        console.log(`respnse: ${res.status}`);

        this.props.history.push('/modules');
    }

    render() {
        return (
            <div className="App">
                <div>
                    <Link to="/modules">
                        <button id="modulesButton">modules</button>
                    </Link>
                </div>
                <div>
                    <h1>add or edit modules</h1>
                </div>
                <div>
                    <input id="moduleNameInput" placeholder="name?" disabled={this.props.appState.userName === ''}/>
                </div>
                <div>
                    <input id="buttonIdInput" placeholder="button?" disabled={this.props.appState.userName === ''}/>
                </div>
                <div>
                    <input id="moduleIdInput" placeholder="module id?"disabled={this.props.appState.userName === ''}/>
                </div>
                <div>
                    <button id="okButton" onClick={this.okButtonAction} disabled={this.props.appState.userName === ''}>OK</button>
                </div>
            </div>
        );
    }
}

export default withRouter(ModulesEdit)