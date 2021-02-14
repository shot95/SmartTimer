import SubmitHandler from '../business_model/SubmitHandler';
import Event from './Event';

export default class ModelCommandHandler {
    submitHandler: SubmitHandler;

    constructor(handler: SubmitHandler) {
        this.submitHandler = handler;
    }

    async handle(event: Event) {
        throw new Error("not implementet");
    }
}