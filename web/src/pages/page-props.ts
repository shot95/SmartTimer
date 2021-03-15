import AppState from "../model/AppState";
import {RouteComponentProps} from 'react-router-dom';

export default interface PageProps extends RouteComponentProps{
    appState:AppState,
    appSetState: any,
}