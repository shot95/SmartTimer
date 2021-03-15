import ModuleEditor from "./ModuleEditor";
import TimeStamp, { TimeStampDTO } from "./TimeStamp";

export default class TimeStampEditor {

    private timeStamps: Map<string, TimeStamp> = new Map();
    
    moduleEditor: ModuleEditor;

    constructor(moduleEditor: ModuleEditor){
        this.moduleEditor = moduleEditor;
    }

    haveTimeStamp(timeStampDTO: TimeStampDTO) : TimeStamp{
        const timeStamp: TimeStamp = this.getOrCreateTimeStamp(timeStampDTO.id);
        timeStamp.date = timeStampDTO.date;
        timeStamp.module = this.moduleEditor.getOrCreateModule(timeStampDTO.module);
        timeStamp.recordedTime = timeStampDTO.recordedTime;

        return timeStamp;
    }

    removeTimeStamp(id: string){
        const timeStamp = this.timeStamps.get(id);
        if(timeStamp){
            this.timeStamps.delete(id);
        }
    }

    getOrCreateTimeStamp(id: string) : TimeStamp {
        let timeStamp = this.timeStamps.get(id);

        if (!timeStamp){
            timeStamp = new TimeStamp();
            timeStamp.id = id;
            this.timeStamps.set(timeStamp.id, timeStamp);
        }
        return timeStamp;
    }

    getFromTimeStamps(id: string) : TimeStamp {
        return this.timeStamps.get(id);
    }

}