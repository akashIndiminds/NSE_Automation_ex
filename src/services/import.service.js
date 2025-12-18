import {callSP, closePool,initializePool,callSPforxml} from "../../connection.js";
import taskInstance from "../models/taskArray.js";
import weekTaskInstance from "../models/weekTaskArray.js";
import HttpError from "../utils/HttpError.js"; // Custom error class for HTTP errors
import toXML from "../utils/toXML.js"; // Function to convert data to XML format
import updateTaskArray from "../utils/updateTaskArray.js";
import { getIO } from "../../socket.js";
import getNotifiedFilesList from "./getNotifiedFiles.js";
import getLocalSQLDateTime from "../utils/toLocalISOString.js";
import ifTradeFileImported from "../utils/ifTradeFileImported.js"

async function bulkImport(uId){
  const task=taskInstance.getArray();
  const wTask=weekTaskInstance.getArray();
  try {
    if(!wTask[0]){
      return true;
    }
    const notificationArray = await getNotifiedFilesList(uId);
     await initializePool();
    const result = await Promise.all(wTask.map(async (element) => {
      if(element.filename.startsWith("Trade_NSE")) {
        ifTradeFileImported(element);
      }
      const todayDate = new Date(element.createdTime.replace(' ', 'T'));
      const dlDate = new Date(element.dlTime.replace(' ', 'T'));
      const condition = getDateOnly(todayDate) === getDateOnly(dlDate);
      if (element.spStatus === 404 && element.dlStatus === 200 && condition ) {
          let now = new Date();
          element.lastModified = getLocalSQLDateTime(now);
          const types = element.filetype.split('/');
          let value = await callSP(element.spPath, element.spName, element.spParam, element.spParamValue,types[0],element.filename,element);
          if(value && notificationArray.includes(Number(element.id))) {
            const io = getIO();
            io.emit('Imported',{filename : element.filename, taskId: element.taskId, status: 200});
          }
          // console.log(value.recordset[0]);
          for(let i = 1;i<types.length;i++){
            let temp = 3*(i-1);
            let sps = element.reserved.split('/');
            let sname  = sps[temp+0];
            let sparam = sps[temp+1];
            let svalue = sps[temp+2];
            if(types[i] == 'Z'){
              console.log("inside 1");
              const xml = toXML(value);
              console.log(xml);
              console.log(svalue);
              console.log(sparam);
              console.log(sname);
               value = await callSPforxml(element.spPath, sname, sparam, svalue,types[i],element.filename,element,xml);
               console.log("after callSPforxml");
               if(value){
               console.log(value.recordset[0]);
               }
            }else{
               value = await callSP(element.spPath, sname, sparam, svalue,types[i],element.filename,element);
            }
          }
          
          if(value==0){
            element.spStatus="No table found"
          }
          else if(value==-1){
            element.spStatus=410;
          }
          weekTaskInstance.saveTaskData();
      }
       updateTaskArray(element);
  }));
    if(result){
      return true;
    }


  } catch (error) {
    console.error(`Error in starting Import Routine: ${error.message}`);
    throw new HttpError(`Error in starting Import Routine: ${error.message}`, 500);
  }
}



// Function to get just the year-month-day part of a date
function getDateOnly(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // ensures 01-12
  const day = String(date.getDate()).padStart(2, '0');        // ensures 01-31
  return `${year}-${month}-${day}`;
}

export default bulkImport;
