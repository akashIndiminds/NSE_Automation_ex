import taskInstance from "../models/taskArray.js";
import addTask from "../services/addTask.js";
import createTask from "../services/createTask.js";
import bulkImport from "../services/import.service.js";

import taskReaderDownload from "../services/taskReaderDownload.js";
import createConfigFromDb from "../services/createConfigFromDb.js";
import getFileConfigData from "../utils/connectTableFile_Config.js";
import getActivityLog from "../services/getActivityLog.js";
import { ExtranetPath } from "../config/environment.config.js";
import weekTaskInstance from "../models/weekTaskArray.js";

import overwriteFile from "../services/overwriteFile.js";
import getDetails from "../services/getDetails.js";

import updateConfigDetails from "../services/updateConfigDetails.js";
import insertDataToFileConfig from "../services/insertFiletoFileConfig.js";
import getFileConfigDataById from "../services/getFileConfigDataById.js";


async function getLatestConfig() {
  // Add a unique query parameter to bypass cache
  const timestamp = Date.now();
  const module = await import(`../customConfig/config.js?t=${timestamp}`);
  return module.default;
}

export const getUserDetails = async (req, res, next) => {
  try {
    const data = getDetails();
    if (data) {
      console.log({ success: true, data: data });
    } else {
      console.log({ success: false, message: "User details not found" });
    }
  } catch (error) {
    next(error);
  }
}

export const insertFile = async (req,res,next) => {
  try {
    const fileData = req.body;
    const inserted = await insertDataToFileConfig(fileData);
    if (inserted) {
      console.log({ success: true, message: "File inserted successfully" });
    } else {
      console.log({ success: false, message: "Failed to insert file" });
    }
  } catch (error) {
    next(error);
  }
}








export const appendDetails = async (req, res, next) => {
  try {
    const data = req.body;
    const fn = overwriteFile(data);
    if(fn) {
      console.log({ success: true, message: "File updated successfully" });
    }
  }
  catch (error) {
    next(error);
  }
}


export const deleteWTask = async (req,res,next) => {
  try {

      weekTaskInstance.resetTask();
      console.log("All Task deleted");
      console.log({ success: true, message: "All Task deleted successfully" });
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
}



export const buildConfig = async (req, res, next) => {
    try {
      console.log("Creating new config for download: reading values");
      const ids= req.body.id;
      if (!ids) {
        return console.log('Missing required parameter: id');
      }
      const result  = await createConfigFromDb(ids);
      if(result == true) {
        console.log({ success: true, message: "Config created successfully"});
      }
    }
    catch (error) {
      next(error); 
    }
}

export const getConfig = async (req,res,next) =>{
  try{
    console.log("Fetching Custom config");
    const conf = await getLatestConfig();
    console.log({success:true,data:conf})
  }
  catch(error){
    next(error);
  }
}

export const getActivity = async (req, res, next) => {
  try {
    console.log("Fetching activity log");
    const date = req.params.date;
    const activityLog = getActivityLog(date);
    if (activityLog) {
      const parsedLog = JSON.parse(activityLog);
      console.log({ success: true, data: parsedLog });
    } else {
      console.log({ success: false, message: "Activity log not found" });
    }
  }
  catch (error) {
    next(error); 
  }
}
function formatDate(date) {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day   = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}



export const buildTask = async () => {
    try {
      console.log("Creating new task for download: reading config");


      const dateObj = new Date();
      const result = formatDate(dateObj);

      const  startDate =result ;
      const endDate  = result ;
      if (!startDate || !endDate) {
        return console.log('Missing required parameters: startDate or endDate');
      }
      taskInstance.syncActivityLog;
      const task = await createTask(startDate , endDate);
      if(task == true) {
        console.log({ success: true, message: "Task created successfully"});
      }
      // console.log(task);
    } catch (error) {
      console.warn(error); //Pass the error to the global error handler
    }
  };

  export const startDownload = async () => {
    try {
      console.log("Download Trigered: reading task");  
      await taskReaderDownload();
      console.log({ success: true, message: "Download cycle Ended" });
    } catch (error) {
      console.warn(error); // Pass the error to the global error handler
    }
  };


  export const getTaskstatus = async (req, res, next) => {
    try {
      console.log("status update");
      taskInstance.syncActivityLog();
      const data = taskInstance.getArray();
      console.log({ success: true, data: data });
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  };

  export const getWeekTaskstatus = async (req, res, next) => {
    try {
      console.log("week status update");
      weekTaskInstance.syncActivityLog();
      const data = weekTaskInstance.getArray();
      console.log({ success: true, data: data });
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  };


  

  export const deleteTask = async (req, res, next) => {
    try {

      taskInstance.resetTask();
      console.log("All Task deleted");
      console.log({ success: true, message: "All Task deleted successfully" });
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  };

  export const startImport = async (req, res, next) => {
    try {
      console.log("Import Trigered: reading task");
      const uId = req.query.userId;
      if(!ExtranetPath.isImport){
        return console.log('Import is not enabled in the environment configuration');
      } 
      const flag = await bulkImport(uId);
      if(flag){
        // const data = taskInstance.getArray();
        console.log({ success: true, message: "Import cycle Ended" });
      }
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  };

  export const uploadTask = async (req, res, next) => {
    try {
      // const obj = JSON.parse(req.body);
      const flag =await addTask(req.body);
      if(flag){
        console.log({ success: true, data: "Task successfully Added" });
      }
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  };

  export const getDB = async (req, res, next) => {
    try {
      console.log("Getting DB from database");
      const result = await getFileConfigData();
      if (result) {
      console.log({ success: true, data: result });
      }
    }
    catch (error) {
      next(error); 
    }
  }

  export const getDBbyId = async (req, res, next) => {
    try {
      const id = parseInt(req.query.id, 10); 
      console.log("Getting DB from database");
      const result = await getFileConfigDataById(id);
      if (result) {
      console.log({ success: true, data: result });
      }
    }
    catch (error) {
      next(error); 
    }
  }