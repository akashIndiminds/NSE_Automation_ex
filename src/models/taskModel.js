import getLocalSQLDateTime from "../utils/toLocalISOString.js";

export default class TaskModel {
    constructor(  dir , segment , folderPath , filename, spName , spParam , spParamValue , filepath , filetype,ePath,reserved,taskId,date,id) {
      // Validate required fields
      if ( !segment || !folderPath || !filename || !dir || !spName || !spParam || !spParamValue || !filetype) {
        throw new Error(
          "All fields ( dir, segment, folderPath , filename , spName , spParam , spParamValue , filetype) are required."
        );
      }
  
      // Assign fields using camelCase convention
      this.dir = dir;
      this.segment = segment;
      this.folderPath = folderPath;
      this.filename = filename;
      this.filepath = filepath;
      this.filetype = filetype;
      this.spName = spName;
      this.spParam = spParam;
      this.spParamValue = spParamValue;
      this.spPath = '';
      this.spStatus = 404;
      this.dlStatus = 404;
      this.ePath = ePath;
      this.reserved = reserved;
      this.lastModified = '';
      this.spTime = '';
      this.dlTime = '';
      this.createdTime =getLocalSQLDateTime(new Date());
      this.taskId=taskId;
      this.date = date;
      this.id = id;
      
    }
  }

  // const messagePayload = {
  //   token :  token,
  //   segment : segment, 
  //   folderPath : folderPath,
  //   filename : filename
  // };
    