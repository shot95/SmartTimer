import Module from "./Module";



export interface TimeStampDTO {
    id: string,
    date: string;
    module: string;
    recordedTime:number;
}

export default class TimeStamp {
    id: string = '';
    date: string = '';
    module: Module;
    recordedTime:number = 0;
}