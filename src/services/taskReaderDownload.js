import server_config from "../config/server.config.js";
import userInstance from "../models/User.model.js";
import decompress from "../utils/decompress.js";
import { downloadFile } from "../utils/downloadFile.js"; // Function to download files
import getDownloadPayload from "../utils/getdownloadPayload.js"; // Generates payload for download
import HttpError from "../utils/HttpError.js"; // Custom error class for HTTP errors
import { saveFile } from "../utils/saveFile.js"; // Function to save files to disk
import taskInstance from "../models/taskArray.js";
import weekTaskInstance from "../models/weekTaskArray.js";
import handleIncrementFiles from "../utils/handleIncrementFiles.js";
import updateTaskArray from "../utils/updateTaskArray.js";
import getNotifiedFilesList from "./getNotifiedFiles.js";
import { getIO } from "../../socket.js";

import pLimit from "p-limit"; // Library to control concurrency (install with npm install p-limit)

// Define a concurrency limit for simultaneous tasks
const limit = pLimit(10); // Change the limit as needed based on system capacity

/**
 * Function to start bulk download of files within a date range.
 * @param {string} startDate - Start date for the file range.
 * @param {string} endDate - End date for the file range.
 * @param {string} Token - Authentication token for API requests.
 * @returns {Promise<Array>} - List of files that failed to download, with reasons.
 */
async function taskReaderDownload() {
  weekTaskInstance.syncActivityLog();
  taskInstance.syncActivityLog();
  const task = taskInstance.getArray();
  const wTask =weekTaskInstance.getArray();
  const user=userInstance.getUserData();
  if(userInstance.isExpired()){
    throw new HttpError("Token has expired, login required",314);
  }
  const Token = user.token;
  try {
    // Process each file with concurrency control

    await Promise.all(
      wTask.map((element) =>
        limit(async () => {
        let flag = false;
        let _element ;
        let copyElement = Object.assign({}, element);
        if (element.filetype.startsWith('I')) {
         _element = handleIncrementFiles(copyElement);
         element.spStatus = _element.spStatus;
         element.dlStatus = _element.dlStatus;
        //  console.log(_element.filetype);
         console.log(_element.filename);
         element.filetype = _element.filetype;
         flag = true;
        }

        if(element.dlStatus != 200){
          let obj;
          if (flag){
             obj = {
              token: Token,
              dir: element.dir,
              segment: element.segment,
              folderPath: element.folderPath,
              filename: _element.filename,
            };

          }
          else {
           obj = {
            token: Token,
            dir: element.dir,
            segment: element.segment,
            folderPath: element.folderPath,
            filename: element.filename,
          };
        }

          const messagePayload = getDownloadPayload(obj); // Generate payload for downloading the file
          // console.log(messagePayload);
          try {
            // Attempt to download the file
            const fileData = await downloadFile(messagePayload,element);

            if (fileData instanceof HttpError) {
              // Handle HTTP error case
              element.dlStatus=fileData.statusCode;
              console.error(`Failed to download: ${element.filename}, Reason: ${fileData.statusCode}`);
            } else {
              

              // Save the file to the local directory if download is successful
              const saveDirectory = `${server_config.nPath}/${messagePayload.dir}/${messagePayload.segment}/${messagePayload.folderPath}`;
              const spDirectory = `${server_config.lPath}/${messagePayload.dir}/${messagePayload.segment}/${messagePayload.folderPath}`;
              const filepath = await saveFile(messagePayload.filename, saveDirectory, fileData, spDirectory);
              element.filepath=  filepath[0] || 404;
              element.spPath= filepath[1] || 404;
              element.dlStatus=200;
              const newFilePath = await decompress(element.filepath,element.spPath);
              element.spPath = await newFilePath;
            }
            weekTaskInstance.saveTaskData();
            updateTaskArray(element);
          } catch (error) {
            // Catch unexpected errors during the download process
            console.error(`Error processing file  ${error.message}`);
          }
        }//end of if
        })//end of limit
      )
    );


  } catch (error) {
    // Catch any error that occurs during the bulk download process
    console.error(`Error in initializing synchronization: ${error.message}`);
    throw new HttpError(`Error in initializing synchronization: ${error.message}`, 404);
  } finally{
    taskInstance.saveTaskData();
    weekTaskInstance.saveTaskData();
  }
}



export default taskReaderDownload;
