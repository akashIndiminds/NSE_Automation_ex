import file_config from "../config/files.config.js"; // Configuration for files and directories
import { downloadFile } from "../utils/downloadFile.js"; // Function to download files
import getDownloadPayload from "../utils/getdownloadPayload.js"; // Generates payload for download
import HttpError from "../utils/HttpError.js"; // Custom error class for HTTP errors
import { saveFile } from "../utils/saveFile.js"; // Function to save files to disk
import generateFileNames from "./generateFileNames.service.js"; // Service to generate file names based on input dates

import pLimit from "p-limit"; // Library to control concurrency (install with npm install p-limit)

// Define a concurrency limit for simultaneous tasks
const limit = pLimit(20); // Change the limit as needed based on system capacity

/**
 * Function to start bulk download of files within a date range.
 * @param {string} startDate - Start date for the file range.
 * @param {string} endDate - End date for the file range.
 * @param {string} Token - Authentication token for API requests.
 * @returns {Promise<Array>} - List of files that failed to download, with reasons.
 */
async function startBulkDownload(startDate, endDate, Token) {
  const reDownload = []; // Array to store files that failed to download

  try {
    const Dir = Object.keys(file_config); // Get directory names from config

    // Iterate over each directory in the config
    for (const dirName of Dir) {
      const folders = file_config[dirName]; // Get folder details for the directory
      const folderNames = Object.keys(folders); // Get list of folder names

      // Iterate over each folder within the directory
      for (const folder of folderNames) {
        const folderObj = folders[folder]; // Get folder configuration
        const _segment = folderObj.segment; 
        const spNames = folderObj.sp.split(","); 

        // Generate file names for the given date range
        const generatedFileNames = await generateFileNames(startDate, endDate, folderObj);

        // Process each file with concurrency control
        await Promise.all(
          generatedFileNames.file_name.map((file, index) =>
            limit(async () => {
              const obj = {
                token: Token,
                dir: dirName,
                segment: _segment,
                folderPath: `/${folder}`,
                filename: file,
              };

              const messagePayload = getDownloadPayload(obj); // Generate payload for downloading the file

              try {
                // Attempt to download the file
                const fileData = await downloadFile(messagePayload);

                if (fileData instanceof HttpError) {
                  // Handle HTTP error case
                  reDownload.push({
                    messagePayload,
                    sp: spNames[index],
                    reason: fileData.statusCode,
                  });
                  console.error(`Failed to download: ${file}, Reason: ${fileData.statusCode}`);
                } else {
                  // Save the file to the local directory if download is successful
                  const saveDirectory = `./AutoDocs/${messagePayload.dir}/${messagePayload.segment}/${messagePayload.folderPath}`;
                  await saveFile(messagePayload.filename, saveDirectory, fileData);
                  // console.log(`Successfully saved: ${file}`);
                }
              } catch (error) {
                // Catch unexpected errors during the download process
                console.error(`Error processing file ${file}: ${error.message}`);
                reDownload.push({
                  messagePayload,
                  sp: spNames[index],
                  reason: 500,
                });
              }
            })
          )
        );
      }
    }

    // Return the list of files that failed to download
    return reDownload;
  } catch (error) {
    // Catch any error that occurs during the bulk download process
    console.error(`Error in initializing synchronization: ${error.message}`);
    throw new HttpError(`Error in initializing synchronization: ${error.message}`, 500);
  }
}

export default startBulkDownload;
