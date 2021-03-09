import express, { response } from 'express';
import Event from '../model/Event';
import ModelCommandHandler from '../model/ModelCommandHandler';
import ModelEditor from '../model/ModelEditor';
import { Pool } from 'pg';
import axios from 'axios';
import ModuleCommandHandler from '../model/ModuleCommandHandler';
import TimeStampCommandHandler from '../model/TimeStampCommandHandler';
import { TimeStampDTO } from '../model/TimeStamp';
import { v4 as uuidv4 } from 'uuid';
import { submitHandler } from '../routes';
import SubmitHandler from './SubmitHandler';
import { ModuleDTO } from '../model/Module';

interface ClientData {
    username: string
}

export default class SyncHandler {

    submitHandler: SubmitHandler;
    constructor(handler: SubmitHandler) {
        this.submitHandler = handler;
    }

    async handle(req: express.Request, res: express.Response) {
        const clientData : ClientData = req.body;
        const eventList : Event[] = await this.submitHandler.getLatestEvents(`modules${clientData.username.toUpperCase()}`);

        let result = [];
        for (let event of eventList){
            const moduleDTO : ModuleDTO = event.payload;
            if (event.state === 'registered'){
            result.push({moduleid: moduleDTO.id, buttonid: moduleDTO.buttonID});
            }
        }
        res.json(result);
    }

}