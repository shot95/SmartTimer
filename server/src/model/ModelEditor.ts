import ModuleEditor from "./ModuleEditor";
import TimeStampEditor from "./TimeStampEditor";

export default class ModelEditor {

    moduleEditor: ModuleEditor;
    timeStampEditor: TimeStampEditor;

    constructor() {
        this.moduleEditor = new ModuleEditor();
        this.timeStampEditor = new TimeStampEditor(this.moduleEditor);
    }

}