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
        const user = clientData.username.toUpperCase();

        var clientDate = new Date(clientData.date)
        const timeToFillUpHour = 60 - clientDate.getUTCMinutes()

        if (timeToFillUpHour * 60 >= clientData.rectime) {
            const lowertimeStampDTO: TimeStampDTO = {
                id: uuidv4(),
                date: clientDate.toISOString(),
                module: clientData.module,
                recordedTime: clientData.rectime
            }
            const lowerevent: Event = {
                topic: `timestamps${user}`,
                id: lowertimeStampDTO.id,
                date: new Date().toISOString(),
                state: 'created',
                payload: lowertimeStampDTO
            }

            await submitHandler.handlers.get('timestamps').handle(lowerevent);
        } else {
            const filluptimeStampDTO: TimeStampDTO = {
                id: uuidv4(),
                date: clientDate.toISOString(),
                module: clientData.module,
                recordedTime: timeToFillUpHour * 60
            }

            const fillupevent: Event = {
                topic: `timestamps${user}`,
                id: filluptimeStampDTO.id,
                date: new Date().toISOString(),
                state: 'created',
                payload: filluptimeStampDTO
            }

            await submitHandler.handlers.get('timestamps').handle(fillupevent);
            const fillupnewtime = clientDate.getTime() + 1000 * 60 * timeToFillUpHour
            clientDate = new Date(fillupnewtime)

            const fullHours = Math.floor((clientData.rectime - timeToFillUpHour * 60 ) / (60 * 60))
            const restTime = (clientData.rectime - timeToFillUpHour * 60 ) % (60 * 60)
            for (var h = 0; h < fullHours; h++) {
                const innertimeStampDTO: TimeStampDTO = {
                    id: uuidv4(),
                    date: clientDate.toISOString(),
                    module: clientData.module,
                    recordedTime: 60 * 60
                }

                const innerevent: Event = {
                    topic: `timestamps${user}`,
                    id: innertimeStampDTO.id,
                    date: new Date().toISOString(),
                    state: 'created',
                    payload: innertimeStampDTO
                }

                await submitHandler.handlers.get('timestamps').handle(innerevent);
                const newtime = clientDate.getTime() + 1000 * 60 * 60
                clientDate = new Date(newtime)
            }

            const timeStampDTO: TimeStampDTO = {
                id: uuidv4(),
                date: clientDate.toISOString(),
                module: clientData.module,
                recordedTime: restTime
            }

            const event: Event = {
                topic: `timestamps${user}`,
                id: timeStampDTO.id,
                date: new Date().toISOString(),
                state: 'created',
                payload: timeStampDTO
            }

            await submitHandler.handlers.get('timestamps').handle(event);
        }

        const result = {
            status: 'OK',
            clientData,
        }

        res.json(result);
    }

}