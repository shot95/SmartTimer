import express from 'express';
import cors from 'cors';
import SubmitHandler from './business_model/SubmitHandler';
import QueryHandler from './business_model/QueryHandler';
import AddTimeStampHandler from './business_model/AddTimeStampHandler';
import SyncHandler from './business_model/SyncHandler';

export const submitHandler = new SubmitHandler();
const queryHandler = new QueryHandler(submitHandler);
const addTimeStampHandler = new AddTimeStampHandler();
const syncHandler = new SyncHandler(submitHandler);

export const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.options("*", cors());

export const port = 34560;

app.post("/api/submit", async (req:express.Request, res:express.Response) => {
    await submitHandler.handle(req,res);
});

app.post("/api/query", async (req:express.Request, res:express.Response) => {
    await queryHandler.handle(req,res);
});

app.post("/api/addtimestamp", async (req:express.Request, res:express.Response) => {
    await addTimeStampHandler.handle(req,res);
});

app.post("/api/sync", async (req:express.Request, res:express.Response) => {
    await syncHandler.handle(req,res);
});

app.get("/", (req, res) => {
    res.send('Welcome to timestamp Server!');
})