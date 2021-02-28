import express, { response } from 'express';
import Event from '../model/Event';
import ModelCommandHandler from '../model/ModelCommandHandler';
import ModelEditor from '../model/ModelEditor';
import { Pool } from 'pg';
import axios from 'axios';
import ModuleCommandHandler from '../model/ModuleCommandHandler';
import TimeStampCommandHandler from '../model/TimeStampCommandHandler';

export default class SubmitHandler {
    readonly shopSubmit = 'http://localhost:34570/api/submit';
    readonly warehouseQuery = 'http://localhost:34560/api/query';


    handlers: Map<string, ModelCommandHandler> = new Map();

    eventStore: Map<string, Map<string, Event[]>> = new Map();

    modelEditor: ModelEditor = new ModelEditor();

    constructor() {
        this.handlers.set('modules', new ModuleCommandHandler(this));
        this.handlers.set('timestamps', new TimeStampCommandHandler(this));
    }

    async start() {
        await this.createDatabase();
        await this.createEventTable();


    }

    async createDatabase() {
        const connectionString = 'postgresql://postgres:admin@localhost:5432/';
        const pool = new Pool({
            connectionString,
        });
        try {
            const res = await pool.query('CREATE DATABASE timestampdb');
            console.log('timestampdb created');
        } catch (e) {
            console.log('Database already exists');
        }
        await pool.end();
    }

    async createEventTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS events (
            topic varchar NOT NULL,
            id varchar NOT NULL,
            storetime varchar NOT NULL,
            json varchar NOT NULL,
            PRIMARY KEY (topic, id)
        );`
        const connectionString = 'postgresql://postgres:admin@localhost:5432/timestampdb';
        const pool = new Pool({
            connectionString,
        });
        try {
            const res = await pool.query(sql);
            console.log('events table created in timestampdb');
        } catch (e) {
            console.log('error in createEventTable in SubmitHandler');
        }
        await pool.end();
    }

    async handle(req: express.Request, res: express.Response) {
        const clientData = req.body;
        console.log(`got clientData \n${JSON.stringify(clientData, null, 2)}`);

        const event: Event = clientData;

        let topic = event.topic;
        let index = topic.length;
        for (let i = 0; i < topic.length; i++) {
            if (topic.charCodeAt(i) < 91 && topic.charCodeAt(i) > 64){
                index = i;
                break;
            }
        }

        topic = topic.substring(0,index);

        const handler = this.handlers.get(topic);
        await handler.handle(event);

        const result = {
            status: 'OK',
            clientData,
        }

        res.json(result);
    }

    async getEventHistory(topic: string, id: string): Promise<Event[]> {
        const eventList: Event[] = [];

        const sql = `
        SELECT topic, id, storetime, json
        FROM events
        WHERE topic='${topic}' AND id='${id}';`;

        const connectionString = 'postgresql://postgres:admin@localhost:5432/timestampdb';
        const pool = new Pool({
            connectionString,
        });

        try {
            const res = await pool.query(sql);
            //console.log(`\n\nROWS:\n${JSON.stringify(res.rows, null, 3)}\n\n`);
            for (const row of res.rows) {
                const jsonString = row.json;
                const event: Event = JSON.parse(jsonString);
                eventList.push(event);
            }
            console.log('get Events done');
        } catch (e) {
            console.log('error in geteventhistory in SubmitHandler');
            console.log(e);
        }

        await pool.end();

        return eventList;
    }

    async putIntoEventStore(event: Event) {
        const connectionString = 'postgresql://postgres:admin@localhost:5432/timestampdb';
        const pool = new Pool({
            connectionString,
        });

        try {
            const sql = `
        INSERT INTO events (topic, id, storetime, json)
        VALUES ('${event.topic}', '${event.id}', 'today', '${JSON.stringify(event, null, 2)}');`;

            const res = await pool.query(sql);
            console.log('insert event done');
        } catch (e) {
            const sql = `
        UPDATE events
        SET storetime='today', json='${JSON.stringify(event, null, 2)}'
        WHERE topic='${event.topic}' AND id='${event.id}';`;

            console.log(`insert error in putIntoEventStore in SubmitHandler trying update: ${JSON.stringify(event, null, 2)}`);

            try {
                const res = await pool.query(sql);
                console.log('update event done');
            } catch (e) {
                console.log('Error in update event in putintoeventstore in submithandler');
            }
        }

        await pool.end();
    }

    async getLatestEvents(topic: string): Promise<Event[]> {
        const eventList: Event[] = [];

        const sql = `
        SELECT topic, id, storetime, json
        FROM events
        WHERE topic='${topic}';`;

        const connectionString = 'postgresql://postgres:admin@localhost:5432/timestampdb';
        const pool = new Pool({
            connectionString,
        });

        try {
            const res = await pool.query(sql);
            //console.log(`\n\nROWS:\n${JSON.stringify(res.rows, null, 3)}\n\n`);
            for (const row of res.rows) {
                const jsonString = row.json;
                const event: Event = JSON.parse(jsonString);
                eventList.push(event);
            }
            console.log('get Events done');
        } catch (e) {
            console.log('error in getlatestevents in SubmitHandler');
            console.log(e);
        }

        await pool.end();

        return eventList;
    }

    static lastStoreTime = "1970";

    static getNewStoreTime() {
        const newTime = new Date().toISOString();
        if (newTime <= SubmitHandler.lastStoreTime) {
            let timeMillis = new Date(this.lastStoreTime).getUTCMilliseconds();
            timeMillis++;
            SubmitHandler.lastStoreTime = new Date(timeMillis).toISOString();
            return this.lastStoreTime;
        } else {
            SubmitHandler.lastStoreTime = newTime;
            return newTime;
        }
    }


    async getEventsSince(topic: string, lastknown: string): Promise<Event[]> {
        const eventList: Event[] = [];
        const connectionString = 'postgresql://postgres:admin@localhost:5432/timestampdb';
        const pool = new Pool({
            connectionString,
        });

        const sql = `
        SELECT topic, id, storetime, json
        FROM events
        WHERE topic=$1 and storetime >= $2;`
        try {
            const res = await pool.query(sql, [topic, lastknown]);
            for (const row of res.rows) {
                const jsonString = row.json;
                const event = JSON.parse(jsonString);
                eventList.push(event);
            }
        } catch (error) {
            console.log(error);
            console.log('sorry form geteventssince');
        }
        await pool.end();

        return eventList;
    }

}