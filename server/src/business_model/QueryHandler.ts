import express from 'express';
import Event from '../model/Event';
import { ModuleDTO } from '../model/Module';
import Query from '../model/Query';
import SubmitHandler from './SubmitHandler';

interface Reply {
    eventList: any[],
}

export default class QueryHandler {

    submitHandler: SubmitHandler;

    constructor(handler: SubmitHandler){
        this.submitHandler = handler;
    }

    async handle(req: express.Request, res: express.Response) {
       const query = req.body;
       const topic = query.topic;

       if (! topic) {
           res.send('{"eventList": []}');
           return;
       }

       const result: Reply = {
           eventList: await this.submitHandler.getLatestEvents(topic),
       }

       /*const moduleDTO : ModuleDTO = {
        id: "m1",
         name: 'testmodule',
         buttonID: "1", 
         sumTime: 0,
       }

       const event: Event = {
        topic: 'modules',
         id: '1', 
         date: 'today', 
         state: 'registered',
          payload: moduleDTO,
       }

       const result: Reply = {
           eventList: [event]
       }*/


       //console.log(`Queryhandler sends: ${JSON.stringify(result.eventList, null, 2)}`);
       res.json(result);
    }

    answer(res: express.Response, clientData: any){
        const query: Query = clientData;
        const topic = query.topic;

        const emptyList: Reply = {
           eventList: [],
        };

        res.send(emptyList);
    }

}