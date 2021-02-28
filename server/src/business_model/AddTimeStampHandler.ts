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


interface ClientData {
    date: string,
    module: string,
    rectime: number,
    username: string
}

export default class AddTimeStampHandler {


    async handle(req: express.Request, res: express.Response) {
        const clientData: ClientData = req.body;
        console.log(`got clientData \n${JSON.stringify(clientData, null, 2)}`);

        const timeStampDTO: TimeStampDTO = {
            id: uuidv4(),
            date: clientData.date,
            module: clientData.module,
            recordedTime: clientData.rectime
        }

        let user = clientData.username.toUpperCase();
        const event: Event = {
            topic: `timestamps${user}`,
            id: timeStampDTO.id,
            date: new Date().toISOString(),
            state: 'created',
            payload: timeStampDTO
        }

        await submitHandler.handlers.get('timestamps').handle(event);

        const result = {
            status: 'OK',
            clientData,
        }

        res.json(result);
    }

}