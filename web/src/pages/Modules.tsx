import React from "react";
import { Link, withRouter } from "react-router-dom";
import Module from "../model/Module";
import PageProps from "./page-props";


class Modules extends React.Component<PageProps>{

    constructor(props: PageProps) {
        super(props);
    }

    async componentDidMount() {
        //load products from server

        if (this.props.appState.userName === '') {
            this.props.history.push('/main');
            return;
        }
        console.log('Modules.tsx didmount called');
        await this.props.appState.loadModulesFromServer(this.props.appState.userName);
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
                    Modules
                </div>
                <div>
                    <Link to="/modules/edit">
                        <button id="addButton" disabled={this.props.appState.userName === ''}>Add</button>
                    </Link>
                </div>
                {
                    this.props.appState.userName === '' ? null :
                        this.props.appState.getModulesAsList().map((module) => {
                            return (
                                <div key={module.id}>
                                    <span>{module.name || '?'}</span>
                                    <span>{module.buttonID}</span>
                                    <span>{module.id}</span>
                                </div>
                            );
                        })
                }
            </div>
        );
    }
}

export default withRouter(Modules)