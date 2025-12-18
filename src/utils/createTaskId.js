
import weekTaskInstance from "../models/weekTaskArray.js";

export default function createTaskId() {
    const wTask = weekTaskInstance.getArray()
    if(wTask.length == 0){
        return 1;
    }
    const finalId =wTask[wTask.length-1].taskId+1;
    return finalId;
}