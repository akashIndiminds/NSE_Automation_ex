import checkDateFormat from '../utils/checkDateFormat.js';
import fileNameBuilder from '../utils/filenameBuilder.js';
import getDatesBetween from '../utils/getDatesBetween.js';
import HttpError from '../utils/HttpError.js'; 

async function generateFileNames(startDateInput, endDateInput , folderobj ) {
  try {
    const result ={}; 
    const startDate = checkDateFormat(String(startDateInput));
    if (!startDate) {
        throw new HttpError("Invalid start date format. Please use 'YYYY-MM-DD'.", 400);
      }
    
      const endDate = checkDateFormat(String(endDateInput));
      if (!endDate) {
        throw new HttpError("Invalid end date format. Please use 'YYYY-MM-DD'.", 400);
      }
    
      if (startDate > endDate) {
        throw new HttpError("END DATE cannot be smaller than START DATE.", 400);
      }

    // Generate file names
    const dates = getDatesBetween(startDate, endDate);
    const { file_name: fileNames, format: formats , spName: spNames , spParam: spParams , spParamValue: spParamValues , childPath: childPaths , file_type: file_types , reserved:reserved, id:id} = folderobj;
      // console.log(file_types);

    const generatedFileNames = await Promise.all(
      dates.map(date => fileNameBuilder(date, fileNames, formats , spNames , spParams , spParamValues , childPaths , file_types, reserved,id))
    );
    // console.log(generatedFileNames);
    result['file_name']= generatedFileNames.flat();
    return result; // Return file names for further processing
  } catch (error) {
    console.error("An error occurred in downloadFile:", error.message);
    throw error; // Re-throw the error for the caller to handle
  }
}

export default generateFileNames;
