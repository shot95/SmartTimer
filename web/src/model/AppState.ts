import Query from "./Query";
import axios from 'axios';
import Event from "./Event";
import TimeStamp, { TimeStampDTO } from "./TimeStamp";
import Module, { ModuleDTO } from "./Module";


export default class AppState {

  modules: Map<string,Module> = new Map();
  userName: string = '';
  date: string = '';

  constructor(){
    this.getTimeStampsFor = this.getTimeStampsFor.bind(this);
    this.haveModule = this.haveModule.bind(this);
    this.getOrCreateModule = this.getOrCreateModule.bind(this);
    this.removeModule = this.removeModule.bind(this);
    this.loadModulesFromServer = this.loadModulesFromServer.bind(this);
    this.getModulesAsList = this.getModulesAsList.bind(this);
    this.loadTimeStampsFromServer = this.loadTimeStampsFromServer.bind(this);
    this.getFromModules = this.getFromModules.bind(this);
  }

  getModulesAsList(){
    let res : Module[] = [];
    this.modules.forEach((val, key, map) => {
      res.push(val);
    });
    return res;
  }

  getTimeStampsFor(module: string) {
    let timestamps = this.modules.get(module)?.timeStamps;
    if (timestamps){
      return timestamps;
    } else {
      return [];
    }
  }

  haveModule(id: string, name: string, buttonID: string, timeStamps: TimeStamp[] = [], sumTime:number = 0) {
    let module = this.getOrCreateModule(id);

    module.name = name;
    module.buttonID = buttonID;
    module.timeStamps = timeStamps;
    module.sumTime = sumTime;

    return module;
  }

  getFromModules(id: string){
    return this.modules.get(id);
  }

  getOrCreateModule(id: string) {
    let module = this.modules.get(id);
    if (!module) {
      module = new Module();
      module.id = id;
      this.modules.set(id, module);
    }
    return module;
  }

  removeModule(id: string){
    let tmp = this.modules.get(id);
    if(tmp){
      this.modules.delete(id);
    }
  }

  async loadModulesFromServer(userName: string){
    console.log(`loadModulesFromServerCalled: name: ${userName}`);
    if (userName === '') return;
    let tmp = userName.toUpperCase();
    const query : Query = {
      topic: `modules${tmp}`,
    }
    console.log(`topic: ${query.topic}`)
    const response = await axios.post("http://localhost:34560/api/query", query);
    const data = response.data;
    for (const entry of data.eventList){
      const event : Event = entry;
      const moduleDTO : ModuleDTO = event.payload;
      if (event.state === "unregistered"){
        this.removeModule(moduleDTO.id);
      } else {
        this.haveModule(moduleDTO.id, moduleDTO.name, moduleDTO.buttonID);
      }
    }
  }

  async loadTimeStampsFromServer(userName: string){
    if (userName === '') return;
    await this.loadModulesFromServer(userName);
    const query : Query = {
      topic: `timestamps${userName.toUpperCase()}`,
    }
    const response = await axios.post("http://localhost:34560/api/query", query);
    const data = response.data;
    for (const entry of data.eventList){
      const event : Event = entry;
      const timeStampDTO : TimeStampDTO = event.payload;
      if (event.state === "unregistered"){
        this.removeModule(timeStampDTO.id);
      } else {
        const tmp = this.getOrCreateModule(timeStampDTO.module);
        const tmp3 = tmp.timeStamps.filter((ts) => ts.id === timeStampDTO.id)
        if (tmp3.length > 0){
          tmp.timeStamps = tmp.timeStamps.filter((ts) => ts.id !== timeStampDTO.id)
        } else {
        tmp.sumTime += timeStampDTO.recordedTime;
        }
        const timeStamp = new TimeStamp();
        timeStamp.id = timeStampDTO.id;
        timeStamp.date = timeStampDTO.date;
        timeStamp.module = tmp;
        timeStamp.recordedTime = timeStampDTO.recordedTime;


        tmp.timeStamps.push(timeStamp);
      }
    }
  }
}