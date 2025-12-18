import file_config from "../config/files.config.js";
import HttpError from "../utils/HttpError.js";
import generateFileNames from "./generateFileNames.service.js";
async function getDownloadlist(startDate , endDate)  {
    try {
      const result = {};
      const dir = Object.keys(file_config);
      for (let i = 0; i < dir.length; i++) {
        // console.log("Dir: "+dir[i]); 
        const dirName=dir[i];
        const folders = file_config[dirName];
        result[dirName] = {};
        const folderNames= Object.keys(folders); 
        for (let index = 0; index < folderNames.length; index++) {
          const folder=folderNames[index];
          result[dirName][folder]={};
          const folderObj = folders[folder];
          // console.log(folderObj.segment);
          result[dirName]['segment']=folderObj.segment;
              // console.log(folders[index]); 
            const generatedFileNames = await generateFileNames(startDate, endDate , folderObj);
            result[dirName][folder]=generatedFileNames;
              // console.log(result[[dir[i]]][folders[index]]);
              // console.log(generatedFileNames);
            }// end of inner loop
        
      } // end of outter loop


        return result;



    } catch (error) {
      throw new HttpError(`Error in intitializing synchronization: ${error.message}`, 500);
    }
  };

  // console.log(await getDownloadlist('2024-01-21','2024-01-25'));

  export default getDownloadlist;