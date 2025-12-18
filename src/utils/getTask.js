
import TaskModel from "../models/taskModel.js";
import HttpError from "./HttpError.js";


 const getTask = (obj) => {
    try {
      const {  dir , segment , folderPath , filename , spName , spParam , spParamValue ,filepath ,filetype,ePath,reserved,taskId,date ,id} = obj;
      return new TaskModel( dir , segment , folderPath , filename , spName , spParam , spParamValue , filepath ,filetype, ePath,reserved,taskId,date,id);
    } catch (error) {
      throw new HttpError(`Validation Error: ${error.message}`, 400);
    }
  };

  export default getTask;

