import fs from 'fs';
import path from 'path';

async function overwriteFile(data) {
    try {
        const filePath = path.resolve('./src/config/userData.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent); // should be an object

        if (typeof jsonData === 'object' && jsonData !== null && !Array.isArray(jsonData)) {
         // Merge new keys into existing object
        const updatedData = { ...jsonData, ...data };

        // Write back to file
        fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');
        console.log('✅ Data appended to JSON file!');
       } else {
         throw new Error('Expected JSON object, but found array or invalid format.');
       }  
     } catch (error) {
        console.error('❌ Error appending data to JSON file:', error);
        throw error; // Re-throw the error for further handling
     }
}

export default overwriteFile;