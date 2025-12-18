import taskInstance from "../models/taskArray.js"; // Import taskInstance

export default function updateTaskArray(element) {
    // Sync logs
    taskInstance.syncActivityLog();

    // Get array
    const task = taskInstance.getArray();


    // Create lookup map for wTask
    // Update task array using map lookups
    task.forEach((ele,index) => {
        if (element.filename==ele.filename) {
                Object.assign(ele,element);
        }
    });
    taskInstance.saveTaskData();
}