// import fs from 'fs';
// import path from 'path';
// import SftpClient from 'ssh2-sftp-client';
// import sftpConfig from '../config/sftp.config.js';
// export async function saveFile(fileName, saveDirectory, data ,spDirectory) {
//   try {
//     await fs.promises.mkdir(saveDirectory, { recursive: true }); // Ensures the directory exists or creates it
//     const filePath = path.resolve(saveDirectory, fileName);
//     const spFilePath = path.resolve(spDirectory, fileName);


//     // **Changed: Added check for ArrayBuffer and converted it to Buffer**
//     if (data instanceof ArrayBuffer) {
//       const buffer = Buffer.from(data); // Convert ArrayBuffer to Buffer
//       // Write the buffer to the file


//       // await fs.promises.writeFile(filePath, buffer); // **Changed: Using fs.promises.writeFile**
      
//         const sftp = new SftpClient();

//     await sftp.connect(sftpConfig);

//     // Ensure remote directory exists
//     // try {
//     //   await sftp.mkdir(saveDirectory, true);
//     // } catch (err) {
//     //   // ignore if it already exists
//     // }

//     const remoteFilePath = path.posix.join(saveDirectory, fileName);

//     console.log(remoteFilePath);
//     await sftp.put(buffer, remoteFilePath);
//     console.log(`File uploaded to SFTP at ${remoteFilePath}`);

//     await sftp.end();
      
      
//       console.log(`File saved as ${filePath}`);
//       const pathsArray = [filePath, spFilePath]; // renamed variable
//       return pathsArray;
//     } else {
//       // **Changed: Explicit error handling for unsupported data types**
//       console.log(`Unsupported data type. Expected ArrayBuffer. ${data}`);
//     }
//   } catch (error) {
//     // **Changed: Improved error logging for better clarity**
//     console.log('Error saving the file:', error.message || error);
//   }
// }











// // src/utils/fileUtils.js
import fs from 'fs';
import path from 'path';

export async function saveFile(fileName, saveDirectory, data ,spDirectory) {
  try {
    await fs.promises.mkdir(saveDirectory, { recursive: true }); // Ensures the directory exists or creates it
    const filePath = path.resolve(saveDirectory, fileName);
    const spFilePath = path.resolve(spDirectory, fileName);


    // **Changed: Added check for ArrayBuffer and converted it to Buffer**
    if (data instanceof ArrayBuffer) {
      const buffer = Buffer.from(data); // Convert ArrayBuffer to Buffer
      // Write the buffer to the file
      await fs.promises.writeFile(filePath, buffer); // **Changed: Using fs.promises.writeFile**
      console.log(`File saved as ${filePath}`);
      const path = [filePath, spFilePath];
      return path;
    } else {
      // **Changed: Explicit error handling for unsupported data types**
      console.log(`Unsupported data type. Expected ArrayBuffer. ${data}`);
    }
  } catch (error) {
    // **Changed: Improved error logging for better clarity**
    console.log('Error saving the file:', error.message || error);
  }
}
