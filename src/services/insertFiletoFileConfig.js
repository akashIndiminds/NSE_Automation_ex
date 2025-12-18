import { getPool } from "../../connection.js";
import getLocalSQLDateTime from "../utils/toLocalISOString.js"; 

const insertDataToFileConfig = async (fileData) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    const fileName = fileData.fileName;
    const fileType = fileData.fileType || "N";
    const format = fileData.format;
    const dirName = fileData.dirName;
    const segment = fileData.segment;
    const folder = fileData.folder;
    const childPath = fileData.childPath;
    const createdAt = getLocalSQLDateTime(new Date());
    
    const query = `
      INSERT INTO File_Config 
      (childPath, file_name, file_type, format, spName, spParam, spParamValue, dirName, segment, folderName, created_at, reserved, notifyMe)
      VALUES 
      (@childPath, @fileName, @fileType, @format, '-', '-', '-', @dirName, @segment, @folder, @createdAt, '', '')
    `;
    
    request.input('childPath', childPath || '');
    request.input('fileName', fileName || '');
    request.input('dirName', dirName || '');
    request.input('segment', segment || '');
    request.input('folder', folder || '');
    request.input('fileType', fileType);
    request.input('format', format || '');
    request.input('createdAt', createdAt);
    
    const result = await request.query(query);
    
    console.log("File inserted successfully to FileConfig");
    return result;
    
  } catch (error) {
    console.error("Error inserting file to file config:", error);
    throw error;
  }
};

export default insertDataToFileConfig;