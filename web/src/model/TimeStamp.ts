import Module from "./Module";



export interface TimeStampDTO {
    id: string ;
    date: string;
    module: string;
    recordedTime:number;
}

export default class TimeStamp {
    id: string = '';
    date: string = '';
    module: Module = new Module();
    recordedTime:number = 0;
}