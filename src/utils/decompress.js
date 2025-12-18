import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import zlib from 'zlib';



function handleZipFile(filePath , spFilePath) {
  try {
    const zip = new AdmZip(filePath);
    const outputDir = path.dirname(filePath);
    const spOutputDir = path.dirname(spFilePath);

  
    // Extract all files to the target directory
    zip.extractAllTo(outputDir, true);
  
    // Get the list of extracted files
    const extractedFiles = zip.getEntries().map(entry => path.join(spOutputDir, entry.entryName));
    return extractedFiles[0];
  } catch (error) {
    console.error('Error extracting ZIP file:', error);
  }
}

// Function to handle GZ files
function handleGzFile(filePath , spFilePath) {
  try {
    return new Promise((resolve, reject) => {
      const decompressedFilePath = path.join(path.dirname(filePath), path.basename(filePath, '.gz'));
      const decompressedSpFilePath = path.join(path.dirname(spFilePath), path.basename(spFilePath, '.gz'));

      
      const input = fs.createReadStream(filePath);
      const output = fs.createWriteStream(decompressedFilePath);
      
      // Pipe input to gunzip and then output
      input.pipe(zlib.createGunzip()).pipe(output);
  
      // When decompression finishes, resolve the promise with the decompressed file path
      output.on('finish', () => {
        // console.log(`Decompressed GZ file to ${decompressedFilePath}`);
        resolve(decompressedSpFilePath); // Return the decompressed file path
      });
  
      // Handle errors
      output.on('error', (error) => {
        console.error('Error during decompression:', error);
        reject(error); // Reject the promise if there's an error
      });
    });
  } catch (error) {
    console.error('Error handling GZ file:', error);
  }
  }

// Function to determine file type and handle accordingly
function handleCompressedFile(filePath , spFilePath) {
  try{
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.zip'){ 
   const decompressedFilePath = handleZipFile(filePath , spFilePath);
   return decompressedFilePath;
}
  else if (ext === '.gz') {
    const decompressedFilePath = handleGzFile(filePath , spFilePath);
   return decompressedFilePath;

}
  else return spFilePath;
} catch (error) {
  console.error('Error handling compressed file:', error);
  throw error; // Re-throw the error for further handling
}
}

async function decompress(filePath,spFilePath) {

//   const downloadPath = '\\\\FITMINDS\\Work\\Application_Release\\CommonFolderInfluxCRM\\AutoDocs\\member\\CM\\Reports\\STT_NCL_CM_0_CM_08565_20250212_F_0000.csv.gz'; // Replace with desired path

  try {
   const newFilePath = handleCompressedFile(filePath,spFilePath); // Handle based on file extension
   return newFilePath;
  } catch (error) {
    console.error('Error decompressing', error);
  }
}

// console.log(await decompress('\\\\FITMINDS\\Work\\Application_Release\\CommonFolderInfluxCRM\\AutoDocs\\common\\CM\\bhavcopy\\BhavCopy_NSE_CM_0_0_0_20250212_F_0000.csv.zip'));
export default decompress;
