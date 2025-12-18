import weekTaskInstance from "../models/weekTaskArray.js";

function getPendingTasksList() {
    const wTask = weekTaskInstance.getArray();
    const result = [];
    wTask.map((element)=>{
        const date = new Date(element.createdTime);
        const today = new Date();
        if ((element.dlStatus !=200 || typeof element.spStatus==='number') && date!== today){
            result.push(element);
        }
    });
    return result;
}

export default getPendingTasksList;