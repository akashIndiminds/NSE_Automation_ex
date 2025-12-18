import taskInstance from "../models/taskArray.js";
import getTask from "../utils/getTask.js";
import HttpError from "../utils/HttpError.js";



async function addTask(taskObj){
    try {
        const task = taskInstance.getArray();
        taskObj.map((element) =>{
            const payload = getTask(element);
            task.push(payload);
        });
    return true;
    } catch (error) {
        throw new HttpError("cannot add task wrong format",500);
    }
    
}

export default addTask;