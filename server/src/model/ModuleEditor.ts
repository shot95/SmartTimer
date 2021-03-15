import Module, { ModuleDTO } from "./Module";

export default class ModuleEditor {

    private modules: Map<string, Module> = new Map();

    haveModule(moduleDTO: ModuleDTO) : Module{
        const module: Module = this.getOrCreateModule(moduleDTO.id);
        module.name = moduleDTO.name;
        module.buttonID = moduleDTO.buttonID;
        module.sumTime = moduleDTO.sumTime;
        module.timeStamps = [];

        return module;
    }

    removeModule(id: string){
        const module = this.modules.get(id);
        if(module){
            this.modules.delete(id);
        }
    }

    getOrCreateModule(id: string) : Module {
        let module = this.modules.get(id);

        if (!module){
            module = new Module();
            module.id = id;
            this.modules.set(module.id, module);
        }
        return module;
    }

    getFromModules(id: string) : Module {
        return this.modules.get(id);
    }

}