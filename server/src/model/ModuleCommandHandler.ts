import SubmitHandler from "../business_model/SubmitHandler";
import ModelCommandHandler from "./ModelCommandHandler";
import Event from './Event';
import { ModuleDTO } from "./Module";
//import ProductDTO from './Product';

export default class ModuleCommandHandler extends ModelCommandHandler {

    constructor(handler: SubmitHandler) {
        super(handler);
    }

    async handle(event: Event) {
        const eventList = await this.submitHandler.getEventHistory(event.topic, event.id);

        // mergen
        if (eventList.length > 0){
            const oldEvent = eventList[eventList.length-1];
            if (oldEvent.date >= event.date) {
                return;
            }
        }

        const payload: ModuleDTO = event.payload;

        if (event.state === 'created') {
            // register new product
            this.submitHandler.modelEditor.moduleEditor.haveModule(payload);
            await this.submitHandler.putIntoEventStore(event);
            // change state to registered
            const newEvent: Event = {
                topic: event.topic,
                id: payload.id,
                date: new Date().toISOString(),
                state: 'registered',
                payload,
            }
            await this.submitHandler.putIntoEventStore(newEvent);
        } else if (event.state === 'unregistered'){
            this.submitHandler.modelEditor.moduleEditor.removeModule(event.id);
            await this.submitHandler.putIntoEventStore(event);
        }
    }
}