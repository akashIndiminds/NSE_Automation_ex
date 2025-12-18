export default class DownloadPayload {
    constructor( token, dir , segment , folderPath , filename) {
      // Validate required fields
      if (!token || !segment || !folderPath || !filename || !dir) {
        throw new Error(
          "All fields (token, dir, segment, folderPath , filename) are required."
        );
      }
  
      // Assign fields using camelCase convention
      this.token = token;
      this.dir = dir;
      this.segment = segment;
      this.folderPath = folderPath;
      this.filename = filename;
    }
  }

  // const messagePayload = {
  //   token :  token,
  //   segment : segment, 
  //   folderPath : folderPath,
  //   filename : filename
  // };
    