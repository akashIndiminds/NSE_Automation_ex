
import getTask from "../utils/getTask.js";
import HttpError from "../utils/HttpError.js"; // Custom error class for HTTP errors
import generateFileNames from "./generateFileNames.service.js"; // Service to generate file names based on input dates
import taskInstance from "../models/taskArray.js";
import weekTaskInstance from "../models/weekTaskArray.js";
import server_config from "../config/server.config.js";
import createTaskId from "../utils/createTaskId.js";
//import loadConfig from "../utils/loadConfig.js";
//import finalConfig from "../customConfig/config.js";
//import finalConfig from "../../testing.js";

import path from 'path';

import pLimit from "p-limit"; // Library to control concurrency (install with npm install p-limit)
import updateTaskArray from "../utils/updateTaskArray.js";

async function getLatestConfig() {
  // Add a unique query parameter to bypass cache
  const timestamp = Date.now();
  const module = await import(`../customConfig/config.js?t=${timestamp}`);
  return module.default;
}




// Define a concurrency limit for simultaneous tasks
const limit = pLimit(50); // Change the limit as needed based on system capacity

/**
 * Function to start bulk download of files within a date range.
 * @param {string} startDate - Start date for the file range.
 * @param {string} endDate - End date for the file range.
 * @param {string} Token - Authentication token for API requests.
 * @returns {Promise<Array>} - List of files that failed to download, with reasons.
 */
async function createTask(startDate, endDate ) {
  taskInstance.syncActivityLog();
  taskInstance.resetTask();

  weekTaskInstance.syncActivityLog();
  
  const task = taskInstance.getArray();
  const wTask = weekTaskInstance.getArray();

  try {
    const finalConfig =await getLatestConfig();
    const file_config = finalConfig//await loadConfig(); 
    const Dir = Object.keys(file_config); // Get directory names from config

    // Iterate over each directory in the config
    for (const dirName of Dir) {

      
      const segments = file_config[dirName]; // Get segment details for the directory
      const segmentNames = Object.keys(segments); 


      for (const segment of segmentNames){

        const folders = segments[segment]; // Get folder details for the directory
        const folderNames = Object.keys(folders); // Get list of folder names
        // Iterate over each folder within the directory
        for (const folder of folderNames) {
          const folderObj = folders[folder]; // Get folder configuration

          const _segment = segment; // Extract segment information
          // const _childPath = folderObj.childPath;
          // Generate file names for the given date range
         // console.log(_segment)
          const generatedFileNames = await generateFileNames(startDate, endDate, folderObj);
          //console.log(generatedFileNames);
  
          // Process each file with concurrency control
          await Promise.all(
            generatedFileNames.file_name.map((element, index) =>
              limit(async () => {
                let fullpath = '';
                let temp = element.split('~');
                if(temp[5] == 'E'){
                    fullpath = path.resolve(server_config.ePath);
                }else {
                    fullpath = '';
                }
                //console.log(temp[7]); to access the id inside the database
                let taskID = createTaskId();
                const obj = {
                  dir: dirName,
                  segment: _segment,
                  folderPath: `/${folder}/${temp[4]}`,
                  filename: temp[0],
                  spName: temp[1],
                  spParam: temp[2],
                  spParamValue: temp[3],
                  filetype: temp[5],
                  filepath: `${server_config.nPath}`,
                  ePath: fullpath,
                  reserved: temp[6],
                  taskId:taskID,
                  date: temp[8],
                  id: temp[7]
                };
                const taskPayload = getTask(obj);
                task.push(taskPayload);
                const taskFilename = taskPayload.filename;
                const existsItem = wTask.find(item => item.filename === taskFilename);
                if (!existsItem){
                  wTask.push(taskPayload);
                }
                else {
                  updateTaskArray(existsItem);
                }
              })
            )
          );
        }

      }


    }

    // Return the list of files that failed to download
    return true;
  } catch (error) {
    // Catch any error that occurs during the bulk download process
    console.error(`Error in initializing synchronization: ${error.message}`);
    throw new HttpError(`Error in initializing synchronization: ${error.message}`, 500);
  }finally{
    taskInstance.saveTaskData();
    weekTaskInstance.saveTaskData();
  }
}

// const result = await createTask( '2024-12-1' , '2024-12-7' );
// console.log(result);

export default createTask;
