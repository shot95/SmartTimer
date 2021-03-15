import TimeStamp from "./TimeStamp";



export interface ModuleDTO {
    id: string ;
    name: string ;
    buttonID: string ;
    sumTime:number;
}

export default class Module {
    id: string = '';
    name: string = '';
    buttonID: string = '';
    timeStamps: TimeStamp[] = [];
    sumTime:number = 0;
}